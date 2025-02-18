import { useQuery } from '@tanstack/react-query';
import { TokenServices } from 'services/TokenServices';
import dayjs from 'dayjs';
import { TypeToken } from 'services/TokenServices/entities';

export const useCurrencyQuery = () => {
  const getLatestUniqueData = (data: TypeToken[]) => {
    const latestData = new Map<string, TypeToken>();

    data.forEach((item) => {
      const existing = latestData.get(item.currency);

      if (!existing || dayjs(item.date).isAfter(dayjs(existing.date))) {
        latestData.set(item.currency, item);
      }
    });

    return Array.from(latestData.values());
  };

  const query = useQuery({
    queryKey: ['getCurrencyPrice'],
    queryFn: async () => {
      const tokenServicesAPI = new TokenServices();
      const { data, error } = await tokenServicesAPI.getListCurrencyPrices();
      if (error) {
        return [];
      }
      if (data) {
        const latestUniqueData = getLatestUniqueData(data);
        return latestUniqueData.map((token) => {
          let renameToken = token.currency;

          if (token.currency === 'STEVMOS') {
            renameToken = 'stEVMOS';
          }
          if (token.currency === 'RATOM') {
            renameToken = 'rATOM';
          }
          if (token.currency === 'STOSMO') {
            renameToken = 'stOSMO';
          }
          if (token.currency === 'STATOM') {
            renameToken = 'stATOM';
          }
          if (token.currency === 'STLUNA') {
            renameToken = 'stLUNA';
          }

          return {
            ...token,
            isDisabled: false,
            iconURL: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${renameToken}.svg`
          };
        });
      }
    }
  });

  return query;
};
