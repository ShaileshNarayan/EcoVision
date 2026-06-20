import strapiClient from "./strapiClient";

const STRAPI_URL = "http://localhost:1337/api/reports";
const STRAPI_UPLOAD_URL = "http://localhost:1337/api/upload";

export interface ReportData {
  title: string;
  description: string;
  wasteType: string;
  location: string;
  latitude?: number;
  longitude?: number;
  submittedBy?: string;
  emailId?: string;
}

export const submitReport = async (reportData: ReportData, imageFile: File | null) => {
  try {
    let imageId: number | null = null;

    // ✅ Step 1: Upload the image first (same as your original)
    if (imageFile) {
      const formData = new FormData();
      formData.append("files", imageFile, imageFile.name);

      const uploadResponse = await strapiClient.post(STRAPI_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: undefined },
      });

      if (uploadResponse.data && uploadResponse.data[0]) {
        imageId = uploadResponse.data[0].id;
      } else {
        throw new Error("Image upload failed");
      }
    }

    // ✅ Step 2: Create the report entry with submittedBy included
    const payload: any = {
      data: {
        title: reportData.title,
        description: reportData.description,
        wasteType: reportData.wasteType,
        location: reportData.location,
      },
    };

    // ✅ add submittedBy only if available
    if (reportData.submittedBy) {
      payload.data.submittedBy = reportData.submittedBy;
      payload.data.emailId = reportData.emailId;
    }

    // ✅ attach uploaded image if available
    if (imageId) {
      payload.data.photo = [imageId];
    }

    const response = await strapiClient.post(STRAPI_URL, payload, {
      headers: { "Content-Type": "application/json", Authorization:undefined},
    });

    console.log("✅ Report submitted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error submitting report:", error.response?.data.error || error.response?.data);
    throw error;
  }
};


