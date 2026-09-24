import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists for local storage fallback
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk storage engine for local file saving
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^\w-]/g, '');
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

// File filter for allowed image and spec sheet document types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type '${ext}'. Only JPG, PNG, WEBP, SVG, and PDF are permitted.`), false);
  }
};

export const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});
