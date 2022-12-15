import { useContext } from "react"
import { appContext } from "../../App"

const AppLoading = (props)=>{
    const {appName} = props
    const {colorPalette} = useContext(appContext)
    return  <div className="app-loading">
        <div className="app-name">{appName}</div>
        <div className="progress-bar" style={{backgroundColor: colorPalette.containerBG}}></div>
    </div>
}

export default AppLoading