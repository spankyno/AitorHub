import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Allowed origins — update with your production domain
const ALLOWED_ORIGINS = [
  'https://aitorhub.vercel.app',
  'http://localhost:3000',
];

// Simple IPv4/IPv6 format validation
function isValidIP(ip) {
  if (!ip || typeof ip !== 'string') return false;
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6 = /^[a-fA-F0-9:]+$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

// In-memory rate limiter (per cold-start instance)
// For production, replace with Vercel KV or Upstash Redis
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;           // max requests per IP per window

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

export default async function handler(req, res) {
  // ── CORS / Origin check ─────────────────────────────────────────────────
  const origin = req.headers['origin'] || req.headers['referer'] || '';
  const originAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));

  res.setHeader('Access-Control-Allow-Origin', originAllowed ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (!originAllowed) {
    return res.status(403).json({ success: false, message: 'Origen no permitido.' });
  }

  // ── Method guard ─────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido.' });
  }

  // ── IP resolution (trusted Vercel headers first) ─────────────────────────
  // x-real-ip and x-vercel-forwarded-for are set by Vercel infrastructure
  // and cannot be spoofed by the client.
  const rawIP =
    req.headers['x-real-ip'] ||
    req.headers['x-vercel-forwarded-for'] ||
    'Desconocida';

  // Sanitise: take only the first address if a comma-separated list arrives
  const ipAddress = rawIP.split(',')[0].trim();

  // Validate format to reject obviously malformed values
  if (ipAddress !== 'Desconocida' && !isValidIP(ipAddress)) {
    return res.status(400).json({ success: false, message: 'IP inválida.' });
  }

  // ── Rate limiting ────────────────────────────────────────────────────────
  if (isRateLimited(ipAddress)) {
    return res.status(429).json({ success: false, message: 'Demasiadas solicitudes. Inténtalo más tarde.' });
  }

  // ── Geolocation ──────────────────────────────────────────────────────────
  // 1. Try Vercel-provided headers (zero latency, most reliable)
  let country = req.headers['x-vercel-ip-country'] || 'Desconocido';
  let city = req.headers['x-vercel-ip-city']
    ? decodeURIComponent(req.headers['x-vercel-ip-city'])
    : 'Desconocida';

  // 2. Fallback to external geo API only for non-local IPs
  const isLocalIP = ['::1', '127.0.0.1', 'Desconocida'].includes(ipAddress);

  if (city === 'Desconocida' && !isLocalIP) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const geoRes = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.city && geoData.city !== 'undefined') {
          city = geoData.city;
          if (country === 'Desconocido' && geoData.country_name) {
            country = geoData.country_name;
          }
        }
      }
    } catch (apiError) {
      // Non-fatal: continue with 'Desconocida'
      console.error('Error en fallback de geolocalización:', apiError.message);
    }
  }

  // ── app_name extraction ──────────────────────────────────────────────────
  let appName = '/home';
  try {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    const parsed = JSON.parse(raw);
    if (typeof parsed.app_name === 'string' && parsed.app_name.trim()) {
      appName = parsed.app_name.trim().slice(0, 150);
    }
  } catch { /* body vacío o malformado — appName queda '/home' */ }

  // ── Database insert ──────────────────────────────────────────────────────
  try {
    await sql`
      INSERT INTO visits (ip_address, country, city, app_name)
      VALUES (${ipAddress}, ${country}, ${city}, ${appName})
    `;

    return res.status(200).json({
      success: true,
      location: { country, city },
    });
  } catch (error) {
    // Log the full error server-side but NEVER send details to the client
    console.error('Error en BD:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
}
