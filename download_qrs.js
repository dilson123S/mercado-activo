const fs = require('fs');
const path = require('path');
const https = require('https');

// Base URL para los códigos QR. Puedes cambiar esta URL si despliegas la app en Vercel, Render, etc.
const BASE_URL = 'https://mercado-activo.vercel.app'; 
const OUTPUT_DIR = path.join(__dirname, 'QRs_para_imprimir');

const STOCKS = [
  "NVDA", "AETH", "QBYT", "CMND", "NLNK", "TITN"
];

if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
}

console.log(`Iniciando descarga de ${STOCKS.length} códigos QR de alta resolución (500x500)...`);
console.log(`Apuntando a: ${BASE_URL}\n`);

function downloadQR(symbol) {
  return new Promise((resolve, reject) => {
    const targetUrl = `${BASE_URL}/?symbol=${symbol}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=0d1426&bgcolor=ffffff&data=${encodeURIComponent(targetUrl)}`;
    const filePath = path.join(OUTPUT_DIR, `QR_${symbol}.png`);
    
    const file = fs.createWriteStream(filePath);
    https.get(qrApiUrl, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Error HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Descargado: QR_${symbol}.png`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function start() {
  for (const symbol of STOCKS) {
    try {
      await downloadQR(symbol);
    } catch (err) {
      console.error(`✗ Error en ${symbol}:`, err.message);
    }
  }
  console.log(`\n¡Completado! Los ${STOCKS.length} códigos QR de alta resolución se han guardado en:\n${OUTPUT_DIR}`);
}

start();
