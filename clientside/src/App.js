import React, { Fragment } from "react"
import "./App.css"

import ListCustomers from "./components/ListCustomers";

function App() {
  return (
    <Fragment>
      <div className="container">
        <ListCustomers />
      </div>
    </Fragment>
  )
}

export default App