import React, { Component } from "react";
import "./slider.css";
import loader from "./images/loader.svg";
import RecentItem from "./RecentItem";
import LoanDetailCard from "./LoanDetailCard";
class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 500,
      months: 6,
      recent: localStorage.getItem("recentArray")
        ? JSON.parse(localStorage.getItem("recentArray"))
        : [],
      loading: false,
      data: {},
    };
  }
  amountHandler = (event) => {
    this.setState({
      amount: parseInt(event.target.value),
    });
  };
  monthsHandler = (event) => {
    this.setState({
      months: parseInt(event.target.value),
    });
  };
  handleItems = () => {
    this.setState({
      loading: true,
    });
    if (localStorage.getItem("recentArray")) {
      if (JSON.parse(localStorage.getItem("recentArray")).length >= 10) {
        let arr = JSON.parse(localStorage.getItem("recentArray"));
        arr.shift();
        localStorage.setItem(
          "recentArray",
          JSON.stringify([
            ...arr,

            {
              amount: this.state.amount,
              months: this.state.months,
            },
          ])
        );
        this.setState({
          recent: JSON.parse(localStorage.getItem("recentArray")),
        });
      } else {
        localStorage.setItem(
          "recentArray",
          JSON.stringify([
            ...JSON.parse(localStorage.getItem("recentArray")),

            {
              amount: this.state.amount,
              months: this.state.months,
            },
          ])
        );
        this.setState({
          recent: JSON.parse(localStorage.getItem("recentArray")),
        });
      }
    } else {
      localStorage.setItem(
        "recentArray",
        JSON.stringify([
          {
            amount: this.state.amount,
            months: this.state.months,
          },
        ])
      );
      this.setState({
        recent: JSON.parse(localStorage.getItem("recentArray")),
      });
    }


    this.handleRequest(this.state.amount, this.state.months);
  };

  recentHandler = (event) => {
    this.setState({
      amount: JSON.parse(event.target.getAttribute("value")).amount,
      months: JSON.parse(event.target.getAttribute("value")).months,
      loading: true,
    });
    this.handleRequest(
      JSON.parse(event.target.getAttribute("value")).amount,
      JSON.parse(event.target.getAttribute("value")).months
    );
  };
  handleRequest = (amount, months) => {
    fetch(
      `https://ftl-frontend-test.herokuapp.com/interest?amount=${amount}&numMonths=${months}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          data: data,
        });
        setTimeout(() => {
          this.setState({
            loading: false,
          });
        }, 700);
      })
      .catch((err) => {
        console.log("Error :", err);
        this.setState({
          loading: false,
        });
        alert("something went wrong");
      });
  };
  render() {
    return (
      <div className="container">
        {this.state.loading ? (
          <div className="loader">
            <img src={loader} className="loader-img" alt="Loading....." />
          </div>
        ) : null}
        <div className="recent-items-slider">
          <p className="recent-slider-title">Recent Results</p>
          <div className="recent-items-container">
            {this.state.recent.reverse().map((element, index) => {
              return (
                <div onClick={this.recentHandler}>
                  <RecentItem
                    keyValue={index}
                    amount={element.amount}
                    months={element.months}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="amount-slider-cont">
          <div className="input-range-slider-wrap">
            <label htmlFor="amount">Amount : {this.state.amount}</label>
            <input
              type="range"
              name="amount"
              id="amount-slider"
              className="amount-slider"
              value={this.state.amount}
              onChange={this.amountHandler}
              min={500}
              max={5000}
              onMouseUp={this.handleItems}
              onTouchEnd={this.handleItems}
            />
          </div>
          <div className="input-range-slider-wrap">
            <label htmlFor="months">Months : {this.state.months}</label>

            <input
              type="range"
              name="months"
              id="amount-slider"
              className="amount-slider"
              value={this.state.months}
              onChange={this.monthsHandler}
              min={6}
              max={24}
              onMouseUp={this.handleItems}
              onTouchEnd={this.handleItems}
            />
          </div>
          {this.state.data.interestRate ? (
            <div className="loan-payment-details">
              <LoanDetailCard
                title="Interest Rate"
                value={this.state.data.interestRate}
                currency={" % "}
              />
              <LoanDetailCard
                title="Monthly Payment"
                value={this.state.data.monthlyPayment.amount}
                currency={this.state.data.monthlyPayment.currency}
              />{" "}
              <LoanDetailCard
                title=" Number of Payments"
                value={this.state.data.numPayments}
                // currency={this.state.data.monthlyPayment.currency}
              />{" "}
              <LoanDetailCard
                title="Principal"
                value={this.state.data.principal.amount}
                currency={this.state.data.principal.currency}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Slider;
