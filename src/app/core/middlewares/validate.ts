import { NextFunction, Request, RequestHandler, Response } from 'express';
import z from 'zod';
import { fromZod } from '../errors/errorsMapper';

const validate = (
	schema: z.ZodType,
	source: 'body' | 'query' | 'params' = 'body'
): RequestHandler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const dto = (req as any)[source];
		const result = await schema.safeParseAsync(dto);

		if (!result.success) {
			throw fromZod(result.error);
		}

		(req as any)[source] = result.data;
		return next();
	};
};

export default validate;
