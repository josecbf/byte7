/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Gera versões JPG otimizadas das capturas para envio por WhatsApp.
 *   - redimensiona para largura máxima de 1280 px (WhatsApp comprime abaixo disso)
 *   - qualidade JPG 82 com mozjpeg
 *   - cada imagem fica abaixo de ~500 KB
 *
 * Uso: node scripts/optimize-for-whatsapp.js
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = path.resolve(__dirname, "..", "docs", "screenshots");
const OUT = path.resolve(__dirname, "..", "docs", "whatsapp");

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const files = fs
    .readdirSync(SRC)
    .filter((f) => f.endsWith(".png"))
    .sort();

  let total = 0;
  for (const f of files) {
    const src = path.join(SRC, f);
    const dest = path.join(OUT, f.replace(/\.png$/, ".jpg"));
    await sharp(src)
      .resize({ width: 1280, withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(dest);
    const size = fs.statSync(dest).size;
    total += size;
    console.log(`${path.basename(dest).padEnd(38)} ${(size / 1024).toFixed(0)} KB`);
  }
  console.log(`\nTotal: ${(total / 1024 / 1024).toFixed(2)} MB em ${files.length} arquivos`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
