import { NestFactory } from '@nestjs/core';

import * as Bcrypt from 'bcrypt';
import * as Lodash from 'lodash';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import UserEntity from './db/entities/user.entity';
import TripEntity from './db/entities/trip.entity';
import ExpiredTokenEntity from './db/entities/expired-token.entity';
import { UserRole } from './db/enum';
import * as faker from 'faker';
import * as moment from 'moment';

const bootstrap = async () => {
  config();
  const app = await NestFactory.createApplicationContext(AppModule);

  await UserEntity.delete({});
  await TripEntity.delete({});
  await ExpiredTokenEntity.delete({});

  const passwordHash = Bcrypt.hashSync('1234', 10);

  for (let i = 0; i < 30; i++) {
    await UserEntity.create({
      name: `Somename ${i}`,
      email: faker.internet.email(),
      password: passwordHash,
      role: Lodash.sample([UserRole.ADMIN, UserRole.MANAGER, UserRole.REGULAR]),
    }).save();
  }
  const regular = await UserEntity.create({
    name: 'regular',
    email: 'regular@example.com',
    password: passwordHash,
    role: UserRole.REGULAR,
  }).save();
  const manager = await UserEntity.create({
    name: 'manager',
    email: 'manager@example.com',
    password: passwordHash,
    role: UserRole.MANAGER,
  }).save();
  const admin = await UserEntity.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: passwordHash,
    role: UserRole.ADMIN,
  }).save();

  for (let i = 0; i < 100; i++) {
    const date = moment(faker.date.future(i)).format('YYYY-MM-DD');
    await TripEntity.create({
      destination: `Somewhere ${i}`,
      startDate: date,
      endDate:  moment(date).add(7, 'days').format('YYYY-MM-DD'),
      userId: Lodash.sample([regular.id, manager.id, admin.id]),
      comment: `Some comment ${i}`,
    }).save();
  }

  await app.close();
};

bootstrap();
