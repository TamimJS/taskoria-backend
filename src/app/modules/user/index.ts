import PasswordProvider from '@/app/core/providers/passwordProvider';
import UserController from './userController';
import CreateUserRoutes from './userRoutes';
import UserServices from './userServices';
import { UserModule, UserModuleDeps } from './userTypes';

const CreateUserModule = (deps: UserModuleDeps): UserModule => {
	const passwordProvider = new PasswordProvider();
	const services = new UserServices(deps.prisma, passwordProvider);
	const controller = new UserController(services);
	const routes = CreateUserRoutes(controller);

	return { services, controller, routes };
};

export default CreateUserModule;
