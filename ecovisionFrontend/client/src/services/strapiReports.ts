// services/strapiReports.ts (instrumented)
import strapiClient from "@/services/strapiClient";

export async function fetchReportByDocumentId(documentId: string, populate = "*") {
  const q = encodeURIComponent(documentId);
  const url = `/reports?filters[documentId][$eq]=${q}${populate ? `&populate=${encodeURIComponent(populate)}` : ""}`;
  console.log("[strapiReports] GET url:", (strapiClient.defaults?.baseURL ?? "") + url);
  const res = await strapiClient.get(url);
  const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data ?? []);
  const item = list[0] ?? null;
  console.log("[strapiReports] fetchReportByDocumentId result raw:", item);
  return item;
}

export async function updateReportByDocumentId(documentId: string, payload: any) {
  console.log("[strapiReports] updateReportByDocumentId called", { documentId, payload });
  const item = await fetchReportByDocumentId(documentId, ""); // no populate
  if (!item) {
    console.error(`[strapiReports] No report found for documentId=${documentId}`);
    throw new Error(`Report not found for documentId=${documentId}`);
  }

  // normalize numeric id detection
  const numericId = Number(item.id ?? item._id ?? item._id?.toString?.());
  console.log("[strapiReports] resolved item.id/raw:", { idRaw: item.id ?? item._id, numericId });

  if (!numericId || Number.isNaN(numericId)) {
    console.error("[strapiReports] invalid numeric id resolved from documentId", { item });
    throw new Error("Invalid numeric id resolved for update");
  }

  const endpoint = `/reports/${numericId}`;
  const fullUrl = (strapiClient.defaults?.baseURL ?? "") + endpoint;
  console.log("[strapiReports] will PUT to:", fullUrl, "payload:", payload);

  try {
    const res = await strapiClient.put(endpoint, { data: payload });
    console.log("[strapiReports] PUT success:", res?.data ?? res);
    return res.data;
  } catch (err: any) {
    console.error("[strapiReports] PUT failed:", err);
    // rethrow so caller can show a message
    throw err;
  }
}
