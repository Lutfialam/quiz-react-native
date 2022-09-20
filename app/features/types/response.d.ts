interface ResponseType<T> {
  body?: T;
  code?: number;
  status?: string;
  errors?: any;
  message?: string;
}

export default ResponseType;
