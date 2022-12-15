// Import Components
import ContainerTitle from "../ContainerTitle"
import BalanceAmount from "./BalanceAmount"
import { bodyContext } from "../../Home"
import { appContext } from "../../../App"
import serverURL from "../../../data/serverURL"
// Import React hooks
import {createContext, useContext, useEffect, useRef, useState } from "react"

// Import Axios
import axios from "axios"
import { faTruckPlane } from "@fortawesome/free-solid-svg-icons"

export const TotalBalanceContext = createContext()

const TotalBalance = (props) => {
    let [isLoading, setIsLoading] = useState(true)
    let [BalanceData, setBalanceData] = useState({})
    let [totalBalance,setTotalBalance] = useState(0) 
    let [ledgerBalance, setLedgerBalance] = useState(0)
    let [closeDate, setCloseDate] = useState()
    let [endDate, setEndDate] = useState()
    let [isUpdated, setIsUpdated] = useState(false)
    
    const {USDMode, setUSDMode, exchangeRate} = useContext(appContext)
    
    let currencyToggleBtn = useRef()
    const {colorPalette} = props

    useEffect(()=>{
        fetchData()
    },[])


    useEffect(()=>{
        if(ledgerBalance){
            //Send data to server to update ledger balance;
            let sentData = BalanceData
            //update ledger balance and close date
            sentData["ledger-balance"] = Number(ledgerBalance)
            sentData['close-date'] = new Date().toLocaleDateString()

            sendData(sentData)
        }
    },[isUpdated])

    useEffect(()=>{
        if(!isLoading){
            if(USDMode){
            currencyToggleBtn.current.classList.remove("VNDMode")
            }
            else{
                currencyToggleBtn.current.classList.add("VNDMode")
            }
        }
    },[USDMode, isLoading])

    

    const sendData = async (data) =>{
        try{
            const updateLedgerBalanceReq = await UpdateLedgerBalance(data)
            return updateLedgerBalanceReq
        }
        catch(err){
            return err
        }
    }

    const UpdateLedgerBalance = async (data) => {
        try{
            const serverRes = await axios.post(serverURL["BALANCE_URL"], data)
            return serverRes
        }
        catch(err){
            return err
        }
    }

    const fetchData = async () => {
         //fetch data from backend API
         try{
            const totalBalanceRequest = await fetchTotalBalance()


            const totalBalance = totalBalanceRequest.data["total-balance"]
            const ledgerBalance = totalBalanceRequest.data["ledger-balance"]
            const closeDate = new Date(totalBalanceRequest.data["close-date"])
            const endDate = new Date(totalBalanceRequest.data["end-date"])



            setBalanceData(totalBalanceRequest.data)
            setTotalBalance(totalBalance.toFixed(2))
            setLedgerBalance(ledgerBalance.toFixed(2))
            setCloseDate(closeDate)
            setEndDate(endDate)


            setIsLoading(false)
   
         }

         catch(err){
            console.log(err.message)
         }
    }

    const fetchTotalBalance = () =>{
        try{
            const serverRes = axios.get(serverURL["BALANCE_URL"]);
            return serverRes
        }

        catch(err){
            return err
        }

    }




    const ChangeCurrency = () => {
        setUSDMode((prevMode) => !prevMode)
    }

    return <TotalBalanceContext.Provider value={{totalBalance, endDate, ledgerBalance, closeDate, setLedgerBalance, USDMode, setIsUpdated}}>
        <div id="total-balance-container" className="section-container">
        <ContainerTitle  title="total balance"/>
        
        <div className="content-container" style={{backgroundColor: colorPalette.containerBG}}>
            {
                isLoading 
                ? <div className="loading"></div>
                :
                <><BalanceAmount /> 
            
                <div id="currency-exchange" className="currency-exchange">
                    <div id="exchange-rate">Exchange rate: {exchangeRate}</div>
                    <span>USD</span>
                    <div id="toggle-currency" onClick={ChangeCurrency}  >
                        <div id="toggle-btn" style={{backgroundColor: colorPalette.containerBG}} ref={currencyToggleBtn}></div>
                    </div>
                    <span>VND</span>
                </div></>
            }
           

        </div>
        
    </div>
    </TotalBalanceContext.Provider>
     
}

export default TotalBalance