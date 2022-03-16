import { Router } from 'express';

import * as usuarioValidation from '../validations/usuario.validation';
import * as usuarioController from '../controllers/usuario.controller';
import { Autorizar } from '../middlewares/autorizar';
import { validate } from '../middlewares/validar';
import { upload } from '../config/multer';

const router = Router();

router.use('/usuarios', router);

router.get(
  '/:id',
  Autorizar(['normal', 'premium']),
  validate(usuarioValidation.obtener),
  usuarioController.ObtenerById
);

router.put(
  '/:id',
  Autorizar(['normal', 'premium']),
  upload.single('image'),
  validate(usuarioValidation.actualizar),
  usuarioController.Actualizar
);

export { router as usuarioRoute };
