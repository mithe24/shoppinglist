import express from 'express';
import type { Express, Request, Response } from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import appRoutes from './routes/appRoutes.js';

const app: Express = express();
const PORT: number = process.env.PORT || 5000;

// IMPORTANT: This app is expected to run behind a reverse proxy (e.g., NGINX, Traefik).
// It does not handle HTTPS itself. DO NOT expose this server directly to the internet.
// Not running this app behind a reverse proxy risks a man in the middle attack (MITM).

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')))
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.use('/auth', authRoutes);
app.use('/api', appRoutes);

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})

