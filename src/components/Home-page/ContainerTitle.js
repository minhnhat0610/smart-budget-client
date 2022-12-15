import { useRef } from "react"

const ContainerTitle = (props) => {
    const {title, filterOptions} = props
    const filterBtn = useRef()
    const activeFilter = useRef()

    const filterClick = () =>{
        activeFilter.current.classList.toggle("no-filter")
    }

    return <div className="title-container">
        {
            filterOptions ? 
            <><span>{title}</span>
            <i className="fa-solid fa-filter" ref={filterBtn} onClick={filterClick}>
                <span className="active-filter no-filter" ref={activeFilter}>2</span></i></>
            :
            <span>{title}</span>
        }
    </div>
}

export default ContainerTitle