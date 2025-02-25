# **Issues and Fixes in WalletPage Component**

## **Identified Issues**

### **1. Undefined Variable (`lhsPriority`)**
#### **Issue:**
- The condition `if (lhsPriority > -99)` is used, but `lhsPriority` is **never defined**.
- This will cause a **ReferenceError**.

#### **Fix:**
- Replace `lhsPriority` with `balancePriority`.

---

### **2. Inefficient Sorting Logic**
#### **Issue:**
- The sorting logic calls `getPriority(balance.blockchain)` **multiple times**, leading to redundant computations.
- This affects performance, especially for large data sets.

#### **Fix:**
- Cache priority values using a **Map** to avoid redundant calculations.

---

### **3. Incorrect Filtering Condition**
#### **Issue:**
- The filter condition mistakenly **allows zero and negative balances** instead of filtering them out.

#### **Fix:**
- Change the filter logic to properly remove non-positive balances.

---

### **4. Unnecessary Mapping (`formattedBalances`)**
#### **Issue:**
- The component creates an additional `formattedBalances` array **but never uses it separately**.

#### **Fix:**
- Move the formatting logic directly into the JSX rendering.

---

### **5. Incorrect `key` Usage in React List**
#### **Issue:**
- The component uses `index` as a `key`, which can cause rendering issues when the list updates.

#### **Fix:**
- Use `balance.currency` as a **unique identifier**.

---

### **6. Undefined USD Value Leading to `NaN`**
#### **Issue:**
- If `prices[balance.currency]` is `undefined`, the calculation produces `NaN`.

#### **Fix:**
- Use a **fallback value** (`0`) to prevent errors.

---

### **7. Unused Dependency in `useMemo`**
#### **Issue:**
- `prices` is included in the `useMemo` dependency array but **not used inside** the function.

#### **Fix:**
- Remove `prices` from dependencies.

---

## **Refactored Code with Fixes**

```tsx
import React, { useMemo } from "react";
import { BoxProps } from "@mui/material";
import { useWalletBalances, usePrices } from "../hooks";
import WalletRow from "./WalletRow";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Cache priority values using useMemo to avoid redundant calculations
  const priorityCache = useMemo(() => new Map<string, number>(), []);

  const getPriority = (blockchain: string): number => {
    if (priorityCache.has(blockchain)) {
      return priorityCache.get(blockchain)!;
    }
    const priority = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    }[blockchain] ?? -99;
    priorityCache.set(blockchain, priority);
    return priority;
  };

  // Filter and sort balances efficiently
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
  }, [balances]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance) => {
        const usdValue = prices[balance.currency]
          ? prices[balance.currency] * balance.amount
          : 0;

        return (
          <WalletRow
            className="wallet-row"
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.amount.toFixed()}
          />
        );
      })}
    </div>
  );
};

export default WalletPage;
```

---

## **Summary of Fixes**

| Issue | Fix |
|---|---|
| **Undefined variable (`lhsPriority`)** | Replaced with `balancePriority` |
| **Inefficient sorting logic** | Cached blockchain priorities using `useMemo` |
| **Incorrect filtering condition** | Fixed to properly remove zero/negative balances |
| **Unnecessary extra mapping (`formattedBalances`)** | Moved formatting directly into JSX |
| **Incorrect key usage** | Used `balance.currency` as key instead of index |
| **Undefined USD value causing NaN** | Added fallback value (`0`) |
| **Unused dependency in `useMemo`** | Removed `prices` from dependencies |

---

