import axios from "axios"

const URL = "https://pro-api.coinmarketcap.com/v1"

export default (req, res) => {
  axios.get(`${URL}/cryptocurrency/quotes/latest`, {
        headers: {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY
        },
        params: {
          id: req.query.id,
          convert: "GBP"
        }
  }).then(apiRes => {
    const data = apiRes.data.data
    Object.keys(data).forEach(key => {
      data[key] = data[key]["quote"]["GBP"]["price"]
    })
    res.status(200).json(data)
  }).catch(e => {
    console.error(e)
    res.status(500).json({
      msg: "An API error occurred!"
    })
  })
}
