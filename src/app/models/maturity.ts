export interface Maturity {
  id: number
  quantity: number
  endDate: Date
  state: string
}

export interface MaturityDTOPost {
  projectId: number
  quantity: number
  endDate: Date
}

export interface MaturityDTOPut {
  quantity: number
  endDate: Date
  state: string
}
