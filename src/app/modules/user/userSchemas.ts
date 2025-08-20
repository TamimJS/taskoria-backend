import { z } from 'zod';

const passwordSchema = z
	.string({ error: 'Password is required' })
	.min(8, { error: 'Password must be at least 8 characters' })
	.regex(/[A-Z]/, {
		error: 'Password must contain at least one uppercase letter'
	})
	.regex(/[a-z]/, {
		error: 'Password must contain at least one lowercase letter'
	})
	.regex(/[0-9]/, { error: 'Password must contain at least one number' })
	.regex(/[^A-Za-z0-9]/, {
		error: 'Password must contain at least one special character'
	});

export const CreateUserSchema = z.object({
	firstName: z
		.string({ error: 'First Name is required' })
		.min(1, { error: 'First Name must be at least 1 character' })
		.max(25, { error: 'First Name must be less than 25 characters' })
		.trim(),
	lastName: z
		.string({ error: 'Last Name is required' })
		.min(1, { error: 'Last Name must be at least 1 character' })
		.max(25, { error: 'Last Name must be less than 25 characters' })
		.trim(),
	email: z
		.string({ error: 'Email is required' })
		.trim()
		.toLowerCase()
		.email({ error: 'Email is not valid' })
		.max(100, { error: 'Email must be less than 100 characters' }),
	password: passwordSchema,
	role: z
		.enum(['ADMIN', 'MEMBER'], {
			error: 'Must be either ADMIN or MEMBER'
		})
		.optional(),
	isActive: z.boolean().optional()
});

export const UpdateUserSchema = z
	.object({
		firstName: z
			.string({ error: 'First Name is required' })
			.min(1, { error: 'First Name must be at least 1 character' })
			.max(25, { error: 'First Name must be less than 25 characters' })
			.trim()
			.optional(),
		lastName: z
			.string({ error: 'Last Name is required' })
			.min(1, { error: 'Last Name must be at least 1 character' })
			.max(25, { error: 'Last Name must be less than 25 characters' })
			.trim()
			.optional(),
		role: z
			.enum(['ADMIN', 'MEMBER'], {
				error: 'Must be either ADMIN or MEMBER'
			})
			.optional(),
		isActive: z.boolean().optional()
	})
	.refine((obj) => Object.keys(obj).length > 0, {
		message: 'No fields to update'
	});

export const UsersQuerySchema = z.object({
	page: z.coerce.number().int().min(1).optional(),
	limit: z.coerce.number().int().min(1).max(100).optional(),
	search: z.string().trim().min(1).optional()
});
