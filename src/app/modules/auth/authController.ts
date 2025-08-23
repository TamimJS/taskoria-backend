import { Request, Response, NextFunction } from 'express';

import AuthServices from './authServices';
import { TloginDTO, TRegisterDTO } from './authTypes';
import HTTP_STATUS from '@/app/core/lib/httpStatus';

class AuthController {
	constructor(private services: AuthServices) {}

	public async handleRegister(req: Request, res: Response, next: NextFunction) {
		const registerData = req.body as TRegisterDTO;
		const result = await this.services.register(registerData);

		return res.status(HTTP_STATUS.CREATED).json({
			status: 'success',
			message: 'Registration successful',
			data: result
		});
	}

	public async handleLogin(req: Request, res: Response, next: NextFunction) {
		const loginData = req.body as TloginDTO;
		const result = await this.services.login(loginData);

		return res.status(HTTP_STATUS.OK).json({
			status: 'success',
			message: 'Login successful',
			data: result
		});
	}
}

export default AuthController;
