import * as Select from '@radix-ui/react-select';
import { useMemo } from 'react';
import { cn } from 'utils/helpers';

type CurrencySelectProps = {
  options: {
    withValue: string;
    withLabel: string;
    withIconURL?: string;
    data: any[] | null;
  };
  name?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  options,
  name,
  value,
  placeholder,
  onChange
}) => {
  const _options = useMemo(() => {
    const newOptions = options.data
      ? options.data.map((item) => {
          const selectOptions = {} as {
            value: string;
            label: string;
            iconURL?: string;
            disabled?: boolean;
          };
          selectOptions.value = item[options.withValue];
          selectOptions.label = item[options.withLabel];

          if (options.withIconURL) {
            selectOptions.iconURL = item[options.withIconURL];
          }
          if (item.isDisabled) {
            selectOptions.disabled = item.isDisabled;
          }
          return selectOptions;
        })
      : [];
    return newOptions;
  }, [options]);

  return (
    <Select.Root value={value} onValueChange={onChange} name={name}>
      <Select.Trigger className='flex items-center justify-between h-10 border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-2xl px-2 py-2 text-sm focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--color-neutral-700)] group-hover/input:shadow-none transition duration-400 relative w-full'>
        <Select.Value
          placeholder={
            <p className='bg-fuchsia-400 text-white whitespace-nowrap w-full h-full rounded-2xl px-3 py-2 text-sm absolute left-0 top-0 flex items-center justify-center pr-7 font-semibold'>
              <span className=''>{placeholder}</span>
            </p>
          }
        />
        <Select.Icon className='z-10 text-zinc-100'>
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
            className='w-4 h-4'
          >
            <path d='m6 9 6 6 6-6' />
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className='absolute z-50 bg-gray-50 shadow-input rounded-md'>
          <Select.Viewport className='p-2'>
            {_options.map((option, idx) => (
              <Select.Item
                key={`${option.value}_${idx}`}
                value={option.value}
                className={cn(
                  'flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md',
                  value !== option.value
                    ? 'aria-[disabled]:cursor-not-allowed aria-[disabled]:bg-gray-400 aria-[disabled]:opacity-50 aria-[disabled]:text-white'
                    : ''
                )}
                disabled={option.disabled}
              >
                <Select.ItemText>
                  <p className='flex items-center gap-1'>
                    {option.iconURL && (
                      <img
                        src={option.iconURL}
                        alt={`icon ${option.iconURL}`}
                        className='w-5 h-5'
                        width='20'
                        height='20'
                      />
                    )}
                    <span>{option.label}</span>
                  </p>
                </Select.ItemText>
                <Select.ItemIndicator className='ml-8'>
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
                    className='w-4 h-4 text-blue-500'
                  >
                    <path d='M20 6 9 17l-5-5' />
                  </svg>
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default CurrencySelect;
