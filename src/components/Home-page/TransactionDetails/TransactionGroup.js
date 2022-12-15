// Import Components
import SingleTransaction from "./SingleTransaction"

const TransactionGroup = (props) => {
    const {transactionData, transactionDate} = props

    return <div className="transaction-group">
        <div className="transaction-date">{transactionDate}</div>
        <div className="transactions-container">
            {
                transactionData.map((single, index)=>{
                    single["transaction-date"] = transactionDate
                    return <SingleTransaction key={index} single={single}/>
                })
            }
            
        </div>
</div>
}

export default TransactionGroup