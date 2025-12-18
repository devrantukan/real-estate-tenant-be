# Real Estate Tenant Panel

Real estate management system - A Next.js-based web application for property listings and organization management.

## Overview

This project is a web application developed for managing real estate listings, organization management, and user profile management. It uses Next.js 16 (App Router), Supabase Authentication, Prisma ORM, and PostgreSQL database.

## Technologies and Packages Used

### Core Framework
- **Next.js 16.0.10** - React framework (App Router, Turbopack)
  - [Documentation](https://nextjs.org/docs)
  - [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/turbopack)
- **React 19.0.0** - UI library
  - [Documentation](https://react.dev)
- **TypeScript 5.9.3** - Type safety
  - [Documentation](https://www.typescriptlang.org/docs/)

### Authentication & Database
- **Supabase** - Authentication and backend services
  - `@supabase/supabase-js` (^2.87.1) - Supabase JavaScript client
  - `@supabase/ssr` (^0.8.0) - Server-Side Rendering support
  - [Documentation](https://supabase.com/docs)
  - [Auth Documentation](https://supabase.com/docs/guides/auth)
- **Kinde Auth** - Authentication alternative
  - `@kinde-oss/kinde-auth-nextjs` (^2.11.0) - Next.js authentication
  - [Documentation](https://kinde.com/docs/developer-tools/nextjs-sdk/)
- **Prisma** - ORM (Object-Relational Mapping)
  - `@prisma/client` (^7.1.0) - Prisma Client
  - `prisma` (^7.1.0) - Prisma CLI
  - `@prisma/adapter-pg` (^7.1.0) - PostgreSQL adapter
  - [Documentation](https://www.prisma.io/docs)
- **PostgreSQL** - Database
  - `pg` (^8.16.3) - PostgreSQL client
  - [Documentation](https://www.postgresql.org/docs/)

### UI Components & Styling
- **HeroUI** - React UI library (NextUI successor)
  - `@heroui/react` (^3.0.0-beta.2) - Component library
  - `@heroui/styles` (^3.0.0-beta.2) - Styles
  - [Documentation](https://v3.heroui.com)
- **Radix UI** - Headless UI components
  - `@radix-ui/react-alert-dialog` (^1.1.15) - Alert dialog component
  - `@radix-ui/react-avatar` (^1.1.11) - Avatar component
  - `@radix-ui/react-checkbox` (^1.3.3) - Checkbox component
  - `@radix-ui/react-context-menu` (^2.2.16) - Context menu component
  - `@radix-ui/react-dialog` (^1.1.15) - Dialog component
  - `@radix-ui/react-dropdown-menu` (^2.1.16) - Dropdown menu component
  - `@radix-ui/react-label` (^2.1.8) - Label component
  - `@radix-ui/react-popover` (^1.1.15) - Popover component
  - `@radix-ui/react-select` (^2.2.6) - Select component
  - `@radix-ui/react-separator` (^1.1.8) - Separator component
  - `@radix-ui/react-slot` (^1.2.4) - Slot component
  - `@radix-ui/react-toolbar` (^1.1.11) - Toolbar component
  - `@radix-ui/react-tooltip` (^1.2.8) - Tooltip component
  - [Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- **Ariakit** - UI component library
  - `@ariakit/react` (^0.4.20) - React components
  - [Documentation](https://ariakit.org/)
- **Tailwind CSS** - Utility-first CSS framework
  - `tailwindcss` (^4.0.0) - CSS framework
  - `tailwind-merge` (^3.4.0) - Tailwind class merging
  - `tailwindcss-animate` (^1.0.7) - Animation utilities
  - `tailwind-scrollbar-hide` (^4.0.0) - Hide scrollbar utility
  - `@tailwindcss/postcss` (^4.1.18) - PostCSS plugin
  - [Documentation](https://tailwindcss.com/docs)
- **Heroicons** - Icon library
  - `@heroicons/react` (^2.2.0) - React icon components
  - [Documentation](https://heroicons.com/)
- **Lucide React** - Icon library
  - `lucide-react` (^0.561.0) - React icon components
  - [Documentation](https://lucide.dev/)
- **Phosphor Icons** - Icon library
  - `@phosphor-icons/react` (^2.1.10) - React icon components
  - [Documentation](https://phosphoricons.com/)
- **Class Variance Authority** - Component variant management
  - `class-variance-authority` (^0.7.1) - Variant utility
  - [Documentation](https://cva.style/docs)

### Form Management
- **React Hook Form** - Form state management
  - `react-hook-form` (^7.68.0) - Form library
  - `@hookform/resolvers` (^5.2.2) - Validation resolvers
  - [Documentation](https://react-hook-form.com/)
- **Zod** - Schema validation
  - `zod` (^4.1.13) - TypeScript-first schema validation
  - [Documentation](https://zod.dev/)
- **Validator** - String validation
  - `validator` (^13.15.23) - Validation library
  - [Documentation](https://github.com/validatorjs/validator.js)

### Rich Text Editors
- **TipTap** - Rich text editor
  - `@tiptap/react` (^3.13.0) - React wrapper
  - `@tiptap/starter-kit` (^3.13.0) - Core extensions
  - `@tiptap/pm` (^3.13.0) - ProseMirror core
  - `@tiptap/extension-code-block-lowlight` (^3.13.0) - Code block with syntax highlighting
  - `@tiptap/extension-color` (^3.13.0) - Color extension
  - `@tiptap/extension-heading` (^3.13.0) - Heading extension
  - `@tiptap/extension-horizontal-rule` (^3.13.0) - Horizontal rule extension
  - `@tiptap/extension-image` (^3.13.0) - Image extension
  - `@tiptap/extension-link` (^3.13.0) - Link extension
  - `@tiptap/extension-placeholder` (^3.13.0) - Placeholder extension
  - `@tiptap/extension-text-style` (^3.13.0) - Text style extension
  - `@tiptap/extension-typography` (^3.13.0) - Typography extension
  - `@tiptap/extension-underline` (^3.13.0) - Underline extension
  - [Documentation](https://tiptap.dev/docs/editor/getting-started/overview)
- **Quill** - Rich text editor alternative
  - `quill` (^2.0.3) - Quill editor
  - `react-quill` (^2.0.0) - React wrapper
  - [Documentation](https://quilljs.com/)
- **Slate** - Rich text editor framework
  - `slate` (^0.120.0) - Core framework
  - `slate-react` (^0.120.0) - React bindings
  - `slate-dom` (^0.119.0) - DOM utilities
  - `slate-history` (^0.113.1) - History/undo support
  - `slate-hyperscript` (^0.100.0) - Hyperscript helpers
  - [Documentation](https://www.slatejs.org/)

### Maps & Location
- **Google Maps** - Map integration
  - `@react-google-maps/api` (^2.20.7) - React Google Maps wrapper
  - `google-map-react` (^2.2.5) - Google Maps component
  - [Documentation](https://react-google-maps-api-docs.netlify.app/)

### Payment Processing
- **Stripe** - Payment processing
  - `@stripe/stripe-js` (^8.5.3) - Stripe.js
  - `@stripe/react-stripe-js` (^5.4.1) - React components
  - `stripe` (^20.0.0) - Server-side SDK
  - [Documentation](https://stripe.com/docs)

### File Upload & Media
- **UploadThing** - File upload service
  - `uploadthing` (^7.7.4) - Server SDK
  - `@uploadthing/react` (^7.3.3) - React components
  - [Documentation](https://docs.uploadthing.com/)
- **React Dropzone** - File dropzone
  - `react-dropzone` (^14.3.8) - Drag and drop file upload
  - [Documentation](https://react-dropzone.js.org/)
- **React Image Crop** - Image cropping
  - `react-image-crop` (^11.0.10) - Image cropping component
  - [Documentation](https://github.com/DominicTobias/react-image-crop)
- **React Image Gallery** - Image gallery
  - `react-image-gallery` (^1.4.0) - Image gallery component
  - [Documentation](https://github.com/xiaolin/react-image-gallery)
- **React Medium Image Zoom** - Image zoom
  - `react-medium-image-zoom` (^5.4.0) - Image zoom component
  - [Documentation](https://github.com/rpearce/react-medium-image-zoom)
- **Sharp** - Image processing
  - `sharp` (^0.34.5) - High-performance image processing
  - [Documentation](https://sharp.pixelplumbing.com/)
- **HTML2Canvas** - Screenshot utility
  - `html2canvas` (^1.4.1) - HTML to canvas converter
  - [Documentation](https://html2canvas.hertzen.com/)
- **PDF Lib** - PDF generation
  - `pdf-lib` (^1.17.1) - PDF creation and manipulation
  - [Documentation](https://pdf-lib.js.org/)

### Drag & Drop
- **dnd-kit** - Drag and drop toolkit
  - `@dnd-kit/core` (^6.3.1) - Core drag and drop
  - `@dnd-kit/sortable` (^10.0.0) - Sortable components
  - `@dnd-kit/utilities` (^3.2.2) - Utility functions
  - [Documentation](https://docs.dndkit.com/)
- **React Beautiful DnD** - Drag and drop alternative
  - `react-beautiful-dnd` (^13.1.1) - Drag and drop component
  - [Documentation](https://github.com/atlassian/react-beautiful-dnd)
- **React DnD** - Drag and drop library
  - `react-dnd` (^16.0.1) - Drag and drop library
  - `react-dnd-html5-backend` (^16.0.1) - HTML5 backend
  - [Documentation](https://react-dnd.github.io/react-dnd/)

### Data Tables & Display
- **TanStack Table** - Table component
  - `@tanstack/react-table` (^8.21.3) - Headless table library
  - [Documentation](https://tanstack.com/table/latest)
- **React Resizable Panels** - Resizable panels
  - `react-resizable-panels` (^3.0.6) - Resizable panel components
  - [Documentation](https://github.com/bvaughn/react-resizable-panels)

### Video & Media Players
- **React Player** - Media player
  - `react-player` (^3.4.0) - Media player component
  - [Documentation](https://github.com/cookpete/react-player)
- **React Lite YouTube Embed** - YouTube embed
  - `react-lite-youtube-embed` (^3.3.3) - Lightweight YouTube embed
  - [Documentation](https://github.com/ibrahimcesar/react-lite-youtube-embed)
- **React Tweet** - Twitter embed
  - `react-tweet` (^3.3.0) - Twitter/X embed component
  - [Documentation](https://github.com/vercel/react-tweet)

### Date & Time
- **date-fns** - Date utilities
  - `date-fns` (^4.1.0) - Date manipulation library
  - [Documentation](https://date-fns.org/)
- **React Day Picker** - Date picker
  - `react-day-picker` (^9.12.0) - Date picker component
  - [Documentation](https://react-day-picker.js.org/)

### Search & Filtering
- **Typesense** - Search engine
  - `typesense` (^2.1.0) - Typo-tolerant search engine
  - [Documentation](https://typesense.org/docs/)
- **FZF** - Fuzzy finder
  - `fzf` (^0.5.2) - Fuzzy finder library
  - [Documentation](https://github.com/junegunn/fzf)

### Code Highlighting
- **Lowlight** - Syntax highlighting
  - `lowlight` (^3.3.0) - Syntax highlighter
  - [Documentation](https://github.com/wooorm/lowlight)
- **PrismJS** - Syntax highlighting
  - `prismjs` (^1.30.0) - Syntax highlighter
  - [Documentation](https://prismjs.com/)

### AI & Machine Learning
- **Vercel AI SDK** - AI integration
  - `ai` (^5.0.112) - AI SDK
  - `@ai-sdk/openai` (^2.0.85) - OpenAI provider
  - [Documentation](https://sdk.vercel.ai/docs)

### Utilities
- **Axios** - HTTP client
  - `axios` (^1.13.2) - Promise-based HTTP client
  - [Documentation](https://axios-http.com/docs/intro)
- **clsx** & **tailwind-merge** - Class name utilities
  - `clsx` (^2.1.1) - Conditional class names
  - [Documentation](https://github.com/lukeed/clsx)
- **framer-motion** - Animation library
  - `framer-motion` (^12.23.26) - Animation library
  - [Documentation](https://www.framer.com/motion/)
- **react-toastify** - Toast notifications
  - `react-toastify` (^11.0.5) - Toast notification library
  - [Documentation](https://fkhadra.github.io/react-toastify/introduction)
- **sonner** - Toast notifications
  - `sonner` (^2.0.7) - Toast notification library
  - [Documentation](https://sonner.emilkowal.ski/)
- **use-debounce** - Debounce hook
  - `use-debounce` (^10.0.6) - React debounce hook
  - [Documentation](https://github.com/xnimorz/use-debounce)
- **use-file-picker** - File picker hook
  - `use-file-picker` (^2.1.4) - File picker hook
  - [Documentation](https://github.com/Jaaneek/useFilePicker)
- **slugify** - String slugification
  - `slugify` (^1.6.6) - String to slug converter
  - [Documentation](https://github.com/simov/slugify)
- **React Aria SSR** - Server-side rendering utilities
  - `@react-aria/ssr` (^3.9.10) - SSR utilities for React Aria
  - [Documentation](https://react-spectrum.adobe.com/react-aria/)

### Development Tools
- **Faker.js** - Fake data generation
  - `@faker-js/faker` (^10.1.0) - Fake data generator
  - [Documentation](https://fakerjs.dev/)

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

### Core Framework
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Authentication & Database
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Kinde Auth Documentation](https://kinde.com/docs/developer-tools/nextjs-sdk/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### UI Components & Styling
- [HeroUI Documentation](https://v3.heroui.com)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Ariakit Documentation](https://ariakit.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)
- [Phosphor Icons](https://phosphoricons.com/)

### Form Management & Validation
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [Validator.js Documentation](https://github.com/validatorjs/validator.js)

### Rich Text Editors
- [TipTap Documentation](https://tiptap.dev/docs)
- [Quill Documentation](https://quilljs.com/)
- [Slate Documentation](https://www.slatejs.org/)

### Maps & Location
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)

### Payment Processing
- [Stripe Documentation](https://stripe.com/docs)

### File Upload & Media
- [UploadThing Documentation](https://docs.uploadthing.com/)
- [React Dropzone](https://react-dropzone.js.org/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)

### Drag & Drop
- [dnd-kit Documentation](https://docs.dndkit.com/)
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)
- [React DnD Documentation](https://react-dnd.github.io/react-dnd/)

### Data Tables
- [TanStack Table Documentation](https://tanstack.com/table/latest)

### AI & Machine Learning
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)

### Utilities
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [date-fns Documentation](https://date-fns.org/)
- [React Day Picker Documentation](https://react-day-picker.js.org/)
