import { Request, Response, NextFunction } from 'express';
import UserServices from './userServices';
import HTTP_STATUS from '@/app/core/lib/httpStatus';
import { CreateUserDTO, UpdateUserDTO } from './userTypes';

class UserController {
	constructor(private services: UserServices) {}

	public async handleGetUsers(req: Request, res: Response, next: NextFunction) {
		const users = await this.services.getUsers();
		const count = await this.services.countUsers();

		return res.status(HTTP_STATUS.OK).json({
			status: 'success',
			count,
			data: users
		});
	}

	public async handleGetUserById(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const user = await this.services.getUserById(req.params.id);

		return res.status(HTTP_STATUS.OK).json({
			status: 'success',
			data: user
		});
	}

	public async handlePostUsers(
		req: Request<{}, {}, CreateUserDTO>,
		res: Response,
		next: NextFunction
	) {
		const user = await this.services.createUser(req.body);

		return res.status(HTTP_STATUS.CREATED).json({
			status: 'created',
			message: 'User created successfully',
			data: user
		});
	}

	public async handlePutUser(
		req: Request<{ id: string }, {}, UpdateUserDTO>,
		res: Response,
		next: NextFunction
	) {
		const user = await this.services.updateUser(req.params.id, req.body);

		return res.status(HTTP_STATUS.OK).json({
			status: 'success',
			message: 'User updated successfully',
			data: user
		});
	}

	public async handleDeleteUser(
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction
	) {
		await this.services.deleteUser(req.params.id);
		return res.status(HTTP_STATUS.OK).json({
			status: 'success',
			message: 'User deleted successfully'
		});
	}
}

export default UserController;
