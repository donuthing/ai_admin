# Project Guide (Development, Design, & Conventions)

This document provides a comprehensive guide for developers working on this project, ensuring consistency across different development environments and IDEs.

## 1. Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives (Shadcn/UI pattern)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)

## 2. Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm (Project contains `package-lock.json`)

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
# Server starts at http://localhost:3000
```

## 3. Project Structure

```
src/
├── app/                 # Next.js App Router pages & layouts
│   ├── globals.css      # Global styles & Tailwind theme variables
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/              # Reusable primitive components (Button, Input, etc.)
│   ├── layout/          # Layout-specific components (Header, Sidebar)
│   └── [feature]/       # Feature-specific component groups
└── lib/                 # Utility functions (utils.ts, etc.)
```

## 4. Development Guidelines

### File Naming
- **Components/Files**: Use `kebab-case` (e.g., `rich-text-editor.tsx`, `admin-layout.tsx`).
- **Extensions**: Use `.tsx` for components, `.ts` for utilities/logic.

### Path Aliases
- Use `@/` to import from the `src` directory.
  - Example: `import { Button } from "@/components/ui/button"`

### Component Architecture
- **UI Primitives**: Located in `src/components/ui`. These should be dumb, presentational components (closely following Shadcn/UI implementation).
- **Feature Components**: Group complex components by feature (e.g., `landing-page`, `dashboard`).

### Utility Functions
- **Class Merging**: Use the `cn()` utility (`src/lib/utils.ts`) for conditional classes and merging Tailwind classes.
  ```tsx
  import { cn } from "@/lib/utils"
  // Usage: <div className={cn("base-class", isActive && "active-class", className)} />
  ```

## 5. Design System

### Styling Strategy
- **Utility-First**: Use Tailwind CSS classes for almost all styling.
- **CSS Variables**: Theme colors are defined in `src/app/globals.css` using HSL values.
- **Tailwind v4**: configuration is largely handled via CSS variables and the `@theme` directive in `globals.css`.

### Color Palette (Theming)
The project supports light and dark modes via CSS variables. Key semantic colors:
- **Primary**: Brand/Main action color (`--primary`)
- **Secondary**: Less prominent actions (`--secondary`)
- **Destructive**: Destructive actions/errors (`--destructive`)
- **Muted**: Subdued text/backgrounds (`--muted`)
- **Accent**: Interactive/Highlight elements (`--accent`)

*Reference `src/app/globals.css` for the exact HSL values.*

## 6. Code Conventions

- **Linting**: Standard Next.js ESLint configuration.
- **Formatting**: (Recommended) Prettier with Tailwind CSS plugin for class sorting.
- **React**: Functional components with Hooks. Use `export function ComponentName` syntax preferred over `const ComponentName = () =>`.

## 7. Configuration Files
- `next.config.ts`: Next.js configuration.
- `tsconfig.json`: TypeScript paths and compiler options.
- `eslint.config.mjs`: Linting rules.
