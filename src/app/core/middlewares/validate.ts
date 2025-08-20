import { NextFunction, Request, RequestHandler, Response } from 'express';
import z from 'zod';
import { fromZod } from '../errors/errorsMapper';

const validate = (
	schema: z.ZodType,
	source: 'body' | 'query' | 'params' = 'body'
): RequestHandler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const dto =
			source === 'body'
				? req.body
				: source === 'params'
				? req.params
				: req.query;
		const result = await schema.safeParseAsync(dto);

		if (!result.success) {
			throw fromZod(result.error);
		}

		req.validated ??= {};
		req.validated[source] = result.data;

		if (source === 'body') {
			req.body = result.data;
		}
		return next();
	};
};

export default validate;
