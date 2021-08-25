import { HttpException } from '@nestjs/common';

export default class HttpResponse<T = any> {
  httpCode: number;
  message: string;
  data: T;
  success: boolean;

  private constructor(
    success: boolean,
    data: T,
    message?: string,
    httpCode?: number,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.httpCode = httpCode;
  }

  static success<T>(data: T, message = '', httpCode = 200): HttpResponse<T> {
    return new HttpResponse<T>(true, data, message, httpCode);
  }

  static created<T>(data: T, message = '', httpCode = 201): HttpResponse<T> {
    return new HttpResponse<T>(true, data, message, httpCode);
  }

  static error<T>(message: string, httpCode = 400): HttpResponse<T> {
    return new HttpResponse<T>(false, null, message, httpCode);
  }

  static unauthorized<T>(message = 'Unauthorized'): HttpResponse<T> {
    return new HttpResponse<T>(false, null, message, 401);
  }

  static forbidden<T>(message = 'Forbidden Access'): HttpResponse<T> {
    return new HttpResponse<T>(false, null, message, 403);
  }

  static notFound<T>(message = 'Not found'): HttpResponse<T> {
    return new HttpResponse<T>(false, null, message, 404);
  }

  static serverError<T>(message = 'Internal server error'): HttpResponse<T> {
    return new HttpResponse<T>(false, null, message, 500);
  }
}

export type PromisedHTTPResp<T> = Promise<HttpResponse<T>>;

export const handleHTTPResponse = async (
  resp: HttpResponse<any> | PromisedHTTPResp<any>,
) => {
  const r: HttpResponse<any> = await resp;
  if (r.success) return resp;
  else throw new HttpException(r.message, r.httpCode);
};
