<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  // Определение начальных значений
  let amountFrom = 0;
  let amountTo = 0;
  let currencyFrom = "";
  let currencyTo = "";

  // Создание диспетчера событий для обновления валютных данных
  const dispatch = createEventDispatcher();

  // Обработчик выбора валюты
  const selectCurrency = (event, field) => {
    const { value } = event.target;
    if (field === "from") {
      currencyFrom = value;
    } else {
      currencyTo = value;
    }
    dispatch("currencySelected", { currencyFrom, currencyTo });
  };

  // Функция для обновления суммы при изменении значений
  const updateAmount = (event, field) => {
    const { value } = event.target;
    if (field === "from") {
      amountFrom = value;
      amountTo = (amountFrom * exchangeRate).toFixed(2);
    } else {
      amountTo = value;
      amountFrom = (amountTo / exchangeRate).toFixed(2);
    }
  };

  // Подписка на событие выбора валюты
  onMount(() => {
  const unsubscribe = dispatch("currencySelected", ({ detail }) => {
    currencyFrom = detail.currencyFrom;
    currencyTo = detail.currencyTo;
    fetch("https://www.exchangerate-api.com/docs/free")
      .then((response) => response.json())
      .then((data) => {
        exchangeRate = data.rate;
        amountTo = (amountFrom * exchangeRate).toFixed(2);
        
      })
      .catch((error) =>
        console.error("Ошибка при запросе курса обмена:", error)
      );
  });

  return unsubscribe;
});

  // Переменная для хранения курса обмена
  let exchangeRate = 1.0; // Изначально 1:1
</script>

<div>
  <label class="text" for="from">From:</label>
  <input
    class="input"
    type="number"
    id="from"
    bind:value={amountFrom}
    on:input={(e) => updateAmount(e, "from")}
  />
  <select class="money" id="currencyFrom" on:change={(e) => selectCurrency(e, "from")}>
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="RUS">RUS</option>
  </select>
</div>

<div>
  <label class="text" for="to">To:</label>
  <input
    class="input"
    type="number"
    id="to"
    bind:value={amountTo}
    on:input={(e) => updateAmount(e, "to")}
  />
  <select class="money" id="currencyTo" on:change={(e) => selectCurrency(e, "to")}>
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="RUS">RUS</option>
  </select>
</div>

<style>
    .text {
     font-size: 30px;
    }
    .input {
      padding: 10px 20px;
      border-radius: 10px;
    }
    .money {
        padding: 10px 20px;
        border-radius: 10px; 
    }
    
  </style>