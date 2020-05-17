import React from 'react'

export default function LoanDetailCard(props) {
    return (
      <div className="interest-rate">
        <p>
    <span>{props.title}</span>
    <span>{props.value} {" "}{props.currency} </span>
        </p>
      </div>
    );
}
