# Jiffy Booth - Premium Event Entertainment 📸

Jiffy Booth is a high-end photo booth service platform designed for seamless event bookings. This project features a robust **Next.js 14** frontend integrated with **Sanity CMS** for dynamic content management and a highly optimized mobile-first user experience.

---

## Contributors
* **Chin Lok Bin** — *Lead Developer / System Architect*
* **Wong Xiang Rou** — *Project Contributor / UX Design*

---

## Key Features

### Dynamic Management
* **Sanity CMS Integration**: Real-time updates for services, templates, testimonials, and legal documents without touching the code.
* **Automated Quotation**: Smart form that formats request data into professional WhatsApp messages.

### Mobile-First UX
* **Fluid Navigation**: Compact hamburger menu featuring smooth, staggered slide-in animations.
* **High-Density Design**: Compressed vertical spacing and optimized grid systems to reduce scrolling fatigue.
* **Interactive UI**: Smooth Glide.js carousel for template browsing and infinite marquee for brand partnerships.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **CMS** | Sanity CMS |
| **Animations** | Tailwind CSS Animate |
| **Icons** | Lucide React |

---

## Local Development

Follow these steps to set up the project on your new machine:

### 1. Clone & Install
```bash
git clone [your-repository-url]
cd jiffy-booth
npm install
```

### 2.Configure Environment Variables
```bash
Create a file named .env.local in the root directory and paste the following:

NEXT_PUBLIC_SANITY_PROJECT_ID="g8867hcl"
NEXT_PUBLIC_SANITY_DATASET="production"
```
### 3. Run & Build
```bash
To start the development server, run:
npm run dev
```

Troubleshooting (ENOSPC Error)
```bash
If you encounter a no space left on device error during compilation:
Clear the Next.js cache by running: rm -rf .next
Restart the server: npm run dev
```

Project Structure:
```bash
app/: Core application logic, routing, and UI components.
sanity/: Content schemas and client configurations.
public/: Static assets (logos, fallback images).
```
© 2026 Jiffy Ventures. All rights reserved.