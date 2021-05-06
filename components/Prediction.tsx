import { useState } from "react"
import useInputState from "../hooks/useInputState"


type Props = {
    darkMode: boolean
    fiat: string
    price: number
    holding: number
}


export default function Prediction(props: Props) {
    const {darkMode, fiat, price, holding} = props
    const initialPrediction = price * 1.25
    const [prediction, setPrediction] = useState(initialPrediction)
    const [input, setInput] = useInputState(initialPrediction.toFixed(2), () => setPrediction(Number(input)))
    return (
        <>
            <td>
                <label htmlFor="predictionInput" className="visually-hidden"></label>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    className={`form-control form-control-sm ${darkMode ? "dark" : ""}`}
                    id="predictionInput"
                    value={prediction.toFixed(2)}
                    onChange={e => setInput(e)} />
            </td>
            <td>{fiat}{(prediction*holding).toFixed(4)}</td>
        </>
    )
}