import axios from "axios"
import { Fiat } from "../../types"

const URL = "https://pro-api.coinmarketcap.com/v1"

const mapping = {
  '£': "GBP",
  '$': "USD"
} //as ([Fiat]: string)

export default (req, res) => {
  const fiat = mapping[req.query.fiat || '£']
  axios.get(`${URL}/cryptocurrency/quotes/latest`, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
        },
        params: {
          id: req.query.id,
          convert: fiat
        }
  }).then(apiRes => {
    const data = apiRes.data.data
    Object.keys(data).forEach(key => {
      data[key] = data[key]["quote"][fiat]["price"]
    })
    res.status(200).json(data)
  }).catch(e => {
    console.error(e)
    res.status(500).json({
      msg: "An API error occurred!"
    })
  })
}
