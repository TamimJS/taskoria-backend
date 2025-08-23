import { Router } from 'express';
import AuthController from './authController';
import asyncHandler from '@/app/core/lib/asyncHandler';
import validate from '@/app/core/middlewares/validate';
import { LoginSchema, RegisterSchema } from './authSchemas';

function CreateAuthRoutes(controller: AuthController): Router {
	const router = Router();

	router.post(
		'/register',
		validate(RegisterSchema, 'body'),
		asyncHandler(controller.handleRegister.bind(controller))
	);
	router.post(
		'/login',
		validate(LoginSchema, 'body'),
		asyncHandler(controller.handleLogin.bind(controller))
	);
	// router.post('/logout');

	return router;
}

export default CreateAuthRoutes;
