import { Injectable, UseGuards } from '@nestjs/common';
import PermissionUtil from '../../db/util/permission.util';
import { IAuth } from '../decorators/authDetail.decorators';
import TripEntity from '../../db/entities/trip.entity';
import HttpResponse from '../libs/http-response';
import ErrorMessageConstants from '../consts/error-message.consts';
import SuccessMessageConstants from '../consts/success-message.consts';
import TripDto, { TripFilterDto } from '../dto/trip.dto';
import * as Lodash from 'lodash';
import {
  Between,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { UserRole } from '../../db/enum';
import { AuthenticationGuard } from '../guards/authentication.guard';
import * as moment from 'moment';
import GenUtil from '../../db/util/gen.util';
import GenConst from '../consts/gen-consts';
import { FindConditions } from 'typeorm/index';

@Injectable()
export class TripService {
  async addTrip(trip: TripDto, auth: IAuth) {
    console.log(trip);
    if (moment(trip.endDate).isBefore(trip.startDate))
      return HttpResponse.error(ErrorMessageConstants.InvalidTripDates);
    const newTrip: TripEntity = new TripEntity();
    newTrip.destination = trip.destination;
    newTrip.startDate = moment(trip.startDate).format('YYYY-MM-DD');
    newTrip.endDate = moment(trip.endDate).format('YYYY-MM-DD');
    newTrip.comment = trip.comment;
    newTrip.userId = auth.authUser.id;
    await newTrip.save();
    return HttpResponse.success(
      newTrip.toJSON({}),
      SuccessMessageConstants.TripCreatedSuccess,
    );
  }

  async getTrips(tripFilter: TripFilterDto, auth: IAuth) {
    console.log(tripFilter);
    const findCond: FindConditions<TripEntity> = {
      startDate: Between(tripFilter.min_start_date, tripFilter.max_start_date),
      endDate: Between(tripFilter.min_end_date, tripFilter.max_end_date),
    };

    if (
      (tripFilter.own_trips && auth.authUser.role === UserRole.ADMIN) ||
      [UserRole.REGULAR, UserRole.MANAGER].includes(auth.authUser.role)
    ) {
      findCond.userId = auth.authUser.id;
    }
    const pageSize = tripFilter.next_month_plan
      ? 100000
      : GenConst.PaginationLimit;

    if (tripFilter.destination)
      findCond.destination = Like(`%${tripFilter.destination}%`);

    const trips: TripEntity[] = await TripEntity.find({
      where: findCond,
      ...GenUtil.getOffsetAndLimit(tripFilter.page, pageSize),
      order: {
        id: 'DESC',
      },
    });
    console.log(trips.length);
    return HttpResponse.success(trips.map((trip) => trip.toJSON({})));
  }

  async getTrip(id: number, auth: IAuth) {
    const trip: TripEntity = await TripEntity.findOne({ id });
    if (!trip) return HttpResponse.notFound(ErrorMessageConstants.TripNotFound);

    if (!PermissionUtil.canRUDTrip(auth, trip)) {
      return HttpResponse.forbidden(ErrorMessageConstants.ForbiddenResource);
    }
    return HttpResponse.success(trip.toJSON({}));
  }

  async updateTrip(id: number, trip: TripDto, auth: IAuth) {
    if (moment(trip.endDate).isBefore(trip.startDate))
      return HttpResponse.error(ErrorMessageConstants.InvalidTripDates);

    const updatedTrip: TripEntity = await TripEntity.findOne({ id });
    if (!updatedTrip)
      return HttpResponse.notFound(ErrorMessageConstants.TripNotFound);

    if (!PermissionUtil.canRUDTrip(auth, updatedTrip)) {
      return HttpResponse.forbidden(ErrorMessageConstants.ForbiddenResource);
    }
    updatedTrip.destination = Lodash.isNil(trip.destination)
      ? updatedTrip.destination
      : trip.destination;
    updatedTrip.startDate = Lodash.isNil(trip.startDate)
      ? updatedTrip.startDate
      : trip.startDate;
    updatedTrip.endDate = Lodash.isNil(trip.endDate)
      ? updatedTrip.endDate
      : trip.endDate;
    updatedTrip.comment = trip.comment;

    await updatedTrip.save();
    return HttpResponse.success(
      updatedTrip.toJSON({}),
      SuccessMessageConstants.TripUpdatedSuccess,
    );
  }

  async deleteTrip(id: number, auth: IAuth) {
    const trip: TripEntity = await TripEntity.findOne({ id });
    if (!trip) return HttpResponse.notFound(ErrorMessageConstants.TripNotFound);

    if (!PermissionUtil.canRUDTrip(auth, trip)) {
      return HttpResponse.forbidden(ErrorMessageConstants.ForbiddenResource);
    }
    await trip.remove();
    return HttpResponse.success({}, SuccessMessageConstants.TripDeletedSuccess);
  }

  async deleteAllTripsOfUsers(userId: number) {
    const trips: TripEntity[] = await TripEntity.find({ userId });
    trips.map(async (trip) => {
      await trip.remove();
    });
  }
}
