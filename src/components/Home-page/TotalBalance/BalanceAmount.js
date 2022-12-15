// Import React Hooks
import { useEffect, useState, useMemo, useContext } from "react"

// Import Context
import { bodyContext } from "../../Home"
import { appContext } from "../../../App"
import { TotalBalanceContext } from "./TotalBalance"

const BalanceAmount = (props) => {
    const {totalBalance, ledgerBalance, setLedgerBalance, closeDate, endDate, setIsUpdated} = useContext(TotalBalanceContext)
    const {CurrencyConverted, USDMode} = useContext(bodyContext)
    const {exchangeRate} = useContext(appContext)

    const startDate = useMemo(()=>{
        return new Date()
    })

    let totalAmount = useMemo(()=>{
        if(USDMode){
            return totalBalance
        }
        else
            return (totalBalance*exchangeRate).toFixed(2)
    },[USDMode])

    let duration = useMemo(()=>{
        if(startDate && endDate){
            const time = (endDate.getTime() - startDate.getTime()) / (1000*60*60*24)
            return Math.ceil(time)
        }
        else return 0
    })

    let dailyThreshold = useMemo(()=>{
        if(USDMode){
            return (ledgerBalance/duration).toFixed(2)
        }
        else
            return (ledgerBalance*exchangeRate/duration).toFixed(2)
    })



    useEffect(()=>{
        // Check if ledger balance is up to date
        if(closeDate.toLocaleDateString() != startDate.toLocaleDateString()) {
            console.log("Update ledger balance")
            setLedgerBalance(totalBalance)
            setIsUpdated(true)
        }
    },[])


    return (
        <div id="total-balance">
        <i className="fa-solid fa-money-check-dollar" id="total-balance-icon"></i> 
        <div id="test"></div>
        <div id="balance" className="balance-number">{CurrencyConverted(totalAmount)}</div>
        <div id="daily-threshold" className="balance-number">
            <span>Daily threshold: &nbsp;</span>
            <span id="threshhold-number"> {CurrencyConverted(dailyThreshold)}</span>
        </div>
    
        </div>
    
    )             
}

export default BalanceAmount