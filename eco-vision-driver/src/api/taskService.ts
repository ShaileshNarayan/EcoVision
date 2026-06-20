import apiClient from "./apiClient"
import type { Task } from "../types/task"

export const getDriverTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>("/driver/tasks")
  return response.data
}

export const getTaskDetails = async (taskId: string): Promise<Task> => {
  const response = await apiClient.get<Task>(`/driver/tasks/${taskId}`)
  return response.data
}
