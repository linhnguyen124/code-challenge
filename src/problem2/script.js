document.addEventListener("DOMContentLoaded", async function () {
  const inputAmount = document.getElementById("input-amount");
  const outputAmount = document.getElementById("output-amount");
  const fromCurrency = document.getElementById("from-currency");
  const toCurrency = document.getElementById("to-currency");
  const swapButton = document.getElementById("swap-btn");
  const form = document.getElementById("swap-form");
  const fromIcon = document.getElementById("from-icon");
  const toIcon = document.getElementById("to-icon");

  let exchangeRates = {};

  async function fetchRates() {
    try {
      const response = await fetch(
        "https://interview.switcheo.com/prices.json"
      );
      const data = await response.json();

      exchangeRates = data.reduce((acc, entry) => {
        acc[entry.currency] = entry.price;
        return acc;
      }, {});

      Object.keys(exchangeRates).forEach((currency) => {
        let option1 = new Option(currency, currency);
        let option2 = new Option(currency, currency);
        fromCurrency.add(option1);
        toCurrency.add(option2);
      });

      fromCurrency.value = "SWTH";
      toCurrency.value = "ETH";

      updateIcons();
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  }

  function updateIcons() {
    fromIcon.src = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${fromCurrency.value}.svg`;
    toIcon.src = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${toCurrency.value}.svg`;
  }

  swapButton.addEventListener("click", () => {
    let temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    updateIcons();
    calculateExchange();
  });

  function calculateExchange() {
    const amount = parseFloat(inputAmount.value);
    if (
      amount > 0 &&
      exchangeRates[fromCurrency.value] &&
      exchangeRates[toCurrency.value]
    ) {
      outputAmount.value = (
        (amount * exchangeRates[toCurrency.value]) /
        exchangeRates[fromCurrency.value]
      ).toFixed(4);
    } else {
      outputAmount.value = "";
    }
  }

  inputAmount.addEventListener("input", calculateExchange);
  fromCurrency.addEventListener("change", () => {
    updateIcons();
    calculateExchange();
  });
  toCurrency.addEventListener("change", () => {
    updateIcons();
    calculateExchange();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert(
      `Swapped ${inputAmount.value} ${fromCurrency.value} to ${outputAmount.value} ${toCurrency.value}`
    );
  });

  await fetchRates();
});
