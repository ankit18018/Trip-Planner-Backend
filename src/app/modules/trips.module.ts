import { Module } from '@nestjs/common';
import { TripsController } from '../controllers/trips.controller';
import ControllerServicesModule from './controller-service.module';

@Module({
  controllers: [TripsController],
  imports: [ControllerServicesModule],
})
export class TripsModule {}
