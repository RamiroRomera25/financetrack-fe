export interface Goal {
  id: number
  objective: string
  endDate: Date
  quantity: number
}

export interface GoalDTOPost {
  objective: string
  endDate: Date
  quantity: number
  projectId: number
}

export interface GoalDTOPut {
  objective: string
  endDate: Date
  quantity: number
}
