import { ErrorJSON } from '@/types';
import { Response } from 'express';

const getErrorResponse = (res: Response, errorBody: ErrorJSON) => {
	return res.status(errorBody.status).type('application/json').json(errorBody);
};

export default getErrorResponse;
