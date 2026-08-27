// Genera los íconos PWA de Punto Limpio Inteligente (Vitacura) a partir de un
// SVG dibujado a mano: contenedor de reciclaje teal con una flecha curva
// verde lima encima, sobre fondo blanco con bordes redondeados. Mismo diseño
// que IconoLogo en src/App.jsx (header de la app). Rasteriza a PNG en
// 192x192 y 512x512 con sharp.
//
// Uso: node scripts/generate-icons.js

import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");
const TAMANOS = [192, 512];

const ICONO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#ffffff"/>
  <!-- Contenedor -->
  <rect x="19" y="41" width="62" height="6" rx="3" fill="#00A99D"/>
  <rect x="25" y="47" width="50" height="46" rx="9" fill="#00A99D"/>
  <rect x="41" y="58" width="5.5" height="25" rx="2.75" fill="#ffffff" opacity="0.5"/>
  <rect x="55" y="58" width="5.5" height="25" rx="2.75" fill="#ffffff" opacity="0.5"/>
  <!-- Flecha curva de reciclaje -->
  <path d="M18,32 C32,10 68,10 82,32" stroke="#8DC63F" stroke-width="8" stroke-linecap="round" fill="none"/>
  <polygon points="72,17 90,32 70,40" fill="#8DC63F"/>
</svg>
`.trim();

mkdirSync(OUT_DIR, { recursive: true });

const svgBuffer = Buffer.from(ICONO_SVG);

for (const size of TAMANOS) {
  const buffer = await sharp(svgBuffer, { density: (size / 100) * 96 })
    .resize(size, size)
    .png()
    .toBuffer();
  const archivo = join(OUT_DIR, `icon-${size}.png`);
  writeFileSync(archivo, buffer);
  console.log(`✓ Generado ${archivo} (${buffer.length} bytes)`);
}
