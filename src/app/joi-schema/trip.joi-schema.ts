import GenConst from '../consts/gen-consts';

import * as JoiBase from '@hapi/joi';
import * as JoiDate from '@hapi/joi-date';
const Joi = JoiBase.extend(JoiDate);

import * as moment from 'moment';

export const addTripSchema = Joi.object({
  destination: Joi.string().min(3).required(),

  startDate: Joi.date()
    .format('YYYY-MM-DD')
    .min(GenConst.startDate)
    .max(GenConst.endDate)
    .required(),

  endDate: Joi.date()
    .format('YYYY-MM-DD')
    .min(Joi.ref('startDate'))
    .max(GenConst.endDate)
    .required(),
  comment: Joi.string().allow(null, '').min(10),
});

export const updateTripSchema = Joi.object({
  destination: Joi.string().min(3),

  startDate: Joi.date()
    .format('YYYY-MM-DD')
    .min(GenConst.startDate)
    .max(GenConst.endDate),

  endDate: Joi.date()
    .format('YYYY-MM-DD')
    .min(Joi.ref('startDate'), GenConst.startDate)
    .max(GenConst.endDate),
  comment: Joi.string().allow(null,'').min(10),
});

export const tripFilterSchema = Joi.object({
  min_start_date: Joi.date()
    .format('YYYY-MM-DD')
    .min(GenConst.startDate)
    .max(GenConst.endDate)
    .default(GenConst.startDate),

  max_start_date: Joi.date()
    .format('YYYY-MM-DD')
    .min(GenConst.startDate)
    .max(GenConst.endDate)
    .default(GenConst.endDate),

  min_end_date: Joi.date()
    .format('YYYY-MM-DD')
    .min(GenConst.startDate)
    .max(GenConst.endDate)
    .default(GenConst.startDate),

  max_end_date: Joi.date()
    .format('YYYY-MM-DD')
    .min(GenConst.startDate)
    .max(GenConst.endDate)
    .default(GenConst.endDate),

  destination: Joi.string().allow(null, ''),

  page: Joi.number().default(1),

  own_trips: Joi.boolean().default(false),

  next_month_plan: Joi.boolean().default(false),
});
