// api/log-visit.js (Versión ESM y optimizada para Neon)

// ➡️ Usamos la sintaxis ESM (import)
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido.' });
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : 'Desconocida';

    // 1. Intentamos obtener ubicación de los headers de Vercel
    let country = req.headers['x-vercel-ip-country'] || 'Desconocido';
    let city = decodeURIComponent(req.headers['x-vercel-ip-city'] || 'Desconocida');

    try {
        // 2. Si Vercel no nos da la info y la IP es válida, podríamos usar un fetch rápido (Opcional)
        // if (country === 'Desconocido' && ipAddress !== 'Desconocida') {
        //    const geoRes = await fetch(`https://ipapi.co/${ipAddress}/json/`);
        //    const geoData = await geoRes.json();
        //    country = geoData.country_name || country;
        //    city = geoData.city || city;
        // }

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
        console.error('Error:', error);
        res.status(500).json({ success: false, details: error.message });
    }
}
