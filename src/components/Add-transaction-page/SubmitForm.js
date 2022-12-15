// Import React components
import Input from "./Input"
import CategoriesSelections from "./CategoriesSelections"

// Import React Hooks
import React from "react"

const SubmitForm = React.forwardRef((props,ref={}) => {
    const {loadingScreen, submitForm} = ref
    const {setValidForm, AddOrRemoveValidInput, inputArr} = props
     return (
       <>
         <form ref={submitForm}>
           <CategoriesSelections
             setValidForm={setValidForm}
             AddOrRemoveValidInput={AddOrRemoveValidInput}
           />
           {inputArr.map((input, index) => {
             return (
               <Input
                 type={input.type}
                 placeholder={input.placeholder}
                 name={input.name}
                 key={index}
                 setValidForm={setValidForm}
                 AddOrRemoveValidInput={AddOrRemoveValidInput}
               />
             );
           })}
         </form>
         <div className="loading" id="submit-loading" ref={loadingScreen}>
           {" "}
         </div>
       </>
     );
})

export default SubmitForm