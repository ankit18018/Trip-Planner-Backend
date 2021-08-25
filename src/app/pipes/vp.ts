import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as Joi from '@hapi/joi';
import HttpResponse from '../libs/http-response';
import * as moment from 'moment';

@Injectable()
export default class Vp implements PipeTransform<any> {
  constructor(private readonly schema: Joi.ObjectSchema | Joi.NumberSchema) {}

  public transform(originalValue: any, metadata: ArgumentMetadata) {
    const { error, value } = this.schema.validate(originalValue, {
      abortEarly: false,
      convert: true,
      noDefaults: false,
    });

    if (error) {
      const { details } = error;
      let errorMessage: string = details[0].message;
      errorMessage = errorMessage.replace(/"/g, '');
      throw new BadRequestException(HttpResponse.error(errorMessage));
    }
    if (typeof value === 'object') {
      for (const key in value) {
        if (
          key?.toLowerCase().includes('date') &&
          moment(value[key]).isValid()
        ) {
          value[key] = moment(value[key]).format('YYYY-MM-DD');
        }
      }
    }
    return value;
  }

  static for<T extends Joi.ObjectSchema | Joi.NumberSchema>(schema: T): Vp {
    return new Vp(schema);
  }
}
