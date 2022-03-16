import * as path from 'path';
import { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { ApiError } from '../helpers/ApiError';
import { StatusCodes } from 'http-status-codes';
import { randomUUID } from 'crypto';

const destination = path.join(__dirname, '../../public/uploads');
const limits = { fileSize: 4 * 1024 * 1024 }; // 4MB max file size

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, destination);
  },
  filename: (req: Request, file, cb) => {
    cb(null, randomUUID() + path.extname(file.originalname));
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, 'Solo se permiten imagenes de tipo jpg y png'));
  }
};

export const upload = multer({ storage, fileFilter, limits });
