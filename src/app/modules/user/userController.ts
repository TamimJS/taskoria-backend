import { Request, Response, NextFunction } from 'express';
import UserServices from './userServices';
import HTTP_STATUS from '@/app/core/lib/httpStatus';
import { TUserCreateDTO, TUserQuery, TUserUpdateDTO } from './userTypes';

class UserController {
	constructor(private services: UserServices) {}

	public async handleGetUsers(req: Request, res: Response, next: NextFunction) {
		const query = (req.validated?.query ?? {}) as TUserQuery;
		const users = await this.services.getUsers(query);

		return res.status(HTTP_STATUS.OK).json({
			status: 'success',
			meta: {
				total: users.total,
				page: req.query.page || 1,
				limit: req.query.limit || 10
			},
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
		req: Request<{}, {}, TUserCreateDTO>,
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
		req: Request<{ id: string }, {}, TUserUpdateDTO>,
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
