import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { useEffect, useMemo, useRef } from "react"

const Header = (props) => {
    const {DisplayDarkMode, colorPalette, setMenuExpanded} = props

    let darkModeBtn = useMemo(()=><></>)

    useEffect(()=>{
        darkModeBtn = document.querySelector("#darkModeBtn")
        darkModeBtn.addEventListener("click",()=>{
            DisplayDarkMode()
        })
    },[])

    const ExpandMenu = () => {
        setMenuExpanded(true)
    }

    return <div id="header-container">
        <div className="header-btn-container">
            <FontAwesomeIcon id='ham-menu-btn' icon="bars" onMouseDown={ExpandMenu}/>
        </div>
        <div className="header-btn-container">
            <FontAwesomeIcon className="menu-btn" icon={[colorPalette.darkModeIcon,"sun"]} id="darkModeBtn"/>
            <FontAwesomeIcon className="menu-btn" icon={["far","bell"]} />
            <FontAwesomeIcon className="menu-btn" icon={["far","user"]} />
        </div>
    </div>
}

export default Header