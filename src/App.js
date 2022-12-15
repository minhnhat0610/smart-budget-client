//Import React Router
import {Route, Routes} from "react-router-dom"


// Import React Modules
import React, { createContext, createRef, useCallback, useEffect, useMemo, useState, lazy, Suspense } from "react";

// Import components
import NavigatorContainer from "./components/Home-page/NavigatorContainer";
import serverURL from "./data/serverURL";
import AppLoading from "./components/Loading/AppLoading";

// Import color palette for darkmode and lightmode
import {darkModeColors, lightModeColors} from "./dark-mode-colors/darkModeColors"

// Importing FontAwesome Icons
import {far, faMoneyBill1} from "@fortawesome/free-regular-svg-icons"
import {fas, faBars, faSun, faBell, faUser} from "@fortawesome/free-solid-svg-icons"
import {library, config} from "@fortawesome/fontawesome-svg-core"

// Import Axios
import axios from "axios"

config.autoReplaceSvg = false
library.add(far,fas, faBars, faSun, faBell, faUser, faMoneyBill1)

// Import Lazy components
const Home = lazy(()=> import("./components/Home"))
const AddTransaction = lazy(()=>import("./components/AddTransaction"))

export const appContext = createContext()

const App = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [colorPalette, setColorPalette] = useState(darkModeColors)
  let [exchangeRate, setExchangeRate] = useState(0)
  let [exchangeRecordDate, setExchangeRecordDate] = useState("")
  let [isLoading, setIsLoading] = useState(true)

  let [USDMode, setUSDMode] = useState(true)
  let [transactionsArr, setTransactionArr] = useState([])
  let [menuExpanded, setMenuExpanded] = useState(false)

  const bodyContainer = createRef()
  const appSection = createRef()
  const unfocusAppSection = createRef()
  
  let root = useMemo(()=><></>)
  
  useEffect(()=>{
    if(darkMode){
      setColorPalette(darkModeColors)
    }
    else{
      setColorPalette(lightModeColors)
    }
  },[darkMode])

  const DisplayDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode)
  }

  useEffect(()=>{
    root = document.querySelector(":root")
    fetchData()
    setIsLoading(false)
    },[])

  useEffect(()=>{
      if(!isLoading){
        ExpandMenu()
      }
  },[menuExpanded,isLoading])

  const CurrencyConverted = (amount) => {
    const converted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    if(USDMode){
        return "$" + converted

    }

    else{
        return converted + " VND"

    }
  }


  const fetchData = async () => {
    try{
      const transactionsDataRequest = await fetchTransactionsData();
      const exchangeRateRequest = await fetchExchangeRate()

      const exchangeRate = exchangeRateRequest.data.rates["VND"]
      const exchangeRecordDate = exchangeRateRequest.data.date

      setTransactionArr(transactionsDataRequest.data)

      setExchangeRate(exchangeRate.toFixed(2))
      setExchangeRecordDate(exchangeRecordDate)
    }
    catch(error){
      console.log(error)
    }
  }

  const fetchTransactionsData = () => {
    try{
      const serverRes = axios(serverURL["TRANSACTION_URL"])
      return serverRes
    }

    catch(error){
      return error
    }
  }

  const fetchExchangeRate = () => {
    try{
        const serverRes = axios.get(serverURL["EXCHANG_RATE_URL"])
        return serverRes
    }
    catch(err){
        return err
    }
}

  const ExpandMenu = () => {
    const navContainer = document.getElementById("navigator-section")
    const navLinks = document.querySelectorAll(".nav-link")
    
    if(menuExpanded){
        navContainer.classList.remove("close-menu")
        appSection.current.classList.add("blur-app-section")
        unfocusAppSection.current.style.display = "block"

        for(let nav of navLinks){
        const label = nav.querySelector(".nav-link-label")
        const icon = nav.querySelector("i")

        nav.classList.add("nav-link-expand")
        label.classList.add("show-label")
        icon.classList.add("uncenter-icon")

        }
    }
    else{
        navContainer.classList.add("close-menu")
        appSection.current.classList.remove("blur-app-section")
        unfocusAppSection.current.style.display = "none"

        for(let nav of navLinks){
        const label = nav.querySelector(".nav-link-label")
        const icon = nav.querySelector("i")

        nav.classList.remove("nav-link-expand")
        label.classList.remove("show-label")
        icon.classList.remove("uncenter-icon")

        }

    }
    }


    return (
      <appContext.Provider
        value={{
          colorPalette,
          transactionsArr,
          DisplayDarkMode,
          setMenuExpanded,
          menuExpanded,
          ExpandMenu,
          USDMode,
          setUSDMode,
          CurrencyConverted,
          exchangeRate,
          exchangeRecordDate,
        }}
      >
        <div
          id="body-container"
          ref={bodyContainer}
          style={{
            backgroundColor: colorPalette.bodyBG,
            color: colorPalette.primary_Font_Colors,
          }}
        >
          {isLoading ? (
            <AppLoading appName="smart budget" />
          ) : (
            <>
              <div
                id="navigator-section"
                onMouseEnter={() => {
                  setMenuExpanded(true);
                }}
                onMouseLeave={() => setMenuExpanded(false)}
              >
                <NavigatorContainer
                  colorPalette={colorPalette}
                  setMenuExpanded={setMenuExpanded}
                />
              </div>

              <div className="app-section" ref={appSection}>
                <Suspense fallback={<AppLoading appName="smart budget" />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/addtransactions"
                      element={<AddTransaction />}
                    />
                  </Routes>
                </Suspense>

                <div
                  className="unfocus-app-section"
                  ref={unfocusAppSection}
                  onMouseDown={() => {
                    setMenuExpanded(false);
                  }}
                ></div>
              </div>
            </>
          )}
        </div>
      </appContext.Provider>
    );
    

};

export default App;