export const priorityMap: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

export const getPriority = (blockchain: string): number =>
  priorityMap[blockchain] ?? -99;
