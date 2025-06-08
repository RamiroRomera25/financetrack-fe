import {Category} from "./category";

export interface Transaction {
  id: number
  category: Category
  quantity: number
  createdDate: Date
  isActive: boolean;
}

export interface TransactionDTOPost {
  projectId: number
  categoryId: number
  quantity: number
}

export interface TransactionDTOPut {
  categoryId: number
  quantity: number
}
