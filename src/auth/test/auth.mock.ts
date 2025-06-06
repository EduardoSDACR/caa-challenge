import { faker } from '@faker-js/faker';
import { Token, User } from '@prisma/client';

export const userMock: User = {
  id: faker.number.int(),
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  hash: faker.string.nanoid(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
};

export const tokenMock: Token = {
  id: faker.number.int(),
  createdAt: faker.date.anytime(),
  userId: faker.number.int(),
  jti: faker.string.uuid(),
};
