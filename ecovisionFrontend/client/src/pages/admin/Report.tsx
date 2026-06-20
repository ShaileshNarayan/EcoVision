import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin, ClipboardList } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { submitReport } from "@/services/reportService";
import { useAuth } from "@/contexts/AuthContext";

// ---------------------- Validation Schema ----------------------
const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  wasteType: z.string().min(1, "Please select a waste type"),
  location: z.string().min(1, "Location is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

const wasteTypes = [
  "General Waste",
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "E-Waste",
  "Organic",
  "Construction Waste",
  "Hazardous Waste",
];

export default function AdminReport() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      wasteType: "",
      location: "",
    },
  });

  const wasteType = watch("wasteType");

  // ---------------------- Image Upload ----------------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ---------------------- GPS Fetch ----------------------
  const fetchGPSLocation = () => {
    setFetchingLocation(true);

    if (!("geolocation" in navigator)) {
      setFetchingLocation(false);
      return toast({
        title: "Not supported",
        description: "Geolocation is not supported in this browser.",
        variant: "destructive",
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setValue("latitude", latitude);
        setValue("longitude", longitude);
        setValue("location", `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);

        toast({
          title: "Location Captured",
          description: "GPS coordinates added to report.",
        });

        setFetchingLocation(false);
      },
      () => {
        toast({
          title: "Location Error",
          description: "Unable to fetch location. Enter manually.",
          variant: "destructive",
        });
        setFetchingLocation(false);
      }
    );
  };

  // ---------------------- Submit Handler ----------------------
  const onSubmit = async (data: ReportFormData) => {
    try {
      setIsSubmitting(true);

      await submitReport(
        {
          ...data,
          submittedBy: user?.name || "Admin",
          emailId: user?.email || "admin@gcc.gov",
        },
        imageFile
      );

      toast({
        title: "Report Submitted",
        description: "The waste report has been successfully submitted.",
      });

      setLocation("/admin");
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not submit report. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------- UI ----------------------
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-red-600" />
              Report Waste Issue
            </h1>
            <p className="text-muted-foreground">
              Submit a new waste management report as admin
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* -------- Title -------- */}
              <div className="space-y-2">
                <Label>Issue Title *</Label>
                <Input
                  placeholder="Brief description of the issue"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* -------- Description -------- */}
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  placeholder="Detailed description of the waste issue..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* -------- Waste Type + Priority -------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Waste Type *</Label>
                  <Select
                    value={wasteType}
                    onValueChange={(v) => setValue("wasteType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      {wasteTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.wasteType && (
                    <p className="text-sm text-destructive">
                      {errors.wasteType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* -------- Location -------- */}
              <div className="space-y-2">
                <Label>Location *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter location address"
                    {...register("location")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchGPSLocation}
                    disabled={fetchingLocation}
                  >
                    {fetchingLocation ? (
                      <MapPin className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* -------- Image Upload -------- */}
              <div className="space-y-2">
                <Label>Upload Photo</Label>
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        className="max-h-64 mx-auto rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="font-medium mb-1">Click to upload photo</p>
                      <p className="text-sm text-muted-foreground">
                        or drag & drop here
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* -------- Buttons -------- */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/admin")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Upload className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Submit Report
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
