export interface IResponse<T = any> {
  status: number;
  data?: T;
  error?: any;
}
