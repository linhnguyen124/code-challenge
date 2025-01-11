import React, { useEffect, useState } from 'react'
import './App.css'
import { currencies } from './constants'
import Select from "react-select";

interface Currency {
    currency: string,
    iconUrl: string,
    price: number
}

interface CurrencyContainerProps {
    label: string;
    selectedCurrency: Currency | null;
    onCurrencyChange: (value: Currency) => void;
    currencies: Currency[];
    amount: string
}

const CurrencyContainer: React.FC<CurrencyContainerProps> =
    ({ label, selectedCurrency, onCurrencyChange, currencies, amount }) => {

        const customOption = (data: Currency) => (
            <div className='currency-option'>
                <img className='__image'
                    src={data.iconUrl}
                    alt={data.currency}
                />
                {data.currency}
            </div>
        );

        return (<div className='currency-container'>
            <div className='select-section'>
                <label>{label}</label>
                <Select className='currency-select'
                    value={selectedCurrency}
                    onChange={(selectedOption: Currency) =>
                        onCurrencyChange((selectedOption))
                    }
                    options={currencies}
                    getOptionLabel={customOption}
                    getOptionValue={(option) => option.currency}
                />
            </div>
            {amount && <div className='detail-section'>
                Amount: ${amount}
            </div>}
        </div>)
    }

function App() {
    const [inputCurrency, setInputCurrency] = useState<Currency | null>(null)
    const [outputCurrency, setOutputCurrency] = useState<Currency | null>(null)
    const [listCurrency, setListCurrency] = useState<Currency[]>([])
    const SEND_AMOUNT = "1"
    const receiveAmount = outputCurrency && inputCurrency && (inputCurrency.price / outputCurrency.price).toFixed(2) || ""

    useEffect(() => {
        const fetchCurrencies = async () => {
            const listCurrency = currencies.map(currency => ({
                ...currency,
                iconUrl: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency.currency}.svg`
            }))
            setListCurrency(listCurrency)
            setTimeout(() => { console.log("fetchCurrencies") }, 500)
        }
        fetchCurrencies()
    }, [])

    function swapCurrency() {
        console.log("swap currency")
    };

    return (
        <>
            <form className='swap-form' onSubmit={(e) => {
                e.preventDefault();
                swapCurrency();
            }}>
                <h3>Swap</h3>
                <div className='container'>
                    <CurrencyContainer selectedCurrency={inputCurrency} currencies={listCurrency}
                        onCurrencyChange={setInputCurrency} label='Amount to send' amount={receiveAmount && SEND_AMOUNT} />

                    <CurrencyContainer selectedCurrency={outputCurrency} currencies={listCurrency}
                        onCurrencyChange={setOutputCurrency} label='Amount to receive' amount={receiveAmount} />
                </div>
                <button type='submit'>CONFIRM SWAP</button>
            </form>
        </>
    )
}

export default App
