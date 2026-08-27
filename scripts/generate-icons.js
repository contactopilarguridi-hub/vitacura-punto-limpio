// Genera los íconos PWA de Punto Limpio Inteligente (Vitacura) a partir de un
// SVG dibujado a mano: hoja verde con flecha de reciclaje en teal sobre fondo
// blanco. Rasteriza a PNG en 192x192 y 512x512 con sharp.
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
  <circle cx="50" cy="50" r="48" fill="#00A99D"/>
  <!-- Hoja -->
  <path d="M50 20 C30 20 20 35 20 50 C20 65 35 75 50 75 C65 75 80 65 80 50 C80 35 70 20 50 20Z" fill="#8DC63F"/>
  <!-- Nervadura -->
  <path d="M50 25 L50 70" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M50 45 C40 40 32 42 28 48" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M50 55 C60 50 68 52 72 58" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
  <!-- Flecha reciclaje pequeña abajo -->
  <path d="M38 78 L50 88 L62 78" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
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
