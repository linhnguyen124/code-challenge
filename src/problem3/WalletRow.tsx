interface WalletRowProps {
  currency: string;
  amount: number;
  usdValue: number;
}

const WalletRow = ({ currency, amount, usdValue }: WalletRowProps) => {
  return (
    <div className='wallet-row'>
      <span>{currency}</span>
      <span>{amount.toFixed(2)}</span>
      <span>${usdValue.toFixed(2)}</span>
    </div>
  );
};

export default WalletRow;
