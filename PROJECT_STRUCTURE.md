# Reaction — SvelteKit Project with FSD Architecture

## Project Structure (Feature-Sliced Design)

```
src/
├── app/                    # Application layer (entry point, global setup)
├── pages/                  # Page components (routes)
├── widgets/                # Complex UI widgets (compositions of features)
├── features/               # Domain features (self-contained functionality)
├── shared/                 # Shared UI, utils, types, hooks (reusable across all layers)
└── config/                 # Configuration, environment variables, constants
    └── env.ts              # Type-safe environment variable access
```

## Import Aliases

Use these aliases for clean, relative-free imports across the project:

- `@app/*` — Application layer files
- `@pages/*` — Page components
- `@widgets/*` — Widgets
- `@features/*` — Features
- `@shared/*` — Shared code (utils, components, types)
- `@config/*` — Configuration files
- `@env` — Environment variables module

### Example Imports

```typescript
// ❌ Avoid relative imports
import Component from '../../../shared/ui/Button.svelte';

// ✅ Use aliases
import Button from '@shared/ui/Button.svelte';
import { env } from '@env';
```

## Environment Variables

1. Copy `.env.example` to `.env.local`
2. Update values as needed
3. Access in code via:

```typescript
import { env } from '@env';

console.log(env.apiUrl);       // http://localhost:3000
console.log(env.isDev);        // true/false
console.log(env.environment);  // 'development' | 'production' | 'test'
```

## Node Version

⚠️ **Current blocker**: Node.js v21.7.3 detected, but Vite requires **v20.19+, v22.12+, or >=24**.

To upgrade Node:

- Using `nvm-windows`: `nvm install 22.17.0 && nvm use 22.17.0`
- Or download from https://nodejs.org (LTS recommended)

After upgrading:

```bash
npm install
npm run dev -- --open
```

## Available Scripts

```bash
# Start dev server
npm run dev -- --open

# Build for production
npm build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm test

# Run unit tests with Vitest
npm run test:unit
```

## FSD Layer Guidelines

| Layer        | Purpose                  | Example                                |
| ------------ | ------------------------ | -------------------------------------- |
| **app**      | Global app setup, entry  | `+layout.svelte`, styles, providers    |
| **pages**    | Route pages              | `+page.svelte` files per route         |
| **widgets**  | Complex UI compositions  | Header, Sidebar, MainLayout            |
| **features** | Domain-specific features | Auth, Comments, Posts (self-contained) |
| **shared**   | Reusable across layers   | Button, Input, dateUtils, types        |
| **config**   | Global configuration     | env, constants, API config             |

## Quick Start

1. Upgrade Node to v22 LTS or v20.19+
2. Run `npm install` (if not already done)
3. Run `npm run dev -- --open`
4. Open http://localhost:5173 in your browser
5. Start building! Use `@alias` imports throughout your code.

---

For more on FSD: https://feature-sliced.design/
