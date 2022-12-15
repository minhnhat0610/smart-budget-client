//Import React Hooks
import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { elements } from "chart.js";
import { useContext, useMemo } from "react";

//Import Components
import { bodyContext } from "../../Home";
import { appContext } from "../../../App";
import pieChartColors from "../../../dark-mode-colors/pieChartColors";
import categoriesIcon from "../../../dark-mode-colors/categoriesIcon";

const Category = (props) => {
  const { categories, TotalAmount } = props;

  const { CurrencyConverted, USDMode} = useContext(bodyContext);
  const { exchangeRate, colorPalette} = useContext(appContext)

  const displayCategoryTotal = (amount) => {
    if (USDMode) {
      return CurrencyConverted(amount.toFixed(2));
    } else {
      return CurrencyConverted((amount * exchangeRate).toFixed(0));
    }
  };

  const getPercentage = (amount) => {
    return (amount/TotalAmount*100).toFixed(2)
  }

  let categoryBreakDown = useMemo(() => {
    let index = 0;
    let categoryArr = [];
    for (let category in categories) {
      if(categories[category] >= 0){
        let categoryElement = (
          <div className="category" key={index}>
            <div className="category-illustration">
              <div>
                <i
                  className={`${categoriesIcon[category]} category-icon`}
                  style={{ backgroundColor: pieChartColors[index] }}
                ></i>
              </div>
              <span className="category-label">{category}</span>
            </div>
            <div className="category-stats">
              <span className="category-total">
                {displayCategoryTotal(categories[category])}
              </span>
              <span className="category-percentage" style={{color: colorPalette.secondary_Font_Colors}}>{getPercentage(categories[category])} %</span>
            </div>
          </div>
        );
  
        categoryArr.push(categoryElement);
        index++;
      }
    }

    return categoryArr;
  }, [categories, USDMode]);

  return <div>
    {categoryBreakDown}
        
      <div className="category">
            <div className="category-illustration">
              <div>
                <i
                  className={`${categoriesIcon["Deposit"]} category-icon`}
                  style={{ backgroundColor: pieChartColors[pieChartColors.length-1] }}
                ></i>
              </div>
              <span className="category-label">deposit</span>
            </div>
            <div className="category-stats">
              <span className="category-total">
                {displayCategoryTotal(categories["Deposit"]*-1)}
              </span>
              <span className="category-percentage"></span>
            </div>
          </div>

  </div>;
};

export default Category;
