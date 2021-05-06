type Token = "BTC" | "ETH" | "ZIL"
type Fiat = '£' | '$'

type Currency = {
    uuid: string
    token: Token
    api_id: number
    holding: number
    buy: number
    price?: number
    value: number
    profit: number
    ROI: number
}

export type {Token, Currency, Fiat}