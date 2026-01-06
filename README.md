# Catalogue Viewer

A Next.js-based online shop interface for browsing and viewing product catalogues with images and variants.

## Features

- 🖼️ **Image Gallery**: Display front images and carousel images for each product
- 📦 **Product Grid**: Browse all body types in a responsive grid layout
- 🔍 **Product Details**: View all available configurations, sizes, chassis, and variants
- 🎨 **Modern UI**: Clean, minimal design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (default: http://localhost:5000)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Create a `.env.local` file in the root directory (copy from `.env.example` if available)
   - Add your configuration:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```
   - For production, use your production API URL:
     ```
     NEXT_PUBLIC_API_URL=https://be-stm-portal.stm-asb.co.id/api
     ```
   - If not set, it defaults to `http://localhost:5000/api`
   - **Note**: All environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

The app connects to the backend API to fetch catalogue data. Make sure your backend is running and accessible at the configured URL.

### Environment Variables

The project uses `dotenv` for environment variable management. Create a `.env.local` file in the root directory to configure your environment.

**Available Variables:**

- `NEXT_PUBLIC_API_URL`: Backend API base URL (default: `http://localhost:5000/api`)
  - This is the base URL for all API calls
  - Must include the `/api` path if your backend serves API routes under that path
  - Example values:
    - Development: `http://localhost:5000/api`
    - Production: `https://be-stm-portal.stm-asb.co.id/api`

**Important Notes:**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Use `.env.local` for local development (this file is gitignored)
- Never commit `.env.local` or `.env` files with sensitive data
- The configuration is centralized in `src/lib/config.js` for easy management

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components (CatalogueCard, CatalogueGrid, ImageCarousel, Navbar)
- `src/lib/` - API utilities and helpers

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
