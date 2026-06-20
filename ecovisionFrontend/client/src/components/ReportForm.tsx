import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitReport } from "@/services/reportService";
import { useAuth } from "@/contexts/AuthContext";

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
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

export function ReportForm() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fetchGPSLocation = () => {
    setFetchingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue("latitude", latitude);
          setValue("longitude", longitude);
          setValue("location", `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setFetchingLocation(false);
          toast({
            title: "Location captured",
            description: "Your GPS coordinates have been added to the report.",
          });
        },
        (error) => {
          setFetchingLocation(false);
          toast({
            title: "Location error",
            description: "Could not fetch your location. Please enter manually.",
            variant: "destructive",
          });
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setFetchingLocation(false);
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

    const onSubmit = async (data: ReportFormData) => {
    try {
      setIsSubmitting(true);
      const response = await submitReport({ ...data, submittedBy: user?.name, emailId:user?.email }, imageFile);
      toast({
        title: "Report submitted!",
        description: "Your waste report has been uploaded successfully.",
      });

      console.log("✅ Report created:", response);
      setLocation("/my-complaints");
    } catch (error) {
      toast({
        title: "Error submitting report",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Upload Photo */}
      <div className="space-y-2">
        <Label htmlFor="image">Upload Photo</Label>
        <Card className="border-2 border-dashed hover:border-primary transition-colors">
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center p-8 cursor-pointer"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg"
              />
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB
                </p>
              </>
            )}
          </label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </Card>
      </div>

      {/* Report Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Report Title</Label>
        <Input
          id="title"
          placeholder="Brief title of the issue"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Waste Type */}
      <div className="space-y-2">
        <Label htmlFor="wasteType">Waste Type</Label>
        <Select
          value={wasteType}
          onValueChange={(value) => setValue("wasteType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select waste type" />
          </SelectTrigger>
          <SelectContent>
            {wasteTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.wasteType && (
          <p className="text-sm text-destructive">{errors.wasteType.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex gap-2">
          <Input
            id="location"
            placeholder="Enter location or use GPS"
            {...register("location")}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={fetchGPSLocation}
            disabled={fetchingLocation}
          >
            {fetchingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Detailed description of the waste issue..."
          className="min-h-32"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Submit Report"
        )}
      </Button>
    </form>
  );
}