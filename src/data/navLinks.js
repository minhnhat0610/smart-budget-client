const navLinks = [
    {
        label: "dashboard",
        icon: "fa-solid fa-house-chimney",
        anchor: "/",
        type: "link"
    },

    {
        label: "current balance",
        icon: "fa-solid fa-sack-dollar",
        anchor: "total-balance-container",
        type: "anchor"
    },

    {
        label: "pie chart",
        icon: "fa-solid fa-chart-pie",
        anchor: "transaction-summary-container",
        type: "anchor"
    },

    {
        label: "line chart",
        icon: "fa-solid fa-chart-line",
        anchor: "transaction-chart-container",
        type: "anchor"
    },

    {
        label: "transactions",
        icon: "fa-solid fa-list",
        anchor: "transaction-details-container",
        type: "anchor"
    },

    {
        label: "add transaction",
        icon: "fa-solid fa-square-plus",
        anchor: "/addtransactions",
        type: "link"
    },

]

export default navLinks