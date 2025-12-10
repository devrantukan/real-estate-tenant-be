# Real Estate Tenant Panel

Real estate management system - A Next.js-based web application for property listings and organization management.

## Overview

This project is a web application developed for managing real estate listings, organization management, and user profile management. It uses Next.js 16 (App Router), Supabase Authentication, Prisma ORM, and PostgreSQL database.

## Technologies and Packages Used

### Core Framework
- **Next.js 16.0.8** - React framework (App Router, Turbopack)
  - [Documentation](https://nextjs.org/docs)
  - [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/turbopack)
- **React 19** - UI library
  - [Documentation](https://react.dev)
- **TypeScript 5** - Type safety
  - [Documentation](https://www.typescriptlang.org/docs/)

### Authentication & Database
- **Supabase** - Authentication and backend services
  - `@supabase/supabase-js` - Supabase JavaScript client
  - `@supabase/ssr` - Server-Side Rendering support
  - [Documentation](https://supabase.com/docs)
  - [Auth Documentation](https://supabase.com/docs/guides/auth)
- **Prisma** - ORM (Object-Relational Mapping)
  - `@prisma/client` - Prisma Client
  - `prisma` - Prisma CLI
  - `@prisma/adapter-pg` - PostgreSQL adapter
  - [Documentation](https://www.prisma.io/docs)
- **PostgreSQL** - Database
  - `pg` - PostgreSQL client
  - [Documentation](https://www.postgresql.org/docs/)

### UI Components & Styling
- **NextUI** - React UI library
  - `@nextui-org/react` - Component library
  - [Documentation](https://nextui.org/docs/guide/introduction)
- **Radix UI** - Headless UI components
  - `@radix-ui/react-*` - Various UI components
  - [Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- **Tailwind CSS** - Utility-first CSS framework
  - `tailwindcss` - CSS framework
  - `tailwind-merge` - Tailwind class merging
  - `tailwindcss-animate` - Animation utilities
  - [Documentation](https://tailwindcss.com/docs)
- **Heroicons** - Icon library
  - `@heroicons/react` - React icon components
  - [Documentation](https://heroicons.com/)
- **Lucide React** - Icon library
  - `lucide-react` - React icon components
  - [Documentation](https://lucide.dev/)

### Form Management
- **React Hook Form** - Form state management
  - `react-hook-form` - Form library
  - `@hookform/resolvers` - Validation resolvers
  - [Documentation](https://react-hook-form.com/)
- **Zod** - Schema validation
  - `zod` - TypeScript-first schema validation
  - [Documentation](https://zod.dev/)

### Rich Text Editor
- **TipTap** - Rich text editor
  - `@tiptap/react` - React wrapper
  - `@tiptap/starter-kit` - Core extensions
  - `@tiptap/extension-*` - Various extensions
  - [Documentation](https://tiptap.dev/docs/editor/getting-started/overview)

### Maps & Location
- **Google Maps** - Map integration
  - `@react-google-maps/api` - React Google Maps wrapper
  - `google-map-react` - Google Maps component
  - [Documentation](https://react-google-maps-api-docs.netlify.app/)

### Payment Processing
- **Stripe** - Payment processing
  - `@stripe/stripe-js` - Stripe.js
  - `@stripe/react-stripe-js` - React components
  - `stripe` - Server-side SDK
  - [Documentation](https://stripe.com/docs)

### File Upload
- **UploadThing** - File upload service
  - `uploadthing` - Server SDK
  - `@uploadthing/react` - React components
  - [Documentation](https://docs.uploadthing.com/)

### Utilities
- **Axios** - HTTP client
  - [Documentation](https://axios-http.com/docs/intro)
- **date-fns** - Date utilities
  - [Documentation](https://date-fns.org/)
- **clsx** & **tailwind-merge** - Class name utilities
- **framer-motion** - Animation library
  - [Documentation](https://www.framer.com/motion/)
- **react-toastify** - Toast notifications
  - [Documentation](https://fkhadra.github.io/react-toastify/introduction)
- **sonner** - Toast notifications
  - [Documentation](https://sonner.emilkowal.ski/)

## Installation

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

Define the following variables in your `.env` file:

```env
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
STRIPE_SECRET_KEY="..."
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run make-admin` - Make a user admin

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages
│   ├── user/              # User pages
│   ├── api/               # API routes
│   └── components/        # Shared components
├── lib/                   # Utilities and helpers
│   ├── actions/           # Server actions
│   ├── supabase/         # Supabase clients
│   └── prisma.ts         # Prisma client
└── components/            # UI components
prisma/
└── schema.prisma         # Database schema
```

## Important Documentation Links

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextUI Documentation](https://nextui.org/docs)
- [TipTap Documentation](https://tiptap.dev/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
