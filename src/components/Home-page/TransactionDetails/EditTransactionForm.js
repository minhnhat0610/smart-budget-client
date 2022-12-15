// Import React components
import Input from "../../Add-transaction-page/Input";
import CategoriesSelections from "../../Add-transaction-page/CategoriesSelections";
import inputList from "../../../data/inputList";
import { transactionDetailsContext } from "./TransactionDetails";
import { appContext } from "../../../App";
import serverURL from "../../../data/serverURL";

// Import React Hooks
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const EditTransactionForm = (props) => {
    const {editMode,setEditMode, editTarget} = useContext(transactionDetailsContext)
    const {USDMode, CurrencyConverted, exchangeRate} = useContext(appContext)
    const loadingScreen = useRef()
    const submitForm = useRef()
    const submitBtn = useRef()
    const goBackBtn = useRef()
    const deleteTranBtn = useRef()

    const [validForm, setValidForm] = useState([])
    const inputArr = useMemo(()=>{
        return inputList
    },[inputList])


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

    const DisplaySubmitLoading = ()=>{
      loadingScreen.current.classList.toggle("display-loading")
      submitBtn.current.classList.toggle("disable-submit-btn")
  }


    const SumbitBtnClickHandle = async (e) => {
      e.preventDefault()
      if(validForm.length > 4){
        // Collect changes
        const inputValues = CollectInputValues(validForm)
        const changes = CollectChanges(inputValues)
        if(Object.keys(changes).length >0){
          try{
            // turn on loading 
            DisplaySubmitLoading()
            const updateTransactionRequest = await SendUpdateTransaction(editTarget["transactionID"],changes)
            if(updateTransactionRequest.status === 200){
              alert("Update Transaction Successfully!")
            }
          }
          catch(err){
            console.log(err)
            alert("SERVER ERROR! Please try again!")
          }
          finally{
            DisplaySubmitLoading()
            setEditMode(false)
          }
        }
        else alert("NO CHANGE HAS MADE!")
      }
      else{
        alert("Invalid Form! Please correct input field!")
      }
    }

    const goBackClickHandle = () => {

        //Expand edit panel
        setEditMode(false)
    }

    const deleteTransactionHandle = async () => {
      try{
        DisplaySubmitLoading()
        const deletetarget = editTarget["transactionID"]
        const deleteRequest = await SendDeleteTransaction(deletetarget).catch(err => {throw err})
        console.log(deleteRequest)
        if(deleteRequest.status === 200){
          alert("Transaction has been removed successfully!")
        }
        else{
          alert(`${deleteRequest.response.status} ERROR` + deleteRequest.response.data)
        }
      }
      catch(err){
        console.log(err)
        alert(`${err.response.status} ERROR` + err.response.data)

      }
      finally{
        DisplaySubmitLoading()
        setEditMode(false)
      }
    }

    const SendDeleteTransaction = (deletetarget)=>{
      try{
        const encodeParam = deletetarget.replaceAll("/","%2F")
        const url = serverURL["TRANSACTION_URL"] + encodeParam
        const serverRes = axios.delete(url)
        return serverRes
      }
      catch(err){
        console.log(err)
        return err
      }
    }

    const SendUpdateTransaction = (transactionDate, changes) => {
      try{
        const encodeParam = transactionDate.replaceAll("/","%2F")
        const url = serverURL.TRANSACTION_URL + encodeParam
        const serverRes = axios.post(url,changes,{'content-type': 'application/json'})
        return serverRes
      }
      catch(err){
        console.log(err)
        return err
      }
    }

    const CollectChanges = (inputValues) => {
      let changes = {}
      for(let key in inputValues){
        if(inputValues[key] != editTarget[key]){
          changes[key] = inputValues[key]
        }
      }

      return changes
    }

    const CollectInputValues = (inputArr) => {
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
                      inputObj[input.name] = new Date(input.value).toLocaleDateString("en-us",{timeZone: "UTC"})
                      break;
                  case "large-text":
                      inputObj["transaction-note"] = input.value ? input.value : ""
                      break;
              
                  default:
                      inputObj[input.name] = input.value
                  
                      break;
              }
          }

          return inputObj
      }
    }

    const StripCurrency  = (amount) => {
      return amount.replace(/[$VNDvnd,\s]/g, "")
  }

    useEffect(()=>{
      if(editTarget){
        const editPanel = document.getElementById("edit-transaction-container")

        for(let target in editTarget){
          const input = editPanel.querySelector(`*[name=\"${target}\"]`)
          if(input){
            switch (input.type) {
              case "date":
                let transactionDate = new Date(editTarget[target])
                const year = transactionDate.getFullYear()
                const month = (transactionDate.getMonth()+1).toString()
                const date = transactionDate.getDate().toString()
                transactionDate = `${year}-${month.padStart(2,"0")}-${date.padStart(2,"0")}`
                input.value = transactionDate
                break;

              case "tel":
                const amount = editTarget[target]
                const value = USDMode ? CurrencyConverted(amount.toFixed(2)) : CurrencyConverted((amount*exchangeRate).toFixed(2))
                input.value = value
                break
            
              default:
                input.value = editTarget[target]
                break;
            }

          }
        }

        // Add edit valid element
        setValidForm(Array.from(document.querySelectorAll(".input")))
      }
     
    },[editTarget])

    useEffect(()=>{
      if(Object.keys(editTarget).length>0){
        const editPanel = document.getElementById("edit-transaction-container")
        const amountInput = editPanel.querySelector(`*[type=\"tel\"]`)
        const amount = Number(StripCurrency(amountInput.value))

      amountInput.value = USDMode ? CurrencyConverted((amount/exchangeRate).toFixed(2)) : CurrencyConverted((amount*exchangeRate).toFixed(2))
      }
    },[USDMode])

    
    return <div>
    <div className="back-btn">
      <i ref={goBackBtn} className="fa-solid fa-arrow-left-long" onClick={goBackClickHandle}></i>
      <i ref={deleteTranBtn} className="fa-solid fa-trash-can delete-transaction-btn" onClick={deleteTransactionHandle}></i>
      </div>
        <form ref={submitForm}>
           <CategoriesSelections
             setValidForm={setValidForm}
             AddOrRemoveValidInput={AddOrRemoveValidInput}
           />
           {inputArr.map((input, index) => {
             return (
               <Input
                 type={input.type}
                 placeholder={input.placeholder}
                 name={input.name}
                 key={index}
                 setValidForm={setValidForm}
                 AddOrRemoveValidInput={AddOrRemoveValidInput}
               />
             );
           })}

            <button
              type="submit"
              id="add-transaction-btn"
              ref={submitBtn}
              onClick={SumbitBtnClickHandle}
            >
              complete
            </button>
         </form>
         <div className="loading" id="submit-loading" ref={loadingScreen}>
           {" "}
         </div>

    </div>
}

export default EditTransactionForm