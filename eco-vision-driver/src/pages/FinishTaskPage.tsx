// import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import strapiClient from "../services/strapiClient";
// import { getCurrentLocation } from "../utils/geolocation";
// import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
// import Header from "@/components/Header";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function FinishTaskPage() {
//   const { documentId } = useParams();
//   const navigate = useNavigate();

//   const [file, setFile] = useState<File | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const capturePhoto = async () => {
//     try {
//       const photo = await Camera.getPhoto({
//         quality: 80,
//         allowEditing: false,
//         resultType: CameraResultType.Uri,
//         source: CameraSource.Camera, // 🚨 forces camera only
//       });

//       if (!photo.webPath) {
//         throw new Error("No photo captured");
//       }

//       const response = await fetch(photo.webPath);
//       const blob = await response.blob();

//       const capturedFile = new File([blob], "proof.jpg", {
//         type: blob.type,
//       });

//       setFile(capturedFile);
//     } catch (err) {
//       console.error("Camera error:", err);
//       setError("Failed to open camera.");
//     }
//   };

//   const handleSubmit = async () => {
//     if (!file || !documentId) {
//       setError("Please capture proof before submitting.");
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     try {
//       // 1️⃣ Get GPS
//       const position = await getCurrentLocation();
//       const { latitude, longitude } = position.coords;

//       // 2️⃣ Upload media
//       const formData = new FormData();
//       formData.append("files", file);

//       const uploadRes = await strapiClient.post("/upload", formData);
//       const uploadedMediaId = uploadRes.data?.[0]?.id;

//       if (!uploadedMediaId) {
//         throw new Error("Media upload failed");
//       }

//       // 3️⃣ Update report
//       await strapiClient.post("/reports/update-by-documentId", {
//         documentId,
//         data: {
//           reportstatus: "resolved",
//           proofMedia: [uploadedMediaId],
//           proofLatitude: latitude,
//           proofLongitude: longitude,
//           proofDistanceMeters: null,
//           proofSubmittedAt: new Date().toISOString(),
//           proofVerified: false,
//         },
//       });

//       // 4️⃣ Done
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to submit proof. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   // const inputRef = useRef<HTMLInputElement>(null);

//   return (
//     <div className="min-h-screen pb-24 p-4 md:p-6">
//       <div className="max-w-xl mx-auto space-y-6">

//         {/* HEADER (with back) */}
//         <Header title="Finish Task" showBack />

//         {/* INSTRUCTIONS */}
//         <Card className="p-4 space-y-2">
//           <h3 className="font-semibold text-base">
//             Submit Cleanup Proof
//           </h3>
//           <p className="text-sm text-muted-foreground">
//             Capture a photo or video after completing the cleanup.
//             Location will be recorded automatically.
//           </p>
//         </Card>

//         {/* FILE INPUT */}
//         {/* <Card className="p-4 space-y-3">
//           <label className="text-sm font-medium">Proof media</label>

//           <div className="relative">
//             <input
//               type="file"
//               accept="image/*,video/*"
//               capture="environment"
//               ref={inputRef} // 👈 We'll use a ref to reset the input
//               onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//               className="block w-full text-sm
//                         file:mr-4 file:py-2 file:px-4
//                         file:rounded-md file:border-0
//                         file:bg-accent file:text-accent-foreground
//                         hover:file:bg-accent/80"
//             />

//             {file && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setFile(null);
//                   if (inputRef.current) inputRef.current.value = ""; // 👈 reset input
//                 }}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center
//                           rounded-full bg-muted text-foreground hover:bg-red-500 hover:text-white
//                           text-sm font-bold"
//                 title="Remove file"
//               >
//                 ×
//               </button>
//             )}
//           </div>

//           {file && (
//             <p className="text-xs text-muted-foreground">
//               Selected: {file.name}
//             </p>
//           )}

//           {error && (
//             <p className="text-sm text-red-500">{error}</p>
//           )}
//         </Card> */}
//         {/* CAMERA CAPTURE */}
//         <Card className="p-4 space-y-3">
//           <label className="text-sm font-medium">Cleanup proof</label>

//           <Button
//             variant="outline"
//             onClick={capturePhoto}
//             className="w-full"
//           >
//             {file ? "Retake Photo" : "Capture Photo"}
//           </Button>

//           {file && (
//             <p className="text-xs text-muted-foreground">
//               Photo captured successfully
//             </p>
//           )}

//           {error && (
//             <p className="text-sm text-red-500">{error}</p>
//           )}
//         </Card>


//       </div>

//       {/* STICKY SUBMIT */}
//       <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
//         <div className="max-w-xl mx-auto p-4">
//           <Button
//             className="w-full"
//             disabled={submitting || !file}
//             onClick={handleSubmit}
//           >
//             {submitting ? "Submitting…" : "Submit Proof"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import strapiClient from "../services/strapiClient";
import { getNativeLocation } from "@/utils/nativeGeolocation";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FinishTaskPage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  const { documentId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 📸 Capture photo (Android-safe)
   */
  const capturePhoto = async () => {
    try {
      setError(null);
      setCapturing(true); // 🔄 show loading state

      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (!photo.base64String) {
        throw new Error("No photo data received");
      }

      // Create preview (for UI)
      const preview = `data:image/${photo.format};base64,${photo.base64String}`;
      setPhotoPreview(preview);

      // Convert base64 → Blob
      const byteCharacters = atob(photo.base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: `image/${photo.format}`,
      });

      const capturedFile = new File([blob], "proof.jpg", {
        type: blob.type,
      });

      setFile(capturedFile);
    } catch (err: any) {
      console.error("Camera error:", err);
      setError(err?.message ?? "Failed to capture photo.");
    } finally {
      setCapturing(false); // ✅ always reset
    }
  };


  /**
   * 🚀 Submit proof
   */
  const handleSubmit = async () => {
    if (!file || !documentId) {
      setError("Please capture proof before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1️⃣ Get GPS
      console.log("📍 Getting location...");
      const position = await getNativeLocation();
      const { latitude, longitude } = position.coords;

      // 2️⃣ Upload media
      console.log("⬆️ Uploading media...", {
        size: file.size,
        type: file.type,
      });

      const formData = new FormData();
      formData.append("files", file);

      const uploadRes = await strapiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload response:", uploadRes.data);

      const uploadedMediaId = uploadRes.data?.[0]?.id;

      if (!uploadedMediaId) {
        throw new Error("Media upload failed: no ID returned");
      }

      // 3️⃣ Update report
      console.log("📝 Updating report...", uploadedMediaId);

      await strapiClient.post("/reports/update-by-documentId", {
        documentId,
        data: {
          reportstatus: "resolved",
          proofMedia: [uploadedMediaId],
          proofLatitude: latitude,
          proofLongitude: longitude,
          proofDistanceMeters: null,
          proofSubmittedAt: new Date().toISOString(),
          proofVerified: false,
        },
      });

      console.log("🎉 Proof submitted successfully");

      // 4️⃣ Done
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Submit failed:", {
        message: err?.message,
        status: err?.response?.status,
        response: err?.response?.data,
      });

      setError(
        err?.response?.data?.error?.message ??
          err?.response?.data?.message ??
          err?.message ??
          "Failed to submit proof. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 p-4 md:p-6">
      <div className="max-w-xl mx-auto space-y-6">

        <Header title="Finish Task" showBack />

        <Card className="p-4 space-y-3">
        <label className="text-sm font-medium">Cleanup proof</label>

        {/* Preview */}
        {photoPreview ? (
          <div className="space-y-2">
            <img
              src={photoPreview}
              alt="Cleanup proof preview"
              className="w-full rounded-md border object-cover"
            />

            <Button
              variant="outline"
              onClick={capturePhoto}
              className="w-full"
              disabled={capturing}
            >
              Retake Photo
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={capturePhoto}
            className="w-full"
            disabled={capturing}
          >
            {capturing ? "Opening camera…" : "Capture Photo"}
          </Button>
        )}

        {/* Status text */}
        {capturing && (
          <p className="text-xs text-muted-foreground">
            Processing photo…
          </p>
        )}

        {file && !capturing && (
          <p className="text-xs text-green-600">
            Photo ready for submission
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </Card>

      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="max-w-xl mx-auto p-4">
          <Button
            className="w-full"
            disabled={submitting || !file}
            onClick={handleSubmit}
          >
            {submitting ? "Submitting…" : "Submit Proof"}
          </Button>
        </div>
      </div>
    </div>
  );
}
