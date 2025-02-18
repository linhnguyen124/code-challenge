import { IResponse } from 'utils/axios/entities';
import { catchAxiosError } from 'utils/axios/error';
import HttpClient from 'utils/axios/instance';
import { ITokenDTO } from './entities';

export class TokenServices extends HttpClient {
  constructor() {
    super({ baseURL: import.meta.env.VITE_BASE_URL });
  }

  public getListCurrencyPrices = async (): Promise<IResponse<ITokenDTO[]>> => {
    const response = await this.instance.get('').catch(catchAxiosError);

    return response;
  };
}
