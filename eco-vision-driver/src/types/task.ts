export type TaskStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED"

export interface TaskLocation {
  lat: number
  lng: number
  address: string
}

export interface Task {
  taskId: string
  location: TaskLocation
  wasteType: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  status: TaskStatus
  reportedAt: string
}
