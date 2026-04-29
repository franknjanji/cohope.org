import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import route handlers
import contactRoutes from './api/contact.js';
import registerRoutes from './api/register.js';
import newsletterRoutes from './api/newsletter.js';
import callbackRoutes from './api/callback.js';

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/callback', callbackRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'COHOPE API is running' });
});

// Serve the main HTML file for all other routes (SPA-like behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`COHOPE Culture School server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the website`);
});
