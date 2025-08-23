import UserController from './userController';
import CreateUserRoutes from './userRoutes';
import UserServices from './userServices';
import { TUserModule, TUserModuleDeps } from './userTypes';

const CreateUserModule = (deps: TUserModuleDeps): TUserModule => {
	const services = new UserServices(deps.prisma, deps.passwordProvider);
	const controller = new UserController(services);
	const routes = CreateUserRoutes(controller);

	return { services, controller, routes };
};

export default CreateUserModule;
