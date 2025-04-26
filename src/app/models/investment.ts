export interface Investment {
  id: number
  tickerSymbol: string
  name: string
  quantity: number
  price: number
  value: number
  change: number
  changePercentage: number
}

export interface InvestmentDTOPost {
  projectId: number
  tickerSymbol: string
  quantity: number
}

export interface InvestmentDTOPut {
  quantity: number
}
