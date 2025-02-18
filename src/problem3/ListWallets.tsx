import { useMemo } from "react";
import { WalletBalance } from "./entites";
import { usePrices, useWalletBalances } from "./hooks";
import { getPriority } from "./utils";
import WalletRow from "./WalletRow";

const ListWallets = () => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter(
        (balance: WalletBalance) =>
          getPriority(balance.blockchain) > -99 && balance.amount > 0
      )
      .sort(
        (lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
      );
  }, [balances, prices]);

  return (
    <div>
      {sortedBalances.map((balance, index) => (
        <WalletRow
          key={index}
          currency={balance.currency}
          amount={balance.amount}
          usdValue={(prices[balance.currency] ?? 0) * balance.amount}
        />
      ))}
    </div>
  );
};

export default ListWallets;
