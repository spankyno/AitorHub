import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido.' });
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : 'Desconocida';

    // 1. Intentar obtener datos de Vercel
    let country = req.headers['x-vercel-ip-country'] || 'Desconocido';
    let city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : 'Desconocida';

    // 2. FALLBACK: Si la ciudad es desconocida e IP no es local, usamos API externa
    if (city === 'Desconocida' && ipAddress !== 'Desconocida' && ipAddress !== '::1' && ipAddress !== '127.0.0.1') {
        try {
            // Usamos un timeout corto para no ralentizar la respuesta
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 2000); // 2 segundos max

            const geoRes = await fetch(`https://ipapi.co/${ipAddress}/json/`, { signal: controller.signal });
            const geoData = await geoRes.json();
            
            clearTimeout(id);

            if (geoData.city && geoData.city !== 'undefined') {
                city = geoData.city;
                // Si Vercel tampoco detectó el país, lo actualizamos
                if (country === 'Desconocido') country = geoData.country_name;
            }
        } catch (apiError) {
            console.error('Error en fallback de geolocalización:', apiError.message);
            // Si falla la API externa, seguimos con "Desconocida" para no romper el flujo
        }
    }

    try {
        // 3. Inserción en Neon
        await sql`
            INSERT INTO visits (ip_address, country, city) 
            VALUES (${ipAddress}, ${country}, ${city})
        `;

        res.status(200).json({ 
            success: true, 
            ip: ipAddress,
            location: { country, city } 
        });

    } catch (error) {
        console.error('Error en BD:', error);
        res.status(500).json({ success: false, details: error.message });
    }
}