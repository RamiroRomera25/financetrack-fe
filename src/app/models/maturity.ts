export interface Maturity {
  id: number
  quantity: number
  endDate: Date
  state: MaturityState
  createdDate: any
}

export interface MaturityDTOPost {
  projectId: number
  quantity: number
  endDate: Date
}

export interface MaturityDTOPut {
  quantity: number
  endDate: Date
  state: MaturityState
}

export enum MaturityState {
  SOLVED = "SOLVED",
  ON_WAIT = "ON_WAIT",
  NOTIFICATED = "NOTIFICATED",
  LATE = "LATE",
}
