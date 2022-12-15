// Import components
import { appContext } from "../../App"
import pieChartColors from "../../dark-mode-colors/pieChartColors"
import categoriesIcon from "../../dark-mode-colors/categoriesIcon"

// Import React hooks
import { useContext, useMemo, useRef } from "react"

const CategoriesSelections = (props) => {
    const {setValidForm, AddOrRemoveValidInput} = props
    const {colorPalette} = useContext(appContext)
    const selectionIcon = useRef()
    const selectHTMLDOM = useRef()

    const options = useMemo(()=>{
        const options = []
        for(let category in categoriesIcon){
            options.push(category)
        }
        return options
    },[categoriesIcon])

    const ChangeSelection = () => {
        selectionIcon.current.className = ""
        const errorIcon = selectHTMLDOM.current.nextElementSibling
        if(categoriesIcon[selectHTMLDOM.current.value]){
            selectionIcon.current.className = categoriesIcon[selectHTMLDOM.current.value]
            errorIcon.classList.remove("display-error-icon")

            setValidForm((prev)=>{
                return AddOrRemoveValidInput(prev, selectHTMLDOM.current, "add")
            })

        }
        else{
            errorIcon.classList.add("display-error-icon")
            setValidForm((prev)=>{
                return AddOrRemoveValidInput(prev, selectHTMLDOM.current, "remove")
            })
        }
    }

    return <div className="input-row">
        <label htmlFor="categories-selections">categories</label>
        <div className="input-and-error">
            <i className="" id="option-icon" ref={selectionIcon}></i>
            <select id="categories-selections" name="categories-selections" className="input" ref={selectHTMLDOM} onChange={ChangeSelection} onFocus={ChangeSelection} style={{color:colorPalette.primary_Font_Colors}}>
                <option>Select a categories</option>
                {
                    options.map((option,index)=>{
                        return <option key={index} style={{color:pieChartColors[index]}}> {option} </option>
                    })
                }
            </select>
            <i className="fa-solid fa-circle-exclamation error-icon"></i>
        </div>
    </div>
}

export default CategoriesSelections