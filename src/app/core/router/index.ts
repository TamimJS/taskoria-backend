import { Modules } from '@/types';
import { Application } from 'express';

const AppRouter = (app: Application, modules: Modules): void => {
	app.use('/api/v1/users', modules.user.routes);
};

export default AppRouter;
