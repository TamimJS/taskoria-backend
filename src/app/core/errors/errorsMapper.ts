/**
 * Zod & Prisma mappers (with inline errors)
 */
import { z, ZodError } from 'zod';
import { Prisma } from '@/generated/prisma';
import { BadRequestError, NotFoundError, ValidationError } from '.';

/**
 * Convert a ZodError to a ValidationError with fieldErrors
 * so the frontend can display inline messages under inputs.
 */
export const fromZod = (err: ZodError) => {
	const { fieldErrors } = z.flattenError(err);
	return new ValidationError('Validation Error', fieldErrors);
};

/**
 * Convert Prisma known request errors to AppErrors.
 * - P2002: unique constraint -> inline field error (e.g., email)
 * - P2025: record not found -> 404
 * Other codes: treat as 400 (bad request) with code included
 *
 * NOTE: For anti-enumeration, we use a neutral email message.
 */
export const fromPrisma = (err: unknown) => {
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		switch (err.code) {
			case 'P2002': {
				const target = (err.meta?.target as string[] | undefined) ?? [];
				const field = target[0] ?? 'field';
				return new ValidationError('Validation Error', {
					[field]: ['Unable to use this email address']
				});
			}

			case 'P2025': {
				return new NotFoundError('Resource not found');
			}

			default:
				return new BadRequestError(`Database error (${err.code})`);
		}
	}

	return undefined;
};
