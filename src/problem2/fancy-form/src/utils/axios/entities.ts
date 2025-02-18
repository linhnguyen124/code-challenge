import { ErrorResponse } from './error';

export interface IResponse<T> {
  data?: T;
  error?: ErrorResponse;
}
