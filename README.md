# Sketch Design Maroc - Luxury Furniture E-Commerce

A modern, luxury e-commerce website for Sketch Design Maroc, a Moroccan furniture company, built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 **Luxury Dark Theme**: Elegant dark design with premium aesthetics
- 📱 **Fully Responsive**: Mobile-first design with burger menu
- 🔍 **Smart Search**: Integrated search functionality
- 🎯 **Navigation Menu**: Hover-enabled dropdown menus with categories
- 🛒 **E-commerce Ready**: User account, wishlist, and shopping cart icons
- ⚡ **Next.js App Router**: Latest Next.js features with App Router
- 🎭 **TypeScript**: Full type safety
- 🎨 **Tailwind CSS**: Utility-first styling
- 🧩 **shadcn/ui**: Beautiful, accessible components

## Color Palette

- **Background**: `#1F1F1F`
- **Text**: `#FFFFFF`
- **Muted Text**: `#C4C4C4`
- **Accent**: `#0E3B2C` (hover/active states)
- **Border**: `#2A2A2A`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Poppins, Inter

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Main navigation component
│   └── ui/                 # shadcn/ui components
│       ├── navigation-menu.tsx
│       ├── input.tsx
│       ├── button.tsx
│       └── sheet.tsx
├── lib/
│   └── utils.ts            # Utility functions
└── tailwind.config.ts      # Tailwind configuration
```

## Components

### Navbar

The main navigation component featuring:

- Logo with hover effect
- Centered search bar
- User, wishlist, and cart icons
- Desktop navigation menu with dropdowns
- Mobile hamburger menu with Sheet component
- Smooth transitions and hover effects

## Customization

### Updating Categories

Edit the `categories` array in `components/Navbar.tsx`:

```tsx
const categories = [
  { name: "PACKS PROMO", href: "#" },
  {
    name: "SALONS",
    sub: [
      { name: "Salons d'angle", href: "#" },
      // Add more subcategories...
    ],
  },
  // Add more categories...
];
```

### Changing Colors

Update the color palette in `tailwind.config.ts`:

```ts
colors: {
  background: "#1F1F1F",
  foreground: "#FFFFFF",
  // Modify colors...
}
```

## Build for Production

```bash
npm run build
npm start
```

## License

This project is private and proprietary.

## Credits

Designed for **Sketch Design Maroc** - Premium Moroccan Furniture

