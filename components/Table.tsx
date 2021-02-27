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
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
      super(props)
      this.state = {
          prediction: 1,
          loaded: false
      }
      this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    const id = this.props.rows.map(row => row.api_id)
    const res = await axios.get("/api/price", {
        params: {id: id.join(',')}
    })
    console.log(res.data)
    this.setState({
        quotes: res.data,
        loaded: true
    })
  }

  handleChange(e) {
    this.setState({prediction: Number(e.currentTarget.value)})
  }

  render() {
    const {darkMode, columns, rows} = this.props
    const {prediction, loaded, quotes} = this.state
    const header = columns.map((column, i) => <th scope="col" key={i}>{column}</th>)
    const tableBody = rows.map(row => {
        if (loaded) {
            const price = quotes[row.api_id]
            const value = row.holding * price
            const profit = value - row.buy
            const ROI = (value / row.buy) * 100
            if (!price) return <tr></tr>
            return (
                <tr key={row.uuid}>
                    <td scope="row">{row.token}</td>
                    <td>{row.holding}</td>
                    <td>£{row.buy}</td>
                    <td>£{price.toFixed(4)}</td>
                    <td>£{(value).toFixed(4)}</td>
                    {profit > 0 ?
                        <td className="text-success">+{profit.toFixed(4)}</td>:
                        <td className="text-danger">{profit.toFixed(4)}</td>}
                    <td>{`${ROI.toFixed(4)}%`}</td>
                    <td>
                        <label htmlFor="predictionInput" className="visually-hidden"></label>
                        <input type="number" step="0.5" min="0" className="form-control form-control-sm" id="predictionInput" value={prediction.toFixed(2)} onChange={this.handleChange} />
                    </td>
                    <td>£{(prediction*row.holding).toFixed(4)}</td>
                </tr>
            )
        }
        const loader = (
            <div className="spinner-grow text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        )
        return (
            <tr key={row.uuid}>
                <td scope="row">{row.token}</td>
                <td>{row.holding}</td>
                <td>{row.buy}</td>
                <td>{loader}</td>
                <td>{loader}</td>
                <td>{loader}</td>
                <td>{loader}</td>
                <td>{loader}</td>
            </tr>
        )
    })
    return (
        <table className={`table table-hover ${darkMode ? "table-dark" : ""}`}>
            <thead>
                <tr>
                    {header}
                </tr>
            </thead>
            <tbody>
                {tableBody}
            </tbody>
        </table>
    )
  }
}