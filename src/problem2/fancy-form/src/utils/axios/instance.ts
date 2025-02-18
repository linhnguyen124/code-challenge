import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { StatusCodes } from 'http-status-codes';
import queryString from 'query-string';

export default abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  constructor({ baseURL }: { baseURL?: string }) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'content-type': 'application/json'
      },
      paramsSerializer: (params) =>
        queryString.stringify(params, {
          skipNull: true
        })
    });
    this.requestInterceptor();
    this.responseInterceptor();
  }

  private requestInterceptor = () => {
    this.instance.interceptors.request.use((config) => {
      return config;
    });
  };

  /*
   * When response code is 401, try to refresh the token.
   * Eject the interceptor so it doesn't loop in case
   * token refresh causes the 401 response
   */
  private responseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this.handleError
    );
  };
  private _handleResponse = ({ data }: AxiosResponse): any => {
    return { data };
  };

  protected handleError = (error: AxiosError): void => {
    const parsedHash = location.hash.split('?');
    const isForbidden = location.hash.split('/');

    if (
      error &&
      error.response?.status === StatusCodes.FORBIDDEN &&
      parsedHash.length > 0 &&
      isForbidden[isForbidden.length - 1] !== `${StatusCodes.FORBIDDEN}`
    ) {
      location.replace(`${parsedHash}/${StatusCodes.FORBIDDEN}`);
    }

    throw error;
  };
}
