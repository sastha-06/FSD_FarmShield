import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODELS_DIR = path.resolve(__dirname, '../models');

const ASSETS = [
  {
    name: 'model_with_features_quantized.onnx',
    url: 'https://huggingface.co/rodynaemad/plant-disease-dinov2-small/resolve/main/onnx/model_with_features_quantized.onnx',
    minSize: 20 * 1024 * 1024, // ~23.1 MB
    description: 'DINOv2-small 8-bit quantized ONNX model'
  },
  {
    name: 'centroids.f32',
    url: 'https://huggingface.co/spaces/rodynaemad/plant-disease-scanner/resolve/main/centroids.f32',
    minSize: 100 * 1024, // 114 KB
    description: 'Class embedding centroids for Out-Of-Distribution detection'
  },
  {
    name: 'meta.json',
    url: 'https://huggingface.co/spaces/rodynaemad/plant-disease-scanner/raw/main/meta.json',
    minSize: 500, // 1.2 KB
    description: 'Label definitions and similarity threshold'
  }
];

async function downloadFile(url, destPath) {
  console.log(`Downloading from: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed with HTTP ${res.status}: ${res.statusText}`);
  }
  const fileStream = fs.createWriteStream(destPath);
  const reader = res.body.getReader();
  let downloadedBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    fileStream.write(value);
    downloadedBytes += value.length;
    process.stdout.write(`\r  Progress: ${(downloadedBytes / (1024 * 1024)).toFixed(2)} MB`);
  }
  fileStream.end();
  console.log(`\n  Saved to: ${destPath} (${(downloadedBytes / 1024).toFixed(1)} KB)`);
}

export async function setupModelAssets() {
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
  }

  console.log('====================================================');
  console.log('🌿 FarmShield DINOv2 Model Asset Verification');
  console.log('====================================================');

  for (const asset of ASSETS) {
    const filePath = path.join(MODELS_DIR, asset.name);
    let needDownload = true;

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size >= asset.minSize) {
        console.log(`✓ ${asset.name} already exists and verified (${(stats.size / 1024).toFixed(1)} KB)`);
        needDownload = false;
      } else {
        console.warn(`! ${asset.name} is undersized (${stats.size} bytes). Re-downloading...`);
      }
    }

    if (needDownload) {
      console.log(`→ Downloading ${asset.description} (${asset.name})...`);
      try {
        await downloadFile(asset.url, filePath);
      } catch (err) {
        console.error(`✗ Error downloading ${asset.name}:`, err.message);
        throw err;
      }
    }
  }

  console.log('====================================================');
  console.log('✅ All DINOv2 model assets are ready for local inference!');
  console.log('====================================================\n');
}

// Allow direct CLI invocation
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  setupModelAssets().catch((err) => {
    console.error('Model setup failed:', err);
    process.exit(1);
  });
}
