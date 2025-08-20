import { Router } from 'express';
import UserController from './userController';
import asyncHandler from '@/app/core/lib/asyncHandler';
import validate from '@/app/core/middlewares/validate';
import { CreateUserSchema, UpdateUserSchema } from './userSchemas';

function CreateUserRoutes(controller: UserController): Router {
	const router = Router();

	router.get('/', asyncHandler(controller.handleGetUsers.bind(controller)));

	router.get(
		'/:id',
		asyncHandler(controller.handleGetUserById.bind(controller))
	);

	router.post(
		'/',
		validate(CreateUserSchema, 'body'),
		asyncHandler(controller.handlePostUsers.bind(controller))
	);

	router.put(
		'/:id',
		validate(UpdateUserSchema, 'body'),
		asyncHandler(controller.handlePutUser.bind(controller))
	);

	router.delete(
		'/:id',
		asyncHandler(controller.handleDeleteUser.bind(controller))
	);

	return router;
}

export default CreateUserRoutes;
