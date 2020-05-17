import React from 'react'
import "./recentItem.css"
export default function RecentItem(props) {
    return (
      <div
        className="recent-item"
        value={JSON.stringify({ amount: props.amount, months: props.months })}
      >
        <p className="item-loan-amount" >Amount : {props.amount}</p>
        <p className="item-months">Months : {props.months}</p>
      </div>
    );
}
