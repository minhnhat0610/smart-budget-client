// Import components
import { appContext } from "../../App"

// Import React hooks
import { useContext, useEffect } from "react"
const Input = (props) => {

    const {type, placeholder,name, setValidForm, AddOrRemoveValidInput} = props
    const {colorPalette, USDMode, exchangeRate} = useContext(appContext)

    useEffect(()=>{
        const AmountInputDOM = document.querySelector(".input-and-error input[type=\"tel\"]")
        const value =  Number(StripCurrency(AmountInputDOM.value))
        AmountInputDOM.value = CurrencyConverted((value).toFixed(2))
    },[USDMode])

    const validateEmpty = (value) => {
        return value ? true : false
    }

    const validateDate = (value) => {
        let dateConverted 
        if(validateEmpty(value)){
            dateConverted = new Date(value)
            return dateConverted.getTime() ? true : false
        }

        return false
    }

    const validateAmount = (value) =>{
        let testResult = false
        if(validateEmpty(value)){
            const amountRegex = /^(\$|VND)?\s?[+-]?(\d{0,2})+((,\d{3})*|\d+)+\.?(\d{0,2})?$/
            testResult = amountRegex.test(value)
        }

        return testResult
    }

    const TestInput = (testFunc, element, errorIcon) => {
        const testResult = testFunc(element.value)
        if(!testResult){
            if(errorIcon){
                errorIcon.classList.add("display-error-icon")
                setValidForm((prev)=>{
                    return AddOrRemoveValidInput(prev,element, "remove")
                })
            }
            else{
                setValidForm((prev)=>{
                    return AddOrRemoveValidInput(prev,element, "remove")
                })

            }

        }
        
        else{
            if(errorIcon){
                errorIcon.classList.remove("display-error-icon")
                setValidForm((prev)=>{
                    return AddOrRemoveValidInput(prev,element, "add")
                })
            }
            else{
                setValidForm((prev)=>{
                    return AddOrRemoveValidInput(prev,element, "add")
                })

            }
            

        }

    }


    const validateInput = (e) => {
        const current = e.currentTarget
        const currentType = current.getAttribute("type") 
        const errorIcon = current.nextElementSibling ? current.nextElementSibling : null
        switch (currentType) {
            case "text":
                TestInput(validateEmpty, current, errorIcon)
                break;
            
            case "date":
                TestInput(validateDate, current, errorIcon)

                break;

            case "tel":
                TestInput(validateAmount, current, errorIcon)
                DisplayCurrenyOutput(current)
                break;

            case "large-text":
                TestInput((value)=>true, current, errorIcon)
                break;
        
            default:
                break;
        }

    }

    const CurrencyConverted = (amount) => {
        const converted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        if(USDMode){
            return "$" + converted
    
        }
    
        else{
            return "VND " + converted 
    
        }
      }
    

    const StripCurrency  = (amount) => {
        return amount.replace(/[$VNDvnd,\s]/g, "")
    }

    const DisplayCurrenyOutput = (element) => {
        let value = StripCurrency(element.value)
        const convertResult = CurrencyConverted(value)
        element.value = convertResult
    }

    const focusInput = (e) => {
        const current = e.currentTarget
        current.select()
    }

    return <div className="input-row">
        <label htmlFor={name}>{placeholder}</label>
        {
            type != "large-text" ?
                <div className="input-and-error">
                <input className="input" type={type} id={name} name={name} style={{color: colorPalette.primary_Font_Colors}} required onChange={validateInput} onFocus={focusInput}/>
                <i className="fa-solid fa-circle-exclamation error-icon"></i>
                </div>

            :

            <div className="input-and-error">
            <textarea className="input" type={type} id={name} name={name} style={{color: colorPalette.primary_Font_Colors}} required onChange={validateInput} onFocus={validateInput}></textarea>
            </div>
        }
    </div>
}

export default Input