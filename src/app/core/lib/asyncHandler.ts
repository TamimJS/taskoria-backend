import { AsyncHandler, AsyncHandlerWrapper } from '@/types';

const asyncHandler: AsyncHandlerWrapper = (fn: AsyncHandler) => {
	return (req, res, next) => fn(req, res, next).catch(next);
};

export default asyncHandler;
