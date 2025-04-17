export interface Reminder {
  id: number
  reminderDate: Date
  subject: string
  description?: string
  isRecurring?: boolean
  frequency?: string
  endDate?: Date
  priority: string
  createdDate?: string
  lastModifiedDate?: string
  isActive?: boolean
}

export interface ReminderDTOPost {
  reminderDate: Date
  subject: string
  description?: string
  isRecurring?: boolean
  frequency?: string
  endDate?: Date
  priority: string
  projectId: number
}

export interface ReminderDTOPut {
  reminderDate: Date
  subject: string
  description?: string
  isRecurring?: boolean
  frequency?: string
  endDate?: Date
  priority: string
}
