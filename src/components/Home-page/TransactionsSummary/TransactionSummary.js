// Import Components
import ContainerTitle from "../ContainerTitle"
import PieChart from "./PieChart"
import Category from "./Category"

// Import React hooks
import { useState, useEffect, useMemo} from "react"


const TransactionSummary = (props) => {
    const {colorPalette, transactionsArr} = props
    let [isLoading, setIsLoading] = useState([])
    let [categories, setCategories] = useState({})

    const TotalAmount = useMemo(()=>{
        let total = 0
        for(let category in categories){
          if(categories[category] >= 0){
            total += categories[category]
          }
        }
        return total
  
      },[categories])


    useEffect(()=>{
        if(transactionsArr.length > 0){
            setIsLoading(false)
            setCategories(getCategories(transactionsArr))
        }
        else{
            setIsLoading(true)
        }

        
        
    },[transactionsArr])

    const getCategories = (transactionsArr) => {
        if(transactionsArr){
            let categories = {}
            transactionsArr.map((transaction)=>{
                const transactionData = transaction["data"]
                transactionData.map((data)=>{
                   const categoryName =  data["categories-selections"]
                   const amount = data["transaction-amount"]

                    if(!categories[categoryName]){
                        categories[categoryName] = amount
                    }
                    else{
                        categories[categoryName] += amount
                    }
                })
            })

            return categories

        }
    }

    return <div id="transaction-summary-container" className="section-container">
        <ContainerTitle  title="transaction summary"/>
        
        <div className="content-container" style={{backgroundColor: colorPalette.containerBG}}>
            
            {
                isLoading
                ? <div className="loading"></div>
                :
                <>
                    <PieChart colorPalette={colorPalette} categories={categories} TotalAmount={TotalAmount}/>
                <div id="category-container">
                    <Category colorPalette={colorPalette} categories={categories} TotalAmount={TotalAmount}/>
                </div></>
            }

        </div>
    </div>
}

export default TransactionSummary