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
    this.setDarkMode = this.setDarkMode.bind(this)
    this.toggleDarkMode = this.toggleDarkMode.bind(this)
  }

  componentDidMount() {
    // Check for system preference for dark mode
    const mediaQuery = '(prefers-color-scheme: dark)'
    const systemDarkMode = (
      window.matchMedia !== undefined &&
      window.matchMedia(mediaQuery).media === mediaQuery)
    const dmValue = window.localStorage.getItem("darkMode")
    const lsDarkMode = dmValue === "on"
    this.setState( // Local storage darkMode preference should override system
      {darkMode: dmValue !== null ? lsDarkMode : systemDarkMode}, this.setDarkMode)
  }

  setDarkMode() {
    const {darkMode} = this.state
    if (darkMode)
      window.document.body.classList.add("dark")
    else
      window.document.body.classList.remove("dark")
    window.localStorage.setItem('darkMode', darkMode ? "on" : "off")
  }

  toggleDarkMode() {
    this.setState({darkMode: !this.state.darkMode}, this.setDarkMode)
  }

  render() {
    const {data} = this.props
    const {darkMode} = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col-11">
            <h1 className={`display-1 ${darkMode ? "text-light" : "text-dark"}`}>CryptoTracker</h1>
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
                "Total Cost",
                "Price per token",
                "Value",
                "Profit/Loss",
                "ROI",
                "Predicted price",
                "Predicted value"
            ]}
            rows={data} />
          </div>
        </div>
      </div>
    )
  }
}
