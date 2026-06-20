import { Link } from "wouter";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-bold text-white">EcoVision</span>
            </div>
            <p className="text-sm" data-testid="text-footer-tagline">
              Empowering communities to create cleaner, greener environments through citizen-driven waste reporting.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors" data-testid="link-footer-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-primary transition-colors" data-testid="link-footer-report">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors" data-testid="link-footer-help">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span data-testid="text-footer-email">support@ecovision.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span data-testid="text-footer-phone">+91 96772 86480</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-footer-location">Kaladipet, Chennai 600019</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
          <p data-testid="text-footer-copyright">© 2025 EcoVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
