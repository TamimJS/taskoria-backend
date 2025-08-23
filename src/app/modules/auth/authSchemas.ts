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

export const LoginSchema = z.object({
	email: z
		.string({ error: 'Email is required' })
		.trim()
		.toLowerCase()
		.email({ error: 'Email is not valid' }),
	password: z.string().min(1, 'Password is required')
});

export const RegisterSchema = z.object({
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
	password: passwordSchema
});

export const RefreshTokenSchema = z.object({
	refreshToken: z.string().min(1, 'Refresh token is required')
});
