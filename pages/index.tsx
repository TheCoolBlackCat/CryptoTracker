import Link from "next/link"
import { Component } from "react"
import Table from "../components/Table"
import { Currency } from "../types"
import {v4 as uuidV4} from "uuid"
import YAML from "yaml"
import fs from "fs"

type Props = {
  data: Currency[]
}

type State = {
  darkMode: boolean
}

export async function getStaticProps() {
  const file = fs.readFileSync("./data.yml").toString()
  const yaml = YAML.parse(file)

  const values = yaml.map(item => {
    const seed = {
      holding: item.holding,
      buy: item.buy,
    }
    
    return {
      ...seed,
      uuid: uuidV4(),
      token: item.token,
      api_id: Number(item.api),
    }
  })
  return {
    props: {
      data: values
    }
  }
}

export default class Home extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      darkMode: false
    }
    this.toggleDarkMode = this.toggleDarkMode.bind(this)
  }

  toggleDarkMode() {
    this.setState({darkMode: !this.state.darkMode})
  }

  render() {
    const {data} = this.props
    const {darkMode} = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col-11">
            <h1 className="display-1">CryptoTracker</h1>
          </div>
          <div className="col-1">
            <button className={`btn ${darkMode ? "btn-dark" : "btn-light"}`} onClick={this.toggleDarkMode}>
              <i className={`fas ${darkMode ? "fa-moon" : "fa-sun"}`}></i>
              <span className="visually-hidden"> (Toggle Dark Mode)</span>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Table
              darkMode={darkMode}
              columns={[
                "Token",
                "Holding",
                "Total Buy",
                "Price per token",
                "Value",
                "Profit/Loss",
                "ROI",
                "Predicted price/token",
                "Predicted Value"
            ]}
            rows={data} />
          </div>
        </div>
      </div>
    )
  }
}
