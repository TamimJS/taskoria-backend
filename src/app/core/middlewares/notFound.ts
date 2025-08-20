import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors';

export default function notFound(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	next(new NotFoundError('Route not found'));
}
