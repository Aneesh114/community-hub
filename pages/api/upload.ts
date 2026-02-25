import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import cloudinary from '../../lib/cloudinary';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest & { file?: Express.Multer.File }, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  upload.single('file')(req as any, res as any, async (err: any) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Upload error' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'community-hub',
        },
        (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Upload failed' });
          }
          res.status(200).json({ url: result?.secure_url });
        }
      );
      (stream as unknown as NodeJS.WritableStream).end(req.file.buffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
}
