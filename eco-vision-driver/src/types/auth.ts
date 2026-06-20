export interface AuthUser {
  name: string
  email: string
  role: "DRIVER"
  documentId: string
}

export interface LoginResponse {
  token: string
  email: string
  role: string
  documentId: string
  name: string
}
