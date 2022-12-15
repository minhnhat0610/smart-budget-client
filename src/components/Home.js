// Import React Modules
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

// Import components
import NavigatorContainer from "./Home-page/NavigatorContainer";
import Header from "./Home-page/Header";
import {BodyContextComponents} from "./Home-page/Context/bodyContext"
import { appContext } from "../App";

export const bodyContext = createContext()

const Home = (props) => {
    let {colorPalette, transactionsArr, DisplayDarkMode,setMenuExpanded} = useContext(appContext)
    
    const ScrollToTop = () => {
    window.scrollTo(0,0)
    }

    return <><Header
    DisplayDarkMode={DisplayDarkMode}
    colorPalette={colorPalette}
    setMenuExpanded={setMenuExpanded}
/>

<BodyContextComponents
    bodyContext={bodyContext}
    colorPalette={colorPalette}
    transactionsArr={transactionsArr}
/>


<div id="scroll-to-top" onMouseDown={ScrollToTop}>
<i className="fa-solid fa-chevron-up"></i>
</div></>;
    }

export default Home
