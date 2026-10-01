import { Router } from 'express';
import type { Request, Response } from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/', upload.single('imagem'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;