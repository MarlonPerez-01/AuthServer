import { Router } from 'express';
import { authRoute } from './auth.routes';
import { usuarioRoute } from './usuario.routes';

const router = Router();

const routes = [
  { path: '/auth', route: authRoute },
  { path: '/usuarios', route: usuarioRoute },
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export { router };
