import {AxiosError, AxiosResponse} from 'axios';
import ResponseType from '@/types/response';

class Response<T> implements ResponseType<T> {
  public body?: T | undefined;
  public code?: number | undefined;
  public errors?: ResponseError | undefined;
  public status?: string | undefined;
  public message?: string | undefined;

  constructor(response: AxiosResponse) {
    this.code = response.status;

    if (response.data) {
      const {data} = response;

      this.body = data;
      this.status = data.status;
      this.errors = data.errors;
      this.message = data.message;
    }
  }
}

export class ResponseError {
  public data?: any;
  public code?: number | undefined;
  public status?: string | undefined;

  constructor(error: AxiosError) {
    if (error.response && error.response?.status != 0) {
      this.code = error.response.status;
      this.data = error.response.data ?? error.message;
    } else if (error.isAxiosError) {
      let err = error.toJSON() as any;
      this.data = err.message;
      this.code = err.status;
    } else {
      this.data = 'Something went wrong';
    }
  }
}

export default Response;
