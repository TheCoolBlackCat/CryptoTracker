import axios from "axios"
import { Component } from "react"
import { Currency, Fiat } from "../types"
import Prediction from "./Prediction"

type Props = {
  fiat: Fiat
  darkMode: boolean
  columns: string[]
  rows: Currency[]
}

type State = {
  quotes?: object
  error: boolean
}

export default class Home extends Component<Props, State> {
  static defaultProps = {
      fiat: '£'
  } as Props

  constructor(props: Props) {
      super(props)
      this.state = {
          error: false
      }
  }

  async componentDidMount() {
    const {rows, fiat} = this.props
    const id = rows.map(row => row.api_id).join(',')
    axios.get("/api/price", {
        params: {id, fiat}
    }).then(res => {
        this.setState({
            quotes: res.data
        })
    }).catch(e => {
        this.setState({error: true})
        console.error(e)
    })
    
  }

  getData() {
    const {props, state} = this
    return [!!state.quotes, props.rows.map(row => {
        const price = state.quotes ? state.quotes[row.api_id] : 0
        const value = row.holding * price
        return {
            ...row,
            price: price,
            value: value,
            profit: value - row.buy,
            ROI: ((value - row.buy) / row.buy) * 100
        }
    })]
  }

  render() {
    const {darkMode, fiat, columns} = this.props
    const {error} = this.state
    const loader = error || (
        <div className="spinner-grow text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
    const sign = (x: string | number) => `${fiat}${x.toString()}`
    const header = columns.map((column, i) => <th scope="col" key={i}>{column}</th>)
    const [loaded, tableData] = this.getData()
    const tableBody = tableData.map(row => {
        if (loaded) {
            if (!row.price) return <tr></tr>
            return (
                <tr key={row.uuid}>
                    <td scope="row">{row.token}</td>
                    <td>{row.holding}</td>
                    <td>{sign(row.buy)}</td>
                    <td>{sign(row.price.toFixed(4))}</td>
                    <td>{sign(row.value.toFixed(4))}</td>
                    {row.profit > 0 ?
                        <td className="text-success">+{row.profit.toFixed(4)}</td>:
                        <td className="text-danger">{row.profit.toFixed(4)}</td>}
                    <td>{`${row.ROI.toFixed(4)}%`}</td>
                    <Prediction {...{...row, darkMode, fiat}} />
                </tr>
            )
        }
        return (
            <tr key={row.uuid}>
                <td scope="row">{row.token}</td>
                <td>{row.holding}</td>
                <td>{row.buy}</td>
                {Array.from({length: 6}, () => <td>{loader}</td>)}
            </tr>
        )
    })

    const statsRow = Array.from({length: 9}, () => <td></td>)
    const totalProfit = tableData.reduce((total, row) => total + row.profit, 0)
    statsRow[2] = <th>{loaded ? sign(`${tableData.reduce((total, row) => total + row.buy, 0).toFixed(2)}`) : loader}</th>
    statsRow[4] = <th>{loaded ? sign(`${tableData.reduce((total, row) => total + row.value, 0).toFixed(2)}`) : loader}</th>
    statsRow[5] = <th className={`${totalProfit > 0 ? "text-success" : "text-danger"}`}>{loaded ? sign(`${totalProfit.toFixed(2)}`) : loader}</th>

    return (
        <table className={`table table-hover ${darkMode ? "table-dark" : ""}`}>
            
            <thead>
                {!error ||
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