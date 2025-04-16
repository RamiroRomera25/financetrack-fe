export interface Investment {
  id: number
  tickerSymbol: string
  quantity: number
}

export interface InvestmentDTOPost {
  projectId: number
  tickerSymbol: string
  quantity: number
}

export interface InvestmentDTOPut {
  tickerSymbol: string
  quantity: number
}
