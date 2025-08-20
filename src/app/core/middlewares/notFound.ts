import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors';

/**
 * When no route matches, Express reaches this handler.
 * We convert it to a NotFoundError so the error middleware can format it.
 */

export default function notFound(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	next(new NotFoundError('Route not found'));
}
