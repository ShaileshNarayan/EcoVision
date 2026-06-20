# EcoVision Design Guidelines

## Design Approach
**Reference-Based Design** inspired by bine.world's clean, modern environmental tech aesthetic. The design balances professional credibility with approachable usability for civic engagement.

**Core Principles:**
- Eco-conscious visual language that inspires environmental action
- Clean, uncluttered interfaces optimized for quick field reporting
- Trust-building through professional, modern design
- Mobile-first approach for on-the-go waste reporting

---

## Color Palette

### Light Mode
- **Primary Green:** 150 65% 45% (eco-green for CTAs, active states)
- **Primary Dark:** 150 70% 25% (darker green for headers, emphasis)
- **Background:** 0 0% 98% (off-white base)
- **Surface:** 0 0% 100% (white cards)
- **Text Primary:** 220 15% 20% (dark slate)
- **Text Secondary:** 220 10% 45% (muted slate)
- **Border:** 220 15% 88% (light borders)
- **Success:** 150 60% 50% (confirmation states)
- **Warning:** 35 100% 55% (pending status)
- **Error:** 0 75% 55% (alerts, urgent)

### Dark Mode
- **Primary Green:** 150 55% 55% (softer eco-green)
- **Primary Dark:** 150 60% 40% (emphasis)
- **Background:** 220 20% 10% (deep slate)
- **Surface:** 220 15% 15% (elevated cards)
- **Text Primary:** 220 15% 95% (light text)
- **Text Secondary:** 220 10% 65% (muted text)
- **Border:** 220 15% 25% (subtle borders)

---

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - Clean, professional sans-serif for UI
- Headings: 'Outfit' (Google Fonts) - Modern, friendly for headlines

**Scale:**
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Page Title: text-3xl md:text-4xl, font-bold
- Section Heading: text-2xl md:text-3xl, font-semibold
- Card Title: text-xl font-semibold
- Body: text-base, font-normal
- Caption/Meta: text-sm, text-muted
- Button: text-base font-medium

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 8, 12, 16, 20** for consistent rhythm
- Micro spacing: p-2, gap-2 (8px)
- Standard spacing: p-4, m-4, gap-4 (16px)
- Section padding: py-12, py-16, py-20 (mobile to desktop)
- Component gaps: gap-8, gap-12 (32-48px)

**Container Strategy:**
- Max width: max-w-7xl for content sections
- Full bleed: w-full for hero/feature sections
- Form containers: max-w-2xl for optimal readability
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

**Responsive Breakpoints:**
- Mobile-first base styles
- md: (768px) - Tablet adjustments
- lg: (1024px) - Desktop layouts

---

## Component Library

### Navigation
- Fixed top navbar with backdrop blur (backdrop-blur-md bg-white/80)
- Logo left, navigation center/right
- Mobile: Hamburger menu with slide-in drawer
- Active state: Primary green underline or background

### Hero Section
- Full-width hero with environmental image background (80vh on desktop)
- Overlay gradient: from-primary-dark/60 to-primary/40
- Centered content with headline + stats cards below
- CTA buttons: Primary solid green + Secondary outline on blurred background

### Stats Dashboard
- 3-4 stat cards in grid layout (grid-cols-2 lg:grid-cols-4)
- Card style: White background, shadow-sm, rounded-xl, p-8
- Large number (text-4xl font-bold) + label (text-sm text-muted)
- Icon from Heroicons (24px) in primary green

### Complaint/Report Cards
- White cards with shadow-md hover:shadow-lg transition
- Image thumbnail (aspect-video, rounded-t-xl)
- Content padding: p-6
- Meta info: Timestamp, status badge, location with icons
- Waste type pill badge (rounded-full, bg-primary/10, text-primary)
- Clickable with smooth hover scale: hover:scale-[1.02]

### Forms
- Label above input pattern (text-sm font-medium mb-2)
- Inputs: rounded-lg border-2 focus:border-primary transition
- File upload: Dashed border dropzone with icon + text
- GPS button: Icon + "Fetch Current Location" (auto-fills on click)
- Dropdown: Custom styled select with chevron icon
- Submit button: Full-width on mobile, auto on desktop

### Footer
- Multi-column layout (grid-cols-1 md:grid-cols-3)
- Logo + tagline, Quick links, Contact info
- Dark background (bg-slate-900 text-slate-300)
- Section padding: py-12

### Status Badges
- Pending: bg-warning/10 text-warning
- In Progress: bg-blue-500/10 text-blue-600
- Resolved: bg-success/10 text-success
- Rejected: bg-error/10 text-error
- Pill style: px-3 py-1 rounded-full text-sm font-medium

---

## Images

### Hero Section
**Primary Hero Image:** Large, inspiring environmental imagery
- Placement: Full-width background of hero section (80vh)
- Content: Citizens cleaning parks, recycling activities, clean urban spaces, community engagement
- Treatment: Gradient overlay (primary green gradient with 60-40% opacity) for text legibility
- Style: Professional photography, bright, hopeful tone

### Complaint Cards
**Report Thumbnails:** User-uploaded waste/issue photos
- Placement: Top of each complaint card
- Dimensions: aspect-video ratio, rounded-t-xl corners
- Fallback: Placeholder with waste type icon when no image uploaded

### Profile/Activity Section
**Activity Feed Images:** Small thumbnails in activity timeline
- Placement: Left side of activity items (w-16 h-16 rounded-lg)
- Style: Thumbnail previews of reported issues

### Help/FAQ Section
**Illustration Graphics (Optional):** Eco-friendly vector illustrations
- Placement: Decorative elements between FAQ sections
- Style: Simple, line-art style icons representing waste categories

---

## Animations & Interactions

**Minimal, purposeful animations:**
- Card hover: translate-y-1 shadow-lg (subtle lift)
- Button press: scale-95 active state
- Page transitions: Fade in with React Router (200ms)
- Form validation: Shake animation on error
- GPS fetch: Pulse indicator while loading
- NO decorative scroll animations or parallax effects

---

## PWA-Specific Design

**Mobile Optimizations:**
- Bottom action bar for primary actions (floating submit on report form)
- Large touch targets (min h-12 for interactive elements)
- Thumb-friendly navigation (bottom tabs consideration)
- Offline indicator: Toast notification with refresh action
- Install prompt: Subtle banner at bottom of homepage

**Camera Integration:**
- Native camera button in upload area
- Full-screen camera view with capture overlay
- Immediate preview after capture with retake option

---

## Page-Specific Guidelines

### Homepage
- Hero section with inspiring image (80vh) + headline + Login/Signup button (top-right)
- Stats dashboard (4 cards: Total Reports, Resolved, In Progress, Active Users)
- "Latest Cleanup Activities" feed (6-8 complaint cards in grid)
- Section padding: py-20 between major sections

### Report Form Page
- Centered form container (max-w-2xl)
- Photo upload dropzone at top (large, prominent)
- Auto-GPS fetch button with map icon
- Waste type dropdown (with icons for each category)
- Description textarea (min h-32)
- Submit button: Full-width, primary green, h-12

### Complaint Detail
- Full-width image gallery at top (carousel if multiple)
- Content card with timeline of updates
- Admin response section (highlighted with border-l-4 border-primary)
- Action buttons at bottom (Update Status - for admin view later)

### Profile/Settings
- User info card at top (avatar placeholder + name + email)
- Submission history: List of complaint cards (grid layout)
- Settings toggles: Dark mode, Notifications (styled switches)
- Logout button: Secondary, outline style

### Help & FAQs
- Accordion-style FAQ items (border-b dividers)
- Category tabs at top (Getting Started, Reporting, Account)
- Search bar to filter FAQs (future functionality)
- Contact support CTA at bottom

---

## Accessibility & Quality Standards

- Maintain WCAG 2.1 AA contrast ratios (4.5:1 for text)
- Dark mode uses elevated surfaces (not pure black)
- Form inputs have visible focus states (ring-2 ring-primary)
- All interactive elements min h-11 for touch
- Alt text for all images (especially user uploads)
- Loading states with skeleton screens (animate-pulse)
- Error messages clear and actionable