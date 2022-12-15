import { useContext, useEffect, useMemo } from "react"
import { appContext } from "../../../App"
import { transactionDetailsContext } from "./TransactionDetails";

const SingleTransaction = (props) => {
    const {single} = props
    const {exchangeRate, USDMode, CurrencyConverted} = useContext(appContext)
    const {setEditMode, setEditTarget} = useContext(transactionDetailsContext)

    const transactionName = useMemo(()=>single["transaction-name"],[single])
    const transactionCategory = useMemo(()=>single["categories-selections"],[single])
    const transactionID = useMemo(()=>single["transactionID"],[single])
    
    const transactionAmount = useMemo(()=>{
        if(USDMode && Object.keys(single).length>=0){
            return CurrencyConverted(single["transaction-amount"])
        }
        else if(!USDMode && Object.keys(single).length>=0){
            return CurrencyConverted((single["transaction-amount"]*exchangeRate).toFixed(2))
        }
    },[single, USDMode])
    const transactionNote = useMemo(()=>single["transaction-note"],[single])

    const ClicktoEdit = (e) => {
        const target = e.currentTarget
        const left = target.scrollLeft
        target.scrollTo({
            left: 1000,
            behavior: 'smooth'
        })    
        if(left > 0){
            target.scrollTo({
                left: 0,
                behavior: 'smooth'
            })    
        }
        else{
            target.scrollTo({
                left: 1000,
                behavior: 'smooth'
            })  
        }
    }

    const EditClickHandle = (e) =>{
        setEditTarget(single)
        setEditMode(true)
    }

    return <div className="single-transaction-container" onClick={ClicktoEdit} data-key={transactionID}>
    <div className="transaction-details">
            <div className="transaction-name-and-category">
                <span className="transaction-name">{transactionName}</span>
                <span className="transaction-category">{transactionCategory}</span>
            </div>

            <div className="transaction-amount">
                <span>{transactionAmount}</span>
                <i className="fa-solid fa-angle-right"></i>
            </div>
    </div>
    <div className="edit-transaction" onClick={EditClickHandle}>edit</div>
</div>
}

export default SingleTransaction