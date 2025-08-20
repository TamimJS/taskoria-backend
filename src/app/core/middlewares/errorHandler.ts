import { Request, Response, NextFunction } from 'express';
import { fromPrisma } from '../errors/errorsMapper';
import getErrorResponse from '../lib/errorResponse';
import AppError, { InternalServerError } from '../errors';
import config from '@/config';

/**
 * Final error handler: every thrown error ends here.
 * It:
 *  - maps Prisma errors (race conditions etc.)
 *  - formats AppError consistently
 *  - hides details for unknown errors, but logs them
 */

export function errorHandler() {
	return (err: unknown, req: Request, res: Response, _next: NextFunction) => {
		// Map known Prisma errors to AppErrors (e.g., P2002 -> inline field error)
		const prismaMapped = fromPrisma(err);
		if (prismaMapped) {
			return getErrorResponse(res, {
				status: prismaMapped.status,
				code: prismaMapped.code,
				message: prismaMapped.message,
				fieldErrors: prismaMapped.fieldErrors,
				meta: prismaMapped.meta
			});
		}

		// AppError? Great, respond with its data
		if (err instanceof AppError) {
			// Log operational errors only in development or if they're 5xx
			if (config.NODE_ENV === 'development' || err.status >= 500) {
				console.error('[AppError]', { err });
			}

			return getErrorResponse(res, {
				status: err.status,
				code: err.code,
				message: err.message,
				fieldErrors: err.fieldErrors,
				meta: err.meta
			});
		}

		// Unknown/unexpected error — do not leak details to clients
		console.error('[UnhandledError]', {
			message: err instanceof Error ? err.message : 'Unknown Error',
			stack: err instanceof Error ? err.stack : undefined,
			url: req.url,
			method: req.method
		});

		const internal = new InternalServerError();
		const message =
			config.NODE_ENV === 'production'
				? internal.message
				: err instanceof Error
				? err.message
				: 'Unknown Error';

		return getErrorResponse(res, {
			status: internal.status,
			code: internal.code,
			message,
			meta:
				config.NODE_ENV === 'development'
					? { originalError: String(err) }
					: undefined
		});
	};
}
