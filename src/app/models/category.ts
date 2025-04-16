export interface Category {
  id: number
  name: string
  color: string
  transactionCount?: number
}

export interface CategoryDTOPost {
  name: string
  color: string
  projectId: number
}

export interface CategoryDTOPut {
  name: string
  color: string
}
