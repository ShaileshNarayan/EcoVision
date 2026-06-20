import { ReportForm } from "@/components/ReportForm";

export default function NewReport() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2" data-testid="text-page-title">
              Report Waste Issue
            </h1>
            <p className="text-muted-foreground" data-testid="text-page-subtitle">
              Help us keep our community clean by reporting waste issues in your area
            </p>
          </div>

          <ReportForm />
        </div>
      </div>
    </div>
  );
}
