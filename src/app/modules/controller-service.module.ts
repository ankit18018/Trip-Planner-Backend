import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { TripService } from '../services/trip.service';

@Module({
  providers: [UserService, TripService],
  exports: [UserService, TripService],
})
export default class ControllerServicesModule {}
