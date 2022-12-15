// Import React Hooks
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"

// Import components
import ContainerTitle from "../ContainerTitle"
import TransactionGroup from "./TransactionGroup"
import { appContext } from "../../../App"
import EditTransactionForm from "./EditTransactionForm"

export const transactionDetailsContext = createContext()

const TransactionDetails = (props) => {
    const {colorPalette} = props
    const {transactionsArr} = useContext(appContext)

    const editForm = useRef()
    const contentContainer = useRef()
    const unfocusBG = useRef()
    const loadingScreen = useRef()

    let [editMode, setEditMode] = useState(false)
    let [editTarget, setEditTarget] = useState({})

    useEffect(()=>{
        editForm.current.classList.toggle('hide-edit-panel')
        contentContainer.current.classList.toggle("edit-mode")
        unfocusBG.current.classList.toggle("show-unfocus")
    },[editMode])

    const transactions = useMemo(()=>{
        let result = []
        if(transactionsArr.length >= 0){
            transactionsArr.forEach((transactionSet,index) => {
                let transactionData = transactionSet.data
                let transactionDate = transactionSet["transaction-date"]
                
                let transactionGroup = <TransactionGroup key={index} transactionData={transactionData} transactionDate={transactionDate}/>
                result.push(transactionGroup)
            });

            return result
        }
        else return result
    },[transactionsArr])

    return <transactionDetailsContext.Provider value={{setEditMode, editTarget, setEditTarget}}>
        <div id="transaction-details-container" className="section-container">
        <ContainerTitle  title="recent history" filterOptions={true}/>
        
       <div className="content-container" >
            <div id="edit-panel-background" ref={editForm}>
                <div id="edit-transaction-container"  style={{backgroundColor: colorPalette.containerBG}}>
                        <EditTransactionForm />
                        
                </div>
            </div>

            <div className="transaction-content" ref={contentContainer} style={{backgroundColor: colorPalette.containerBG}}>
                <div>
                    {transactions}
                    <div ref={unfocusBG} id="unfocus-background"></div>

                </div>
            </div>
       </div>
    </div>
    </transactionDetailsContext.Provider>
}

export default TransactionDetails