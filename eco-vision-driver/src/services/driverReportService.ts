import strapiClient from "./strapiClient";
import type { DriverReport } from "../types/driverReport";
import { ENV } from "@/config/env";


const resolveMediaUrl = (url: string) => {
  if (!url) return "";
  return url.startsWith("http")
    ? url
    : `${ENV.STRAPI_BASE_URL}${url}`;
};

export const fetchDriverReports = async (
  driverDocumentId: string
): Promise<DriverReport[]> => {
  const res = await strapiClient.get(
    `/reports?filters[driver][documentId][$eq]=${driverDocumentId}&populate=photo&sort=assignedAt:desc`
  );

  const raw = Array.isArray(res.data?.data) ? res.data.data : [];

  return raw.map((r: any) => ({
    id: r.id,
    documentId: r.documentId,
    title: r.title ?? "Untitled",
    description: r.description ?? "",
    wasteType: r.wasteType ?? "",
    location: r.location ?? "",
    reportstatus: r.reportstatus,
    assignedAt: r.assignedAt,
    photoUrls:
      
      r.photo?.map((p: any) => resolveMediaUrl(p.url)) ?? [],
  }));
};

export const fetchReportByDocumentId = async (documentId: string) => {
  const res = await strapiClient.get(
    `/reports?filters[documentId][$eq]=${documentId}&populate=photo`
  );

  const item = res.data?.data?.[0];
  if (!item) return null;

  return {
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    description: item.description,
    wasteType: item.wasteType,
    location: item.location,
    reportstatus: item.reportstatus,
    assignedAt: item.assignedAt,
    photoUrls:
      item.photo?.map((p: any) => resolveMediaUrl(p.url)) ?? [],
  };
};

