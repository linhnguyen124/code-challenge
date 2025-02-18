import { zodResolver } from '@hookform/resolvers/zod';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from 'components/UI/Accordion';
import { BackgroundGradient } from 'components/UI/BackgroundGradient';
import { InputField } from 'components/UI/FormHelper/InputField';
import CurrencySelect from 'components/UI/FormHelper/SelectField/CurrencySelect';
import { TextCover } from 'components/UI/TextCover';
import Decimal from 'decimal.js';
import { useCurrencyQuery } from 'hooks/useCurrency';
import numeral from 'numeral';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { cn } from 'utils/helpers';
import { z } from 'zod';
import useSwapStore from './SwapStateSlice';
import { formSchema } from './schemas';

type FormValues = z.infer<typeof formSchema>;

const FancyForm = () => {
  const { data } = useCurrencyQuery();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sellingToken: 'USD'
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log('data', data);
  };

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    degreeX: 0,
    degreeY: 0
  });
  const isSellingAmountBlock = useRef<boolean>(false);
  const isBuyingAmountBlock = useRef<boolean>(false);

  const {
    sellingAmount,
    buyingAmount,
    selectedValueSellToken,
    selectedValueBuyToken,

    setSellingAmount,
    setBuyingAmount,
    setSelectedValueSellToken,
    setSelectedValueBuyToken,
    setListTokens,

    listOptionTokens,
    calSellingUSD,
    calBuyingUSD,
    calExchangeRate,
    calPriceImpact,
    calFeeBuyAmount,

    toggleSwapToken
  } = useSwapStore();

  useEffect(() => {
    if (data) {
      setListTokens(data);
      setValue('sellingToken', 'USD');
      setSelectedValueSellToken('USD');
    }
  }, [data, setListTokens, setSelectedValueSellToken, setValue]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerPoint = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };

      setPosition({
        x: e.x - window.innerWidth / 2,
        y: e.y - window.innerHeight / 2,
        degreeX: (e.clientX - centerPoint.y) * 0.002,
        degreeY: (e.clientY - centerPoint.x) * -0.002
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      style={{
        transform: `perspective(1000px) rotateX(${position.degreeX}deg) rotateY(${position.degreeY}deg)`
      }}
    >
      <BackgroundGradient className='rounded-2xl container p-2 sm:p-10 bg-white dark:bg-zinc-900'>
        <h2 className='text-xl md:text-2xl lg:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white flex items-center justify-center gap-1 py-2 relative'>
          <span className='text-3xl md:text-4xl lg:text-6xl'>amazing</span>
          <TextCover className='flex items-center'>SWAP SPEED</TextCover>
        </h2>
        <form
          className='my-2 space-y-2 min-w-3xs max-w-3xs sm:min-w-[500px] sm:max-w-[500px]'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='relative space-y-2'>
            <div className='flex items-center justify-center gap-2 md:gap-4 border border-fuchsia-200 px-2 py-6 md:px-3 rounded-lg bg-fuchsia-100 dark:bg-zinc-800 text-zinc-400'>
              <div className='w-full'>
                <div className='relative'>
                  <label htmlFor='sellingAmount'>I'm selling</label>
                  <NumericFormat
                    {...register('sellingAmount', { valueAsNumber: true })}
                    value={sellingAmount}
                    customInput={InputField}
                    onFocus={() => {
                      isSellingAmountBlock.current = true;
                    }}
                    onBlur={() => {
                      isSellingAmountBlock.current = false;
                    }}
                    onValueChange={(values) => {
                      setSellingAmount(values.floatValue as number);
                      setValue('sellingAmount', values.floatValue as number);
                      if (
                        !isBuyingAmountBlock.current &&
                        values.floatValue &&
                        values.floatValue !== 0 &&
                        selectedValueSellToken.currency !== '' &&
                        selectedValueBuyToken.currency !== ''
                      ) {
                        const rate = calExchangeRate();
                        const calAmount = new Decimal(values.floatValue)
                          .times(rate)
                          .toNumber()
                          .toFixed(6) as unknown as number;
                        setBuyingAmount(calAmount);
                        setValue('buyingAmount', calAmount);
                      }
                    }}
                    thousandSeparator
                    allowNegative={false}
                  />
                  <p className='text-sm'>
                    {numeral(calSellingUSD()).format('$0,0.[00000]a')}
                  </p>
                </div>
                {errors.sellingAmount && (
                  <p className='absolute block text-red-500 text-xs'>
                    {errors.sellingAmount.message}
                  </p>
                )}
              </div>
              <div className='w-full max-w-44'>
                <div className='relative'>
                  <CurrencySelect
                    options={{
                      withLabel: 'currency',
                      withValue: 'currency',
                      withIconURL: 'iconURL',
                      data: listOptionTokens()
                    }}
                    {...register('sellingToken')}
                    value={selectedValueSellToken.currency}
                    onChange={(value) => {
                      setSelectedValueSellToken(value);
                      if (value !== '') {
                        setValue('sellingToken', value);
                      }
                      if (
                        sellingAmount &&
                        sellingAmount !== 0 &&
                        value !== '' &&
                        selectedValueBuyToken.currency !== ''
                      ) {
                        const rate = calExchangeRate();
                        const calAmount = new Decimal(sellingAmount)
                          .times(rate)
                          .toNumber()
                          .toFixed(6) as unknown as number;
                        setBuyingAmount(calAmount);
                        setValue('buyingAmount', calAmount);
                      }
                    }}
                    placeholder='Select tokens'
                  />
                  {errors.sellingToken && (
                    <p className='absolute block text-red-500 text-xs'>
                      {errors.sellingToken.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              type='button'
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:border hover:border-fuchsia-200 hover:bg-fuchsia-100 cursor-pointer p-1 rounded-full text-zinc-400 hover:shadow-md hover:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-none disabled:hover:bg-none disabled:hover:shadow-none disabled:hover:text-zinc-400'
              disabled={
                !sellingAmount ||
                !buyingAmount ||
                selectedValueSellToken.currency === '' ||
                selectedValueBuyToken.currency === ''
              }
              onClick={toggleSwapToken}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='w-8 h-8'
              >
                <path d='m3 16 4 4 4-4' />
                <path d='M7 20V4' />
                <path d='m21 8-4-4-4 4' />
                <path d='M17 4v16' />
              </svg>
            </button>
            <div className='flex items-center justify-center gap-2 md:gap-4 border border-fuchsia-200 px-2 py-6 md:px-3 rounded-lg bg-fuchsia-100 dark:bg-zinc-800 text-zinc-400'>
              <div className='w-full'>
                <div className='relative'>
                  <label htmlFor='buyingAmount'>To buy</label>
                  <NumericFormat
                    {...register('buyingAmount', { valueAsNumber: true })}
                    disabled={selectedValueBuyToken.currency === ''}
                    value={buyingAmount}
                    customInput={InputField}
                    onFocus={() => {
                      isBuyingAmountBlock.current = true;
                    }}
                    onBlur={() => {
                      isBuyingAmountBlock.current = false;
                    }}
                    onValueChange={(values) => {
                      setBuyingAmount(values.floatValue as number);
                      setValue('buyingAmount', values.floatValue as number);
                      if (
                        !isSellingAmountBlock.current &&
                        values.floatValue &&
                        values.floatValue !== 0 &&
                        selectedValueSellToken.currency !== '' &&
                        selectedValueBuyToken.currency !== ''
                      ) {
                        const rate = calExchangeRate(true);
                        const calAmount = new Decimal(values.floatValue)
                          .times(rate)
                          .toNumber()
                          .toFixed(6) as unknown as number;
                        setSellingAmount(calAmount);
                        setValue('sellingAmount', calAmount);
                      }
                    }}
                    thousandSeparator
                    allowNegative={false}
                  />
                  <p className='text-sm'>
                    {numeral(calBuyingUSD()).format('$0,0.[00000]a')}
                  </p>
                </div>
                {errors.buyingAmount && (
                  <p className='absolute block text-red-500 text-xs'>
                    {errors.buyingAmount.message}
                  </p>
                )}
              </div>

              <div className='w-full max-w-44'>
                <div className='relative'>
                  <CurrencySelect
                    options={{
                      withLabel: 'currency',
                      withValue: 'currency',
                      withIconURL: 'iconURL',
                      data: listOptionTokens()
                    }}
                    {...register('buyingToken')}
                    value={selectedValueBuyToken.currency}
                    onChange={(value) => {
                      setSelectedValueBuyToken(value);
                      if (value !== '') {
                        setValue('buyingToken', value);
                      }
                      if (
                        sellingAmount &&
                        sellingAmount !== 0 &&
                        selectedValueSellToken.currency !== '' &&
                        value !== ''
                      ) {
                        const rate = calExchangeRate();
                        const calAmount = new Decimal(sellingAmount)
                          .times(rate)
                          .toNumber()
                          .toFixed(6) as unknown as number;
                        setBuyingAmount(calAmount);
                        setValue('buyingAmount', calAmount);
                      }
                    }}
                    placeholder='Select tokens'
                  />
                  {errors.buyingToken && (
                    <p className='absolute block text-red-500 text-xs'>
                      {errors.buyingToken.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Accordion type='single' collapsible className='text-zinc-400'>
            <AccordionItem value='item-1' className='space-y-1'>
              <AccordionTrigger className='px-3 md:px-5 bg-fuchsia-100 dark:bg-zinc-800 border border-fuchsia-200 rounded-lg data-[state=open]:rounded-b-none'>
                Transaction summary
              </AccordionTrigger>
              <AccordionContent className='p-3 md:p-5 bg-fuchsia-100 dark:bg-zinc-800 border border-fuchsia-200 rounded-b-lg'>
                <div className='grid grid-cols-2 justify-between gap-2'>
                  <p>Exchange rate:</p>
                  {selectedValueSellToken.currency !== '' &&
                  selectedValueBuyToken.currency !== '' ? (
                    <p className='text-right'>
                      {`1 ${selectedValueSellToken.currency} ≈ ${numeral(
                        calExchangeRate()
                      ).format('0,0.[00000]')} ${
                        selectedValueBuyToken.currency
                      } (${numeral(selectedValueSellToken.price).format(
                        '$0,0.[00000]a'
                      )})`}
                    </p>
                  ) : (
                    <p className='text-right'>-</p>
                  )}
                </div>
                <div className='grid grid-cols-2 justify-between gap-2'>
                  <p>Price impact:</p>
                  {calPriceImpact() !== 0 ? (
                    <p
                      className={cn(
                        'text-right',
                        calPriceImpact() === 0
                          ? ''
                          : calPriceImpact() > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    >
                      {`${
                        calPriceImpact() === 0
                          ? ''
                          : calPriceImpact() > 0
                          ? '+'
                          : ''
                      }${calPriceImpact()}%`}
                    </p>
                  ) : (
                    <p className='text-right'>-</p>
                  )}
                </div>
                <div className='grid grid-cols-2 justify-between gap-2'>
                  <p>Fees:</p>
                  {calFeeBuyAmount() !== 0 ? (
                    <p className='text-right'>
                      0.2% (
                      {`${numeral(calFeeBuyAmount()).format('$0,0.[000]')}`})
                    </p>
                  ) : (
                    <p className='text-right'>-</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <button
            type='submit'
            className='bg-fuchsia-400 text-white rounded-lg p-2 w-full cursor-pointer hover:-translate-y-1 transform transition duration-200 hover:shadow-md mt-1'
          >
            Swap now
          </button>
        </form>
      </BackgroundGradient>
    </div>
  );
};

export default FancyForm;
