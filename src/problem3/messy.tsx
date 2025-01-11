interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

//Add enum BLockchain for getPriority func
enum Blockchain {
    Osmosis = 'Osmosis',
    Ethereum = 'Ethereum',
    Arbitrum = 'Arbitrum',
    Zilliqa = 'Zilliqa',
    Neo = 'Neo',
}


//Naming need to be more specific -> Props => WalletPageProps
interface WalletPageProps extends BoxProps {

}

const PRIORITIES = []

const WalletPage: React.FC<WalletPageProps> = ({ children, ...rest }: WalletPageProps) => {
    //type safety for variable 
    const balances: WalletBalance[] = useWalletBalances();
    const prices: Record<string, number> = usePrices();

    //Type safety for variable, blockchain could be enum
    const getPriority = (blockchain: Blockchain): number => {
        const priorities: Record<Blockchain, number> = {
            [Blockchain.Osmosis]: 100,
            [Blockchain.Ethereum]: 50,
            [Blockchain.Arbitrum]: 30,
            [Blockchain.Zilliqa]: 20,
            [Blockchain.Neo]: 20,
        };
        return priorities[blockchain] ?? -99;
    };

    const formattedBalances = useMemo(() => {
        return balances.filter((balance: WalletBalance) => {
            //What does this param use for?
            const balancePriority = getPriority(balance.blockchain);
            // Is lhsPriority should be balancePriority?
            return balancePriority > -99 && balance.amount > 0
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            //could return rightPriority-leftPriority
            return rightPriority - leftPriority
        }).map((balance: WalletBalance) => ({
            ...balance,
            formatted: balance.amount.toFixed(2)
        }));
        //sortedBalances doesn't depend on prices, remove prices and add getPriority
    }, [balances, getPriority]);


    const rows = useMemo(() => {
        //sortedBalances doesn't have 'formatted' attribute
        return formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
            // In case balance.currency is undefined
            const usdValue = prices[balance.currency ?? 0] * balance.amount;
            return (
                <WalletRow
                    className={classes.row}
                    key={index}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            )
        })
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}