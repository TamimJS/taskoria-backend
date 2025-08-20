import { z } from 'zod';

export const CreateUserSchema = z.object({
	firstName: z
		.string({ error: 'First Name is required' })
		.min(1, { error: 'First Name must be at least 1 character' })
		.trim(),
	lastName: z
		.string({ error: 'Last Name is required' })
		.min(1, { error: 'Last Name must be at least 1 character' })
		.trim(),
	email: z
		.string({ error: 'Email is required' })
		.email({ error: 'Email is not valid' })
		.toLowerCase()
		.trim(),
	password: z
		.string({ error: 'Password is required' })
		.min(8, { error: 'Password must be at least 8 characters' }),
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
			.optional(),
		lastName: z
			.string({ error: 'Last Name is required' })
			.min(1, { error: 'Last Name must be at least 1 character' })
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
