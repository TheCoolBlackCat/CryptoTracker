import axios from "axios"
import { Component } from "react"
import { Currency } from "../types"

type Props = {
  darkMode: boolean
  columns: string[]
  rows: Currency[]
}

type State = {
  prediction: number
  quotes?: object
  loaded: boolean
  errored: boolean
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
      super(props)
      this.state = {
          prediction: 1,
          loaded: false,
          errored: false
      }
      this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    const id = this.props.rows.map(row => row.api_id)
    axios.get("/api/price", {
        params: {id: id.join(',')}
    }).then(res => {
        this.setState({
            quotes: res.data,
            loaded: true
        })
    }).catch(e => {
        this.setState({errored: true})
        console.error(e)
    })
    
  }

  handleChange(e) {
    this.setState({prediction: Number(e.currentTarget.value)})
  }

  getData() {
    const {props, state} = this
    return props.rows.map(row => {
        const price = state.quotes ? state.quotes[row.api_id] : 0
        const value = row.holding * price
        return {
            ...row,
            price: price,
            value: value,
            profit: value - row.buy,
            ROI: ((value - row.buy) / row.buy) * 100
        }
    })
  }

  render() {
    const {darkMode, columns} = this.props
    const {prediction, loaded, errored} = this.state
    const loader = errored || (
        <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
    const header = columns.map((column, i) => <th scope="col" key={i}>{column}</th>)
    const tableData = this.getData()
    const tableBody = tableData.map(row => {
        const predictionInput = (
            <td>
                <label htmlFor="predictionInput" className="visually-hidden"></label>
                <input type="number" step="0.1" min="0" className={`form-control form-control-sm ${darkMode ? "dark" : ""}`} id="predictionInput" value={prediction.toFixed(2)} onChange={this.handleChange} />
            </td>
        )
        const predictionValue = <td>£{(prediction*row.holding).toFixed(4)}</td>
        if (loaded) {
            if (!row.price) return <tr></tr>
            return (
                <tr key={row.uuid}>
                    <td scope="row">{row.token}</td>
                    <td>{row.holding}</td>
                    <td>£{row.buy}</td>
                    <td>£{row.price.toFixed(4)}</td>
                    <td>£{(row.value).toFixed(4)}</td>
                    {row.profit > 0 ?
                        <td className="text-success">+{row.profit.toFixed(4)}</td>:
                        <td className="text-danger">{row.profit.toFixed(4)}</td>}
                    <td>{`${row.ROI.toFixed(4)}%`}</td>
                    {predictionInput}
                    {predictionValue}
                </tr>
            )
        }
        return (
            <tr key={row.uuid}>
                <td scope="row">{row.token}</td>
                <td>{row.holding}</td>
                <td>{row.buy}</td>
                {Array.from({length: 4}, () => <td>{loader}</td>)}
                {predictionInput}
                {predictionValue}
            </tr>
        )
    })

    const statsRow = Array.from({length: 9}, () => <td></td>)
    const totalProfit = tableData.reduce((total, row) => total + row.profit, 0)
    statsRow[2] = <th>{loaded ? `£${tableData.reduce((total, row) => total + row.buy, 0).toFixed(2)}` : loader}</th>
    statsRow[4] = <th>{loaded ? `£${tableData.reduce((total, row) => total + row.value, 0).toFixed(2)}` : loader}</th>
    statsRow[5] = <th className={`${totalProfit > 0 ? "text-success" : "text-danger"}`}>{loaded ? `£${totalProfit.toFixed(2)}` : loader}</th>

    return (
        <table className={`table table-hover ${darkMode ? "table-dark" : ""}`}>
            
            <thead>
                {!errored ||
                <tr>
                    <td colSpan={9} className="text-danger" style={{background: "transparent"}}>
                        <div className="alert alert-warning" role="alert">
                            <strong>An error occurred fetching price data, try refreshing?</strong>
                            <p>There could be a problem with the server, your internet connection or the API key.</p>
                        </div>
                    </td>
                </tr>}
                <tr>
                    {header}
                </tr>
            </thead>
            <tbody>
                {tableBody}
                <tr>
                    {statsRow}
                </tr>
            </tbody>
        </table>
    )
  }
}