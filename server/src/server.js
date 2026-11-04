import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, getDbStatus } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env to ensure env vars are loaded regardless of execution directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FarmShield API',
    database: getDbStatus(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/location', locationRoutes);

// Serve built frontend if client/dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Image size exceeds maximum limit of 10MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Image upload error: ${err.message}`,
    });
  }
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🌾 FarmShield Server active on http://localhost:${PORT}`);
  console.log(`📡 Ready for AI-Powered Farmer Decision Support`);
  console.log(`====================================================`);
});
