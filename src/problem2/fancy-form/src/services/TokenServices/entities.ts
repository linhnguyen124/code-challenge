export interface ITokenDTO {
  currency: string;
  date: string;
  price: number;
}

export type TypeToken = {
  isDisabled?: boolean;
  iconURL?: string;
} & ITokenDTO;
