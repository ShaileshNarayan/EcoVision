import strapiClient from "./strapiClient";

/**
 * Admin service for talking to Strapi reports collection.
 * - Treats reportstatus === null as "pending"
 * - Populates photo, submittedBy, driver
 * - Provides getReportCounts() and getReports(page,pageSize,status)
 */

// Base API endpoint for Strapi reports
const API_BASE = "http://localhost:1337/api";
const API_REPORTS = `${API_BASE}/reports`;

/** Safe GET wrapper (returns parsed response or null) */
async function safeGet(url: string) {
  try {
    const res = await strapiClient.get(url, {
      // admin calls are public for now — leave headers alone
      headers: { "Content-Type": "application/json" },
    });
    return res;
  } catch (err: any) {
    console.error("[adminService] safeGet error:", err?.response?.data || err?.message || err);
    return null;
  }
}

/** Map a Strapi item to a consistent client report shape */
function mapItemToReport(item: any) {
  // Strapi v4: item = { id, attributes: { ... } }
  const id = item.id ?? item?.attributes?.id ?? null;
  const attr = item.attributes ?? item;

  // photo may be an array (as in your Strapi setup). we take first available.
  const photoItem = (attr.photo && Array.isArray(attr.photo) && attr.photo[0]) || null;
  const imageUrl = photoItem ? `http://localhost:1337${photoItem.url}` : null;

  // submittedBy could be a plain string field or relation depending on your Strapi model.
  const submittedBy = attr.submittedBy ?? (attr.submittedBy?.data?.attributes?.name ?? null) ?? null;

  // driver relation (if present in attributes)
  const driver = attr.driver ?? null; // keep raw driver data for admin UI to present if needed

  // normalize status: null -> 'pending' (client-side)
  const rawStatus = attr.reportstatus ?? null;
  const status = rawStatus === null ? "pending" : String(rawStatus).toLowerCase();

  return {
    id: String(id),
    documentId: attr.documentId ?? attr.document_id ?? null,
    title: attr.title ?? "",
    description: attr.description ?? "",
    wasteType: attr.wasteType ?? attr.waste_type ?? "",
    status,
    location: attr.location ?? "",
    createdAt: attr.createdAt ? new Date(attr.createdAt).toISOString() : null,
    imageUrl,
    submittedBy,
    driver, // admin UI can parse driver fields from this
    raw: attr, // keep raw attrs if you need more fields
  };
}

/**
 * Get report counts for dashboard.
 * - total: all reports
 * - pending: count(reportstatus IS NULL) + count(reportstatus == 'pending')
 * - assigned: count(reportstatus == 'assigned')
 * - resolved: count(reportstatus == 'resolved')
 */
export async function getReportCounts() {
  try {
    // pagination[pageSize]=1 used to get meta.pagination.total cheaply
    const totalUrl = `${API_REPORTS}?pagination[pageSize]=1`;
    const pendingNullUrl = `${API_REPORTS}?pagination[pageSize]=1&filters[reportstatus][$null]=true`;
    const pendingEqUrl = `${API_REPORTS}?pagination[pageSize]=1&filters[reportstatus][$eq]=pending`;
    const assignedUrl = `${API_REPORTS}?pagination[pageSize]=1&filters[reportstatus][$eq]=assigned`;
    const resolvedUrl = `${API_REPORTS}?pagination[pageSize]=1&filters[reportstatus][$eq]=resolved`;

    const [rTotal, rPendingNull, rPendingEq, rAssigned, rResolved] = await Promise.all([
      safeGet(totalUrl),
      safeGet(pendingNullUrl),
      safeGet(pendingEqUrl),
      safeGet(assignedUrl),
      safeGet(resolvedUrl),
    ]);

    const total = rTotal?.data?.meta?.pagination?.total ?? 0;
    const pendingNull = rPendingNull?.data?.meta?.pagination?.total ?? 0;
    const pendingEq = rPendingEq?.data?.meta?.pagination?.total ?? 0;
    const assigned = rAssigned?.data?.meta?.pagination?.total ?? 0;
    const resolved = rResolved?.data?.meta?.pagination?.total ?? 0;

    const pending = (pendingNull ?? 0) + (pendingEq ?? 0);

    return {
      total: Number(total ?? 0),
      pending: Number(pending ?? 0),
      assigned: Number(assigned ?? 0),
      resolved: Number(resolved ?? 0),
    };
  } catch (err) {
    console.error("[adminService] getReportCounts error:", err);
    return { total: 0, pending: 0, assigned: 0, resolved: 0 };
  }
}

/**
 * Fetch the most recent reports (paginated by pageSize)
 */
export async function getRecentReports(limit = 3) {
  const url = `${API_REPORTS}?sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=${limit}&populate=photo`;
  const res = await safeGet(url);
  const items = res?.data?.data ?? [];
  return items.map(mapItemToReport);
}

/**
 * Fetch paginated reports.
 * - page, pageSize
 * - status:
 *    - undefined/null => all
 *    - "all" => all
 *    - "pending" => {reportstatus IS NULL} U {reportstatus == 'pending'} (merged)
 *    - other => equality filter (e.g. assigned, resolved)
 */
export async function getReports(page = 1, pageSize = 10, status?: string) {
  try {
    const sort = "sort=createdAt:desc";
    const populate = "populate=photo,submittedBy,driver";

    // Helper to build base URL
    const base = (extraQuery = "") =>
      `${API_REPORTS}?${sort}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&${populate}${extraQuery}`;

    // no filter - return all
    if (!status || status === "all") {
      const url = base("");
      const res = await safeGet(url);
      const items = res?.data?.data ?? [];
      const reports = items.map(mapItemToReport);
      const meta = res?.data?.meta?.pagination ?? {};
      return { reports, meta };
    }

    const s = status.toLowerCase();

    // pending => need to merge null-status and explicit 'pending'
    if (s === "pending") {
      const urlNull = base("&filters[reportstatus][$null]=true");
      const urlEq = base("&filters[reportstatus][$eq]=pending");

      const [rNull, rEq] = await Promise.all([safeGet(urlNull), safeGet(urlEq)]);
      const itemsNull = rNull?.data?.data ?? [];
      const itemsEq = rEq?.data?.data ?? [];

      // merge unique by id preserving order (null first then eq)
      const map = new Map<string, any>();
      for (const it of [...itemsNull, ...itemsEq]) {
        const key = String(it.id);
        if (!map.has(key)) map.set(key, it);
      }
      const merged = Array.from(map.values());
      const reports = merged.map(mapItemToReport);

      // Combine pagination totals
      const totalNull = rNull?.data?.meta?.pagination?.total ?? 0;
      const totalEq = rEq?.data?.meta?.pagination?.total ?? 0;
      const total = totalNull + totalEq;
      const meta = {
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
        total,
      };
      return { reports, meta };
    }

    // other statuses (assigned/resolved/closed etc.)
    const url = base(`&filters[reportstatus][$eq]=${encodeURIComponent(s)}`);
    const res = await safeGet(url);
    const items = res?.data?.data ?? [];
    const reports = items.map(mapItemToReport);
    const meta = res?.data?.meta?.pagination ?? {};
    return { reports, meta };
  } catch (err) {
    console.error("[adminService] getReports error:", err);
    return { reports: [], meta: {} };
  }
}

export async function fetchAllReportsAdmin() {
  const response = await strapiClient.get(
    `${API_REPORTS}?populate=photo&sort=createdAt:desc`,
    {
      // you said public role is allowed, so no auth header needed
      headers: { "Content-Type": "application/json" },
    }
  );

  // Strapi v4 shape: { data: [...], meta: { ... } }
  return response.data.data.map((item: any) => ({
    id: item.id,
    ...item, // we read fields directly in Dashboard (attr = item)
    ...(item.attributes || {}), // if your collection is still in attributes, this keeps it compatible
  }));
}

/** (optional) fetch single report by id or documentId */
export async function getReportById(idOrDocumentId: string) {
  try {
    // try by numeric id first — Strapi supports /api/reports/:id
    const byIdUrl = `${API_REPORTS}/${idOrDocumentId}?populate=photo,submittedBy,driver`;
    const resById = await safeGet(byIdUrl);
    if (resById && resById.data && (resById.data.data || resById.data)) {
      // Strapi returns data wrapper
      const dataNode = resById.data.data ?? resById.data;
      return mapItemToReport(dataNode);
    }

    // fallback: query by documentId field
    const queryUrl = `${API_REPORTS}?filters[documentId][$eq]=${encodeURIComponent(idOrDocumentId)}&populate=photo,submittedBy,driver`;
    const res = await safeGet(queryUrl);
    const items = res?.data?.data ?? [];
    if (items.length > 0) return mapItemToReport(items[0]);
    return null;
  } catch (err) {
    console.error("[adminService] getReportById error:", err);
    return null;
  }
}
