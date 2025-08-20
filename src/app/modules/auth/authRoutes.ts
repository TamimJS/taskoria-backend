import { Router } from 'express';
import AuthController from './authController';

function CreateAuthRoutes(controller: AuthController): Router {
	const router = Router();

	router.post('/register');
	router.post('/login');
	router.post('/logout');

	return router;
}

export default CreateAuthRoutes;
