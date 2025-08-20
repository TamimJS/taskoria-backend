import HTTP_STATUS from '../lib/httpStatus';

export type AppErrorOptions = {
	status: HTTP_STATUS;
	code: string;
	message: string;
	fieldErrors?: Record<string, string[]>;
	meta?: Record<string, unknown>;
	cause?: unknown;
};

export default abstract class AppError extends Error {
	// 👇 HTTP status to send in the response (e.g., 400, 422, 500…)
	public readonly status: HTTP_STATUS;

	// 👇 short machine-readable code (e.g., VALIDATION_ERROR, UNAUTHORIZED)
	public readonly code: string;

	// 👇 optional field-level errors, e.g. { email: ["Invalid email"] }
	public readonly fieldErrors?: Record<string, string[]>;

	// 👇 extra safe metadata for frontend/logging (never secrets)
	public readonly meta?: Record<string, unknown>;

	// 👇 operational flag = “expected, recoverable error”
	// lets you filter out programmer bugs in logging/monitoring
	public readonly isOperational: boolean = true;

	constructor(options: AppErrorOptions) {
		super(options.message);
		this.status = options.status;
		this.code = options.code;
		this.fieldErrors = options.fieldErrors;
		this.meta = options.meta;
		if (options.cause) {
			(this as any).cause = options.cause;
		}
		Error.captureStackTrace?.(this, this.constructor);
	}
}

/** 422 — field-level validation issues (Zod, business rules) */
export class ValidationError extends AppError {
	constructor(
		message = 'Validation Error',
		fieldErrors: Record<string, string[]>
	) {
		super({
			message,
			status: HTTP_STATUS.UNPROCESSABLE_CONTENT,
			code: 'Validation_Error',
			fieldErrors
		});
	}
}

/** 400 — malformed inputs not tied to specific fields */
export class BadRequestError extends AppError {
	constructor(message = 'Bad Request') {
		super({
			message,
			status: HTTP_STATUS.BAD_REQUEST,
			code: 'BAD_REQUEST'
		});
	}
}

/** 401 — not authenticated */
export class UnauthorizedError extends AppError {
	constructor(message = 'Unauthorized') {
		super({
			message,
			status: HTTP_STATUS.UNAUTHORIZED,
			code: 'UNAUTHORIZED'
		});
	}
}

/** 403 — authenticated but not allowed */
export class ForbiddenError extends AppError {
	constructor(message = 'Forbidden') {
		super({
			message,
			status: HTTP_STATUS.FORBIDDEN,
			code: 'FORBIDDEN'
		});
	}
}

/** 404 — resource missing */
export class NotFoundError extends AppError {
	constructor(message = 'Not Found') {
		super({
			message,
			status: HTTP_STATUS.NOT_FOUND,
			code: 'NOT_FOUND'
		});
	}
}

/** 409 — conflicts (e.g., unique constraints when not returned as field errors) */
export class ConflictError extends AppError {
	constructor(message = 'Conflict', meta?: Record<string, unknown>) {
		super({
			message,
			status: HTTP_STATUS.CONFLICT,
			code: 'CONFLICT',
			meta
		});
	}
}

/** 500 — unexpected server error (safe message only) */
export class InternalServerError extends AppError {
	constructor(message = 'Internal Server Error') {
		super({
			message,
			status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
			code: 'INTERNAL'
		});
	}
}
