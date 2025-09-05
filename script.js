// Replace with your own API key
const API_KEY = "ed2fb7decb005fe74b61521e";

// Create container
const container = document.createElement("div");
container.className = "converter-container";

// Title
const title = document.createElement("h1");
title.textContent = "💱 Currency Converter";
container.appendChild(title);

// Converter box
const box = document.createElement("div");
box.className = "converter-box";

// Input group 1
const inputGroup1 = document.createElement("div");
inputGroup1.className = "input-group";

const amount = document.createElement("input");
amount.type = "number";
amount.id = "amount";
amount.placeholder = "Enter amount";

const fromCurrency = document.createElement("select");
fromCurrency.id = "fromCurrency";

inputGroup1.appendChild(amount);
inputGroup1.appendChild(fromCurrency);

// Swap button
const swapBtn = document.createElement("div");
swapBtn.className = "swap-btn";
swapBtn.textContent = "⇅";

// Input group 2
const inputGroup2 = document.createElement("div");
inputGroup2.className = "input-group";

const convertedAmount = document.createElement("input");
convertedAmount.type = "text";
convertedAmount.id = "convertedAmount";
convertedAmount.placeholder = "Converted amount";
convertedAmount.disabled = true;

const toCurrency = document.createElement("select");
toCurrency.id = "toCurrency";

inputGroup2.appendChild(convertedAmount);
inputGroup2.appendChild(toCurrency);

// Convert button
const convertBtn = document.createElement("button");
convertBtn.id = "convertBtn";
convertBtn.textContent = "Convert";

// Result text
const result = document.createElement("p");
result.id = "result";

// Append everything
box.appendChild(inputGroup1);
box.appendChild(swapBtn);
box.appendChild(inputGroup2);
box.appendChild(convertBtn);
box.appendChild(result);
container.appendChild(box);
document.body.appendChild(container);

// Load currencies
async function loadCurrencies() {
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await res.json();

    if (data.result !== "success") {
      result.textContent = "⚠️ Failed to load currencies";
      return;
    }

    const currencies = Object.keys(data.conversion_rates);

    currencies.forEach((code) => {
      let option1 = document.createElement("option");
      option1.value = code;
      option1.textContent = code;

      let option2 = option1.cloneNode(true);

      fromCurrency.appendChild(option1);
      toCurrency.appendChild(option2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
  } catch (error) {
    result.textContent = "⚠️ Error loading currencies";
  }
}

// Convert currency
async function convertCurrency() {
  let amountVal = amount.value;
  if (amountVal === "" || isNaN(amountVal)) {
    result.textContent = "⚠️ Please enter a valid amount";
    return;
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`);
    const data = await res.json();

    if (data.result !== "success") {
      result.textContent = "⚠️ Conversion failed";
      return;
    }

    let rate = data.conversion_rates[toCurrency.value];
    let converted = (amountVal * rate).toFixed(2);

    convertedAmount.value = converted;
    result.textContent = `${amountVal} ${fromCurrency.value} = ${converted} ${toCurrency.value}`;
  } catch (error) {
    result.textContent = "⚠️ Error fetching conversion";
  }
}

// Swap functionality
swapBtn.addEventListener("click", () => {
  let temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});

// Event listener
convertBtn.addEventListener("click", convertCurrency);

// Load currencies on start
loadCurrencies();
