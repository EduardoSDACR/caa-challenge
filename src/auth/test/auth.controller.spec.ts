import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { authServiceMock, credentialsMock } from './auth.mock';
import { faker } from '@faker-js/faker/.';
import { SignInDto, SignUpDto } from '../dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should grant access credentials when sign in', async () => {
    const body: SignInDto = {
      email: faker.internet.email(),
      password: faker.lorem.word(),
    };
    const result = await controller.signIn(body);

    expect(result).toBe(credentialsMock);
  });

  it('should grant access credentials when sign up', async () => {
    const body: SignUpDto = {
      fullName: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
    };
    const result = await controller.signUp(body);

    expect(result).toBe(credentialsMock);
  });

  it('should return undefined', async () => {
    const result = await controller.logOut(faker.string.nanoid());

    expect(result).toBeUndefined();
  });
});
