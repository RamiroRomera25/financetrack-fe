import {Transaction} from "./transaction";

export interface Category {
  id: number
  name: string
  color: string
  transactions: Transaction[]
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
