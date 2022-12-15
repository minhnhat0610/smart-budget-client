import { createContext, useContext, useEffect, useState} from "react"

// Import Components
import TotalBalance from "../TotalBalance/TotalBalance";
import TransactionSummary from "../TransactionsSummary/TransactionSummary";
import TransactionChart from "../TransactionChart/TransactionChart";
import TransactionDetails from "../TransactionDetails/TransactionDetails";
import { appContext } from "../../../App";
import { bodyContext } from "../../Home";

const BodyContextComponents = (props) => {
    let {colorPalette, transactionsArr} = useContext(appContext)
    const {USDMode, setUSDMode, CurrencyConverted} = useContext(appContext)



    return <bodyContext.Provider value={{USDMode,setUSDMode, CurrencyConverted}}>
    <div className="summary-section">
      <TotalBalance colorPalette={colorPalette}/>
      <TransactionSummary colorPalette={colorPalette} transactionsArr={transactionsArr}/>

    </div>

    <div className="analytic-section">
      <TransactionChart colorPalette={colorPalette}/>
      <TransactionDetails colorPalette={colorPalette}/>

    </div>
  </bodyContext.Provider>
}

export {BodyContextComponents}