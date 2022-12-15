const domain = "https://smartbudgetapi.onrender.com/api"
// "http://localhost:5000/api"
const exchangeRateAPI = "https://api.exchangerate.host"

const route = {
    "balance": "/balance",
    "transactions": "/transactions/",
    "exchange-rate": "/latest?base=USD"
}

const serverURL = {
    "BALANCE_URL": `${domain}${route["balance"]}`,
    "TRANSACTION_URL": `${domain}${route["transactions"]}`,
    "EXCHANG_RATE_URL": `${exchangeRateAPI}${route["exchange-rate"]}`
}

export default serverURL