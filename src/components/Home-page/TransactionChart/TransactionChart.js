// Import components
import ContainerTitle from "../ContainerTitle"
import { appContext } from "../../../App"
import { Line } from "react-chartjs-2"

// Import React Hooks
import { useContext, useEffect, useMemo, useRef } from "react"

const TransactionChart = (props) => {
    const {colorPalette} = props
    const {transactionsArr, exchangeRate,USDMode} = useContext(appContext)
    const lineChart = useRef()

    const numOfTransaction = transactionsArr.length

    useEffect(()=>{
        const activeFilter = document.querySelector(".active-line-filter")
        const index = Number(activeFilter.getAttribute("data-key"))
        switch (index) {
            case 0:
                UpdateChartDatasets(transactionByDate, "transaction-date")
                break;
            case 1:
                UpdateChartDatasets(transactionByMonth, "transaction-month")
                break;
            case 2:
                UpdateChartDatasets(transactionByYear, "transaction-year")
                break;
            default:
                break;
        }
    },[USDMode])

    const LookforIndex = (array, target, attribute) => {
        let result = -1
        array.forEach((element,index) => {
            if(element[attribute] === target){
                result = index
            }
        });

        return result
    }

    const transactionByDate = useMemo(()=>{
        let result = []
        for(let i = numOfTransaction-1 ; i >=0; i--){
            const transactionGroup = transactionsArr[i]
            let date = transactionGroup["transaction-date"]
            let totalAmount = transactionGroup.data.reduce((prev, current)=>{
                return current["transaction-amount"] >=0 ? prev + current["transaction-amount"] : prev
            },0)

            result.push({"transaction-date": date, amount: totalAmount})


        } 
        return result
    },[transactionsArr])

    const transactionByMonth = useMemo(()=>{
        if(transactionByDate.length>=0){
            let result = []
            let months = []
            const numOfTransaction = transactionByDate.length
            for(let i = 0; i <numOfTransaction; i++){
                let date = new Date(transactionByDate[i]["transaction-date"])
                let month = date.toLocaleDateString("en-us",{timeZone: "UTC", month: "numeric", year: "numeric"})
                if(months.indexOf(month) >=0){
                    let index = LookforIndex(result,month,"transaction-month")
                    result[index].amount += transactionByDate[i].amount
                }
                else{
                    months.push(month)
                    result.push({"transaction-month": month, amount: transactionByDate[i].amount})
                }
            }

            return result

        }else return []
    },[transactionByDate])

    const transactionByYear = useMemo(()=>{
        if(transactionByMonth.length >= 0){
            let result=[]
            let years=[]
            const numOfTransaction = transactionByMonth.length
            for(let i = 0; i<numOfTransaction; i++){
                let splitterIndex = transactionByMonth[i]["transaction-month"].indexOf("/")
                let year = transactionByMonth[i]["transaction-month"].substring(splitterIndex+1)
                if(years.indexOf(year) >=0){
                    let index = LookforIndex(result, year, "transaction-year")
                    result[index].amount += transactionByMonth[i].amount
                }
                else{
                    years.push(year)
                    result.push({"transaction-year": year, amount: transactionByMonth[i].amount})
                }
            }


            return result
        }
    },[transactionByMonth])

    
    let width, height, gradient
    const getGradient = (ctx, chartArea) => {
        const chartWidth = chartArea.right - chartArea.left;
        const chartHeight = chartArea.bottom - chartArea.top;
        if (!gradient || width !== chartWidth || height !== chartHeight) {
            // Create the gradient because this is either the first render
            // or the size of the chart has changed
            width = chartWidth;
            height = chartHeight;
            gradient = ctx.createLinearGradient(chartArea.left, chartArea.top, chartArea.right, chartArea.top);
            gradient.addColorStop(0, "#ee38cb");
            gradient.addColorStop(1, "#8449fb");
        }

        return gradient;
    }
    const data = {
        labels: transactionByDate.map((value)=> value["transaction-date"]),
        datasets: [{
            labels: 'Expenses by Date',
            data: transactionByDate.map((value)=> value.amount),
            borderColor: function(context){
                const chart = context.chart
                const {ctx, chartArea} = chart

                if(chartArea){
                    return getGradient(ctx, chartArea);
                }else return;
            },
            borderWidth: 4,
            pointBackgroundColor: '#5ad97f',
            pointHoverBackgroundColor: "#f7935c",
            pointBorderWidth: 0,
        }]
    }


    const options = {
        plugins:{
            legend:{
                display: false
            },
            tooltip:{
                enable: true
            }
            
        },
        scales:{
            x:{
                ticks:{
                    color: colorPalette.secondary_Font_Colors,
                },
                grid: {
                    color: colorPalette.gridColor
                },
                border:{
                    display:false
                }
            },
            y:{
                ticks: {
                    color: colorPalette.secondary_Font_Colors,

                },
                grid: {
                    color: colorPalette.gridColor
                },
                border:{
                    display:false
                }
            }
        }
    }

    const actions = [
        {
            name: "daily",
            handler(e){
                UpdateChartDatasets(transactionByDate, "transaction-date")
                HighlightFilterBtn(e)
            }
        },
        {
            name: "monthly",
            handler(e){
                UpdateChartDatasets(transactionByMonth, "transaction-month")
                HighlightFilterBtn(e)
            }
        },
        {
            name: "yearly",
            handler(e){
                UpdateChartDatasets(transactionByYear, "transaction-year")
                HighlightFilterBtn(e)
            }
        },
    ]

    const HighlightFilterBtn = (e) => {
        const target = e.currentTarget
        const filterBtnCollection = document.querySelectorAll(".line-chart-filter");
        filterBtnCollection.forEach(btn =>{
            btn.classList.remove("active-line-filter")
        })

        target.classList.add("active-line-filter")
    }

    const UpdateChartDatasets = (transactionsDataset, labelTarget) => {
        const chart = lineChart.current
        chart.data.datasets[0].data = transactionsDataset.map((transactionGroup)=> USDMode?transactionGroup.amount:transactionGroup.amount*exchangeRate)
        chart.data.labels = transactionsDataset.map((transactionGroup)=> transactionGroup[labelTarget])

        chart.update()
    }

    return <div id="transaction-chart-container" className="section-container">
        <ContainerTitle  title="activities chart"/>
        
        <div className="content-container" style={{backgroundColor: colorPalette.containerBG}}>
            <div id="chart-filter-options">
                {
                    actions.map((option,index)=>{
                        return index >=1 ? <div className="line-chart-filter" key={index} data-key={index} onClick={actions[index].handler} style={{
                            background: `linear-gradient(${colorPalette.containerBG},${colorPalette.containerBG}) padding-box, linear-gradient(to right, var(--lightChartColor), var(--darkChartColor)) border-box`
                        }}>{option.name}</div>
                        :
                        <div className="line-chart-filter active-line-filter" key={index} data-key={index} onClick={actions[index].handler} style={{
                            background: `linear-gradient(${colorPalette.containerBG},${colorPalette.containerBG}) padding-box, linear-gradient(to right, var(--lightChartColor), var(--darkChartColor)) border-box`
                        }}>{option.name}</div>
                    })
                }
            </div>
            <div id="expense-line-chart-container">
                <div>
                    <Line data={data} options={options} ref={lineChart}/>
                </div>
            </div>
        </div>
    </div>
}

export default TransactionChart