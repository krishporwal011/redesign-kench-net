# Kanch-Net (काँच नेटवर्क)

> Digital Supply Aggregation Network for Firozabad Glass Bangle Households, Collectors, and Wholesale Buyers.

Kanch-Net is a digital craft network built specifically for Firozabad glass bangle artisans and wholesale buyers. It aggregates micro-piles produced by cottage-industry households into unified, spec-compliant wholesale buyer lots without sacrificing quality, privacy, or trust.

---

## 🎨 Design Philosophy & Identity

Kanch-Net combines a **Modern Indian Craft Network** visual identity with modern digital reliability:
- **Palette**: Warm Ivory (`#FAF0E4`), Deep Maroon (`#3D0A11`), Brand Red (`#790F26`), Gold Accent (`#C9AA35`), Card White (`#FDF8F4`), and Success Green (`#2E7D5B`).
- **Mobile-First & Accessible**: Designed for ordinary Android devices with large touch targets (≥44px), readable typography, and zero clutter.
- **Micro-Interactions**: Themed delivery truck loading sequence on authentication, 3D extruded craft ribbon engine, stacked card deck fanning visualization, and smooth number count-ups.

---

## 🌟 Key Features

1. **🌐 Global English ↔ Hindi Language System**:
   - Real application-level language switcher (`useLanguage()`) persistent across all routes.
2. **📦 Household Micro-Pile Aggregation**:
   - Interactive stacked-card deck showing how small household micro-piles (200–500 pcs) combine into single wholesale lots (10,000+ pcs).
3. **🛒 Buyer Portal & Escrow Stepper**:
   - Create demands, select color/quality grade with animated toggles, track active orders, and monitor financial escrow progress step-by-step.
4. **⚙️ Deterministic Matching Engine**:
   - Rule-based filtering ensuring zero specification compromises (size, color, finish, and quality grade).
5. **🚚 Pickup QC & Payout Settlement**:
   - Collector verification interface for inspecting batch quality and releasing financial escrow payouts.
6. **📱 Full Mobile Responsiveness**:
   - Audited and verified across all viewports (360px, 390px, 428px, 768px, 1024px, 1440px, 1920px+).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Motion**: React 19, Framer Motion, Canvas 2D
- **Styling**: Tailwind CSS v4, Vanilla CSS design tokens
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/krishporwal011/redesign-kench-net.git

# Navigate into project directory
cd redesign-kench-net

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Compile and build static pages
npm run build

# Start production server
npm run start
```

---

## 🔒 Privacy & Role Security

- Family phone numbers and sensitive household details are protected and never displayed on public operational screens. Household IDs (`HH-01`, `HH-02`) and locality names are used exclusively.
- Role-based portal access separating **Artisans**, **Collectors**, **Coordinators**, and **Wholesale Buyers**.
