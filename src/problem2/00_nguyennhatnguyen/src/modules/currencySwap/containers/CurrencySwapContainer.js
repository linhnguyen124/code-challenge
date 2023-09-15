import { useEffect, useState } from 'react';
import Axios from 'axios';
import CurrencySwapForm from "../components/CurrencySwapForm";

const CurrencySwapContainer = () => {
    const [prices, setPrices] = useState([]);
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        Axios.get(
            `https://interview.switcheo.com/prices.json`)
            .then((res) => {
                setPrices(res.data);
                setCurrencies([...new Set(res.data.map((pr) => {
                    return pr.currency;
                }))]);
            })
    }, [prices, currencies]);

    return <CurrencySwapForm currencies={currencies}/>
};

export default CurrencySwapContainer;