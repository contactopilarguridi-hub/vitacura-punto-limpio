// Genera los íconos PNG institucionales de Punto Limpio Inteligente (Vitacura).
// Fondo circular teal (#00A99D) con las letras "PL" en blanco, en 192x192 y 512x512.
//
// Uso: node scripts/generate-icons.js

import { createCanvas } from "canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "icons");

const TEAL = "#00A99D";
const WHITE = "#FFFFFF";
const TAMANOS = [192, 512];

function dibujarIcono(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");
  const centro = size / 2;
  const radio = size / 2;

  // Fondo circular teal
  ctx.fillStyle = TEAL;
  ctx.beginPath();
  ctx.arc(centro, centro, radio, 0, Math.PI * 2);
  ctx.fill();

  // Letras "PL" en blanco, centradas
  ctx.fillStyle = WHITE;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${Math.round(size * 0.42)}px Arial, "Helvetica Neue", sans-serif`;
  // Pequeño ajuste vertical porque el "middle" de canvas no siempre queda
  // ópticamente centrado con fuentes bold en mayúsculas.
  ctx.fillText("PL", centro, centro + size * 0.03);

  return canvas;
}

mkdirSync(OUT_DIR, { recursive: true });

for (const size of TAMANOS) {
  const canvas = dibujarIcono(size);
  const buffer = canvas.toBuffer("image/png");
  const archivo = join(OUT_DIR, `icon-${size}.png`);
  writeFileSync(archivo, buffer);
  console.log(`✓ Generado ${archivo} (${buffer.length} bytes)`);
}
