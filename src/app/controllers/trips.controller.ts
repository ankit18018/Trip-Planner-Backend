import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TripService } from '../services/trip.service';
import { Auth, IAuth } from '../decorators/authDetail.decorators';
import { handleHTTPResponse } from '../libs/http-response';
import TripDto, { TripFilterDto } from '../dto/trip.dto';
import Vp from '../pipes/vp';
import {
  addTripSchema,
  tripFilterSchema,
  updateTripSchema,
} from '../joi-schema/trip.joi-schema';
import { AuthenticationGuard } from '../guards/authentication.guard';
import GenConst from '../consts/gen-consts';

@Controller('trip')
export class TripsController {
  constructor(private readonly tripService: TripService) {}

  @Get('/:id')
  @UseGuards(AuthenticationGuard)
  async getTrip(@Param('id') id: number, @Auth() auth: IAuth) {
    const data = await this.tripService.getTrip(id, auth);
    return handleHTTPResponse(data);
  }

  @Get('/')
  @UseGuards(AuthenticationGuard)
  async getTrips(
    @Query(Vp.for(tripFilterSchema))
    {
      min_start_date,
      max_start_date,
      min_end_date ,
      max_end_date ,
      page = 0,
      own_trips = false,
      destination='',
      next_month_plan=false,
    }: TripFilterDto,
    @Auth() auth: IAuth,
  ) {
    console.log(GenConst);
    const data = await this.tripService.getTrips(
      {
        min_start_date,
        min_end_date,
        max_start_date,
        max_end_date,
        page,
        own_trips,
        destination,
        next_month_plan,
      },
      auth,
    );
    return handleHTTPResponse(data);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  async createTrip(
    @Body(Vp.for(addTripSchema)) trip: TripDto,
    @Auth() auth: IAuth,
  ) {
    const data = await this.tripService.addTrip(trip, auth);
    return handleHTTPResponse(data);
  }

  @Delete('/:id')
  @UseGuards(AuthenticationGuard)
  async deleteTrip(@Param('id') id: number, @Auth() auth: IAuth) {
    const data = await this.tripService.deleteTrip(id, auth);
    return handleHTTPResponse(data);
  }

  @Put('/:id')
  @UseGuards(AuthenticationGuard)
  async updateTrip(
    @Param('id') id: number,
    @Body(Vp.for(updateTripSchema)) trip: TripDto,
    @Auth() auth: IAuth,
  ) {
    const data = await this.tripService.updateTrip(id, trip, auth);
    return handleHTTPResponse(data);
  }
}
