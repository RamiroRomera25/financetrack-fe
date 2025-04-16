export interface Transaction {
  id: number
  categoryId: number
  quantity: number
}

export interface TransactionDTOPost {
  categoryId: number
  quantity: number
}

export interface TransactionDTOPut {
  categoryId: number
  quantity: number
}
