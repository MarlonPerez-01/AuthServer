import { Router } from 'express';
import { validate } from '../middlewares/validar';
import { apiLimiter } from '../middlewares/rateLimiter';
import * as authValidation from '../validations/auth.validations';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.use('/auth', router);

router.post('/signup', validate(authValidation.signup), authController.Signup);

router.post('/signin', validate(authValidation.signin), authController.Signin);

router.post('/signin-google', validate(authValidation.signinGoogle), authController.SigninGoogle);

router.post('/refresh-token', validate(authValidation.refreshToken), authController.RefreshToken);

router.post('/logout', validate(authValidation.logout), authController.Logout);

router.post(
  '/resend-verification-email',
  validate(authValidation.resendVerificationEmail),
  authController.ResendVerificationEmail
);

router.post('/verify-email', validate(authValidation.verifyEmail), authController.VerifyEmail);

router.post('/change-password', validate(authValidation.changePassword), authController.ChangePassword);

router.post('/forgot-password', validate(authValidation.forgotPassword), authController.ForgotPassword);

router.post('/reset-password', validate(authValidation.resetPassword), authController.ResetPassword);

export { router as authRoute };
