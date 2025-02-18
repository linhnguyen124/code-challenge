| #   | Issues                                               | Fixes                                                                 |
| --- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | **Missing `blockchain` property in `WalletBalance`** | Add `blockchain: string` to `WalletBalance` interface.                |
| 2   | **Undefined `lhsPriority` variable**                 | Replace `lhsPriority` with `balancePriority`.                         |
| 3   | **Incorrect logic in `filter()` function**           | Simplify the condition and return only valid balances.                |
| 4   | **Wrong usage of `toFixed()` on `amount`**           | Ensure `formattedAmount` remains a number after formatting.           |
| 5   | **Potential `NaN` issue when `prices` is undefined** | Use `prices[balance.currency] ?? 0` to handle missing values.         |
| 6   | **Inefficient `switch-case` in `getPriority()`**     | Replace with an object lookup for cleaner and scalable code.          |
| 7   | **Unused `Props extends BoxProps`**                  | Remove `BoxProps` if not used.                                        |
| 8   | **The components lack readability and reusability**  | Refactor code: create component to reuseable (ListWallets, WalletRow) |
| 8   | **The functional lack readability and reusability**  | Refactor code: create `hooks` file and `utils` file to reuseable      |
| 9   | **The entities lack readability and reusability**    | Refactor code: create `entities` file to reuseable                    |

## Advance

### Folder structure

```
.
├── README.md
├── index.html
├── package.json
├── public
│   ├── favicon.ico
│   └── manifest.webmanifest
├── src
│   ├── components
│   ├── constantS
│   ├── contexts
│   ├── models
│   ├── pages
│   ├── services
│   ├── styles
│   ├── tests
│   ├── utils
│   ├── App.tsx
│   ├── main.tsx
│   └── routes.tsx
├── jest.config.js
├── lint-staged.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
```

### Architecture

Source code is stored in `src` folder:
fonts, icons, images

- `components`: Global components
- `constants`: Global constant variables
- `contexts`: Global statement components
- `models`: Contains entities our application
- `pages`: Contains screens application

  - `pages/<name>.tsx`: using as a page index
  - `pages/<name>/<sub-name>.tsx`: using as a sub-page index
  - `pages/<name>/<components>.tsx`: using as a page components

- `services`: Contains all global services that can make API calls or calculation. These services can be shared across the app
  - `services/axios`: Contains instance axios
- `styles`: Contains styles application
- `utils`: Contains helpers and hooks
