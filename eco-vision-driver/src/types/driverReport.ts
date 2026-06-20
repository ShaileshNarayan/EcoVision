export type ReportStatus = "pending" | "assigned" | "resolved" | "closed";

export interface DriverReport {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  wasteType?: string;
  location?: string;
  reportstatus: ReportStatus;
  assignedAt?: string;
  photoUrls: string[];
}
