// Import Components
import navLinks from "../../data/navLinks";

// Import React Hooks
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavigatorContainer = (props) => {
    const {colorPalette, setMenuExpanded} = props
    const appTitle = "Smart Budget"

    const [navOptions, setNavOptions] = useState(navLinks)
    let navLinksDOM = []
    let focusBG = []

    useEffect(()=>{
        navLinksDOM = document.querySelectorAll(".nav-link")
        focusBG = document.querySelector("#focus-background")
        
        navLinksDOM[0].classList.add("focus-nav-link")

        RepositionFocusBG(navLinksDOM[0], focusBG)
        
    },[])

    const NavLinkHover = (e) => {
        navLinksDOM = document.querySelectorAll(".nav-link")
        focusBG = document.querySelector("#focus-background")

        for(let nav of navLinksDOM){
            nav.classList.remove("focus-nav-link")
        }

        e.currentTarget.classList.add("focus-nav-link")

        RepositionFocusBG(e.currentTarget, focusBG)

    }

    const RepositionFocusBG = (nav, focusBG) => {
        let focusBGChild = focusBG.children
        //Change focus bg height
        focusBGChild[0].style.height = nav.offsetHeight + "px";

        const topPos = nav.offsetTop
        focusBG.style.top = topPos + "px"

    }

    const CloseMenu = () => {
        setMenuExpanded(false)
    }

    const navLinkHandleClick = (e) => {
        const anchor = e.currentTarget.getAttribute("data-href")
        const element = document.getElementById(anchor)
        
        if(element){
            window.scrollTo({
                top: element.offsetTop,
                behavior: "smooth"
            })
    
            setMenuExpanded(false)
    
        }
    }



    return <div id="navigator-container" className="section-container" style={{backgroundColor: colorPalette.containerBG}}>
        <div className="title-container" id="app-title">
            <span>{appTitle}</span>
            <i className="fa-solid fa-chevron-left" id="mobile-menu-close-btn" onMouseDown={CloseMenu} style={{backgroundColor: colorPalette.bodyBG}}></i>
        </div>

        <div className="nav-link-container">
            <div id="focus-background">
                <div></div>
            </div>
            {
                navOptions.map((option, index) => {
                    return <div className="nav-link" key={index} onMouseEnter={NavLinkHover}>
                        {
                            option.type === "anchor" ?   
                            <Link data-href={option.anchor} style={{color: colorPalette["primary_Font_Colors"]}} onMouseDown={navLinkHandleClick}>
                            <i className={option.icon + " nav-link-icon"}></i>
                            <span className="nav-link-label">{option.label}</span>
                            </Link>

                            :

                            <Link to={option.anchor} style={{color: colorPalette["primary_Font_Colors"]}} >
                                <i className={option.icon + " nav-link-icon"}></i>
                                <span className="nav-link-label">{option.label}</span>
                            </Link>
                        }
                    </div>
                })
            }

            <div id="log-out" className="nav-link">
                <a href="" style={{color: colorPalette["primary_Font_Colors"]}}>
                    <i className="fa-solid fa-arrow-right-from-bracket nav-link-icon"></i>
                    <span className="nav-link-label">logout</span>
                </a>
            </div>
            
        </div>
    </div>

}

export default NavigatorContainer

