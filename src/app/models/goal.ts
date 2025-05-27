export interface Goal {
  id: number
  objective: string
  endDate: Date
  quantity: number
  notes: string
  createdDate: any
}

export interface GoalDTOPost {
  objective: string
  endDate: Date
  quantity: number
  projectId: number
  notes: string
}

export interface GoalDTOPut {
  objective: string
  endDate: Date
  quantity: number
  notes: string
}
