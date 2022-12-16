// Import components
import Header from "./Home-page/Header"
import ContainerTitle from "./Home-page/ContainerTitle"
import inputList from "../data/inputList"

import { appContext } from "../App"
import serverURL from "../data/serverURL"
import SubmitForm from "./Add-transaction-page/SubmitForm"

// Import React Hooks
import {useContext, useEffect, useMemo, useRef, useState} from "react"
import { icon } from "@fortawesome/fontawesome-svg-core"
import axios from "axios"

const AddTransaction = () => {
    const {DisplayDarkMode, colorPalette, setMenuExpanded} = useContext(appContext)
    const {setUSDMode, USDMode, exchangeRate} = useContext(appContext)

    const inputArr= useMemo(()=>inputList,[])
    const [isLoading,setIsLoading] = useState(true)
    const [validForm, setValidForm] = useState([])
    const [balanceData, setBalanceData] = useState(0)
    const [totalBalance,setTotalBalance] = useState(0) 
    const [submitting, setSubmitting] = useState(false)

    const submitForm = useRef()
    const submitBtn = useRef()
    const currencyToggleBtn = useRef()
    const loadingScreen = useRef()

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

    useEffect(()=>{
        if(loadingScreen.current){
            if(submitting === true){
                console.log("this is call")
                // turn on submitting loading
                DisplaySubmitLoading()
                //submit the form to server
                SubmitTransaction()
                //clear the form inputs
                submitForm.current.reset()
                // reset Validform
                setValidForm([])
            }
            else{
                DisplaySubmitLoading()
            }
        }
    },[submitting])

    useEffect(()=>{
        fetchData()
    },[])

    const DisplaySubmitLoading = ()=>{
        loadingScreen.current.classList.toggle("display-loading")
        submitBtn.current.classList.toggle("disable-submit-btn")
    }


    const AddOrRemoveValidInput = (arr,element, flag) => {
        const index = arr.indexOf(element)
        if(flag === "add"){
            if(index <0){
                return [...arr, element]
            }
            else return arr 
        }
        else{
            if(index>=0){
                arr.splice(index,1)
                return arr
            }
            else return arr
        }
    }

    const SumbitBtnClickHandle = () => {
        if(validForm.length >= 4){
            setSubmitting(true)
        }
        else{
            alert("Invalid Form")
            setSubmitting(false)
        }
    }



    const SubmitTransaction = async () => {
            console.log("Valid Form")
            try{
                const sentData = CollectInputValues(validForm)

                // Covert amount to negative value if category is a deposit transaction
                const category = sentData.data[0]["categories-selections"]
                if(category === "Deposit"){
                    sentData.data[0]["transaction-amount"] *= -1
                }

                const newBalance = ReCalculateTotalBalance(sentData.data[0]["transaction-amount"])

                if(sentData && newBalance){
                    try{
                        const TransactionPOST = await SendTransactionToServer(sentData)
                        const BalanceUpdatePOST = await UdpateBalanceToServer(newBalance)
    
                        
                        setTotalBalance(newBalance)
                        setBalanceData((prev)=>{
                            prev["total-balance"] = newBalance
                            return prev
                        })
                        alert("Transaction Update Successfully!")
                    }
                    catch(err){
                        console.log(err)
                        alert("SERVER_ERROR!!!")
                    }
                }else{
                    throw "Transaction is corrupted. Try Again!"
                }
                
            }

            catch(err){
                console.log(err)
                alert("CLIENT_ERROR!!!")
            }
            finally{
                setSubmitting(false)
            }
           
    }

    const UdpateBalanceToServer = (newBalance) => {
        try{
            const data = balanceData
            data["total-balance"] = newBalance
            const serverRes = axios.post(serverURL["BALANCE_URL"],data)
            return serverRes
        }
        catch(err){
            return err
        }
    }

    const SendTransactionToServer = (data) => {
        try{
            const serverRes = axios.post(serverURL["TRANSACTION_URL"],data)
            return serverRes
        }
        catch(err){
            return err
        }
    }

    const ReCalculateTotalBalance = (expense) => {
        return Number(totalBalance) - Number(expense)
    }

    const CollectInputValues = (inputArr) => {
        let result = {data:[]}
        const inputObj = {"transaction-note": ""}
        if(inputArr.length>=4){
            for(let input of inputArr){
                const inputType = input.getAttribute("type")
                switch (inputType) {
                    case "tel":
                        let strippedCurrency = Number(StripCurrency(input.value))
                        let amount =  USDMode ? strippedCurrency : Number((strippedCurrency/exchangeRate).toFixed(2))
                        inputObj[input.name] = amount    
                        break;
                    case "date":
                        result[input.name] = new Date(input.value).toLocaleDateString("en-us",{timeZone: "UTC"})
                        break;
                    case "large-text":
                        inputObj["transaction-note"] = input.value ? input.value : ""
                        break;
                
                    default:
                        inputObj[input.name] = input.value
                    
                        break;
                }
            }

            result.data.push(inputObj)

            return result
        }
    }

    const ChangeCurrency = () => {
        setUSDMode((prevMode) => !prevMode)
    }

    const fetchData = async () => {
        try{
            const totalBalanceRequest = await fetchTotalBalance()
            setBalanceData(totalBalanceRequest.data)
            setTotalBalance(totalBalanceRequest.data["total-balance"])
            setIsLoading(false)
        }
        catch(error){
            console.log(error)
            return 0
        }
    }

    const fetchTotalBalance = () => {
        try{
            const serverRes = axios(serverURL["BALANCE_URL"])
            return serverRes
        }
        catch(error){
            console.log(error)
            return 0
        }
    }

    const StripCurrency  = (amount) => {
        return amount.replace(/[$VNDvnd,\s]/g, "")
    }




    return (
      <>
        <div id="add-transaction-container">
          <Header
            DisplayDarkMode={DisplayDarkMode}
            colorPalette={colorPalette}
            setMenuExpanded={setMenuExpanded}
          />

          <div id="form-wrapper" className="section-container">
            <ContainerTitle title={"add transactions"} />

            <div
              className="content-container"
              style={{ backgroundColor: colorPalette.containerBG }}
            >
              {isLoading ? (
                <div className="loading"> </div>
              ) : (
                <>
                  <div
                    id="currency-exchange"
                    className="currency-exchange"
                    onClick={ChangeCurrency}
                  >
                    <span>USD</span>
                    <div id="toggle-currency">
                      <div
                        id="toggle-btn"
                        style={{ backgroundColor: colorPalette.containerBG }}
                        ref={currencyToggleBtn}
                      ></div>
                    </div>
                    <span>VND</span>
                  </div>

                  <SubmitForm ref={{loadingScreen, submitForm}} setValidForm={setValidForm} AddOrRemoveValidInput={AddOrRemoveValidInput} inputArr={inputArr}/>
                </>
              )}
            </div>

            <button
              type="submit"
              id="add-transaction-btn"
              ref={submitBtn}
              onClick={SumbitBtnClickHandle}
            >
              submit
            </button>
          </div>
        </div>
      </>
    );
}

export default AddTransaction