// Import Chart.js
import {Chart, ArcElement, elements} from "chart.js/auto"
import { Doughnut } from "react-chartjs-2"
import { bodyContext } from "../../Home"
import { appContext } from "../../../App"
// Import React Hooks
import { useContext, useEffect, useMemo } from "react"

// Import Pie Chart colors
import pieChartColors from "../../../dark-mode-colors/pieChartColors"

const PieChart = (props) => {
    const {colorPalette, categories} = props
    const {CurrencyConverted, USDMode} = useContext(bodyContext)
    const {exchangeRate} = useContext(appContext)
    
    let category = useMemo(()=>{
        let result=[]
        for(let category in categories){
            if(categories[category] >=0){
                result.push(category)
            }
        }
        return result
    },[categories])

    let amount = useMemo(()=>{
        let amount = []
        for(let category in categories){
            if(categories[category] >=0){
                amount.push(categories[category])
            }
        }
        return amount
    },[categories])

    let TotalAmount = useMemo(()=>{  
        let total = amount.reduce((prev,curr)=>prev+curr,0)
        return USDMode ? total.toFixed(2) : (total*exchangeRate).toFixed(2)
    },[categories, USDMode])

    const data = {
        labels: category,
          datasets: [{
            label: 'Transaction Categories',
            data: amount,
            backgroundColor: pieChartColors,
            hoverOffset: 10,
            borderColor: colorPalette.containerBG,
            borderRadius: {
                'innerStart': 20,
                'outerStart': 20
            }
          }]
    }

    const option = {
        plugins:{
            tooltip: {
                enabled: true
            },
            legend:{
                display: false
            },
            
        },
        elements:{
            arc:{
                borderJoinStyle:'miter'
            }
        },
        cutout: "90%"
    }
    
    return (
        <div id="doughnut-chart-container">
            <Doughnut id="chart-container" data={data} options={option}/>

            <div id="percentage-values">
                <p className="values-label">total values</p>
                <p className="chart-values">{CurrencyConverted(TotalAmount)}</p>
            </div>
        </div>

    )
    
}

export default PieChart