import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function Help() {
  //todo: remove mock functionality
  const faqs = [
    {
      question: "How do I report a waste issue?",
      answer:
        "Click on 'Report Issue' in the navigation menu, fill out the form with details about the waste problem, upload a photo, and submit. You can also use GPS to automatically capture your location.",
    },
    {
      question: "What types of waste can I report?",
      answer:
        "You can report various types of waste including general waste, plastic, paper, glass, metal, e-waste, organic waste, construction waste, and hazardous waste. Select the appropriate category when filing your report.",
    },
    {
      question: "How long does it take for a report to be addressed?",
      answer:
        "Response times vary depending on the severity and type of waste reported. Urgent issues like hazardous waste are prioritized and typically addressed within 24-48 hours. General waste issues may take 3-7 days.",
    },
    {
      question: "Can I track the status of my report?",
      answer:
        "Yes! Once you submit a report, you'll receive a unique ID. You can view the status and any updates on the complaint detail page. You can also follow updates to receive notifications.",
    },
    {
      question: "Do I need to create an account to report issues?",
      answer:
        "Currently, you can browse and view reports without an account. To submit reports and track your submissions, you'll need to create a free account (coming soon).",
    },
    {
      question: "What should I do if I see illegal dumping?",
      answer:
        "Report it immediately through our platform. Include as many details as possible, photos, exact location, and any other relevant information. For large-scale or hazardous illegal dumping, also contact local authorities.",
    },
    {
      question: "How is my location data used?",
      answer:
        "Your location data is used solely to identify where the waste issue is located. This helps our cleanup crews reach the exact spot efficiently. We do not share or sell your location data.",
    },
    {
      question: "Can I report issues anonymously?",
      answer:
        "No, you need to login to submit a report and your username is submitted with the report automatically. However, this detail is only viewed by admin and will not be misused.",
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4" data-testid="text-page-title">
              Help & Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg" data-testid="text-page-subtitle">
              Find answers to common questions about using EcoVision
            </p>
          </div>

          <Card className="p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-${index}`}>
                  <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          <Card className="p-8 mt-8">
            <h2 className="font-heading text-2xl font-semibold mb-4" data-testid="text-contact-title">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground mb-4" data-testid="text-contact-description">
              If you couldn't find the answer you're looking for, our support team is here to help.
            </p>
            <div className="space-y-2 text-sm">
              <p data-testid="text-contact-email">
                <strong>Email:</strong> support@ecovision.org
              </p>
              <p data-testid="text-contact-phone">
                <strong>Phone:</strong> +91 96772 86480
              </p>
              <p data-testid="text-contact-hours">
                <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
