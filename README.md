# AI Website Builder

A Next.js application that generates beautiful landing pages from natural language prompts using AI. Simply describe your idea and get a fully functional website with copy, design, and images automatically generated.

## Features

- **AI-Powered Generation**: Uses Gemini 1.5 Pro to generate structured page specifications and copy
- **Component Library**: Fixed set of 8 responsive components (Hero, Features, CTA, FAQ, etc.)
- **Automatic Images**: Sources relevant stock photos from Pexels API
- **Schema Validation**: Strict JSON validation ensures consistent output
- **Form Handling**: Automatic email collection and notification system
- **Database Storage**: Supabase for data persistence and user management
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: Google Gemini 1.5 Pro
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Images**: Pexels API
- **Email**: Resend
- **Validation**: Zod schemas
- **UI Components**: Radix UI primitives

## Quick Start

1. **Clone and Install**

   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env.local` and fill in your API keys:

   ```bash
   cp .env.example .env.local
   ```

3. **Database Setup**

   - Create a Supabase project
   - Run the SQL commands in `supabase-schema.sql`
   - Add your Supabase credentials to `.env.local`

4. **API Keys Required**

   - **Gemini API**: Get from Google AI Studio
   - **Pexels API**: Get from Pexels.com
   - **Resend API**: Get from Resend.com
   - **Supabase**: Get from your Supabase project

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## How It Works

1. **User Input**: User describes their website idea in natural language
2. **AI Generation**: Gemini generates a PageSpec (structure) and CopySpec (content)
3. **Validation**: Zod schemas validate the AI output for correctness
4. **Image Sourcing**: Relevant images are automatically fetched from Pexels
5. **Rendering**: Components render the page using the specifications
6. **Database Storage**: Everything is saved to Supabase for persistence

## Component Library

The AI can only choose from these predefined components:

- **Hero**: Main banner with CTA (3 variants: image-left, image-right, centered)
- **FeaturesGrid**: Feature highlights (2-4 columns)
- **SocialProof**: Logos or testimonials
- **Pricing**: Pricing tables
- **Steps**: Process explanation
- **FAQ**: Frequently asked questions
- **CTA**: Call-to-action section (card or banner style)
- **Footer**: Simple footer with links

## API Endpoints

- `POST /api/generate-spec` - Generate page from prompt
- `GET /api/pages/[id]` - Fetch page data
- `GET /api/pexels/search` - Search for images
- `POST /api/forms/[formId]/submit` - Handle form submissions

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── p/[id]/           # Generated page display
│   └── page.tsx          # Home page
├── components/
│   ├── blocks/           # Component library
│   ├── ui/              # Base UI components
│   └── page-renderer.tsx # Main renderer
└── lib/
    ├── schemas.ts        # Zod validation schemas
    └── utils.ts         # Utility functions
```

## Environment Variables

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

# AI
AI_API_KEY=your_gemini_api_key

# Images
PEXELS_API_KEY=your_pexels_api_key

# Email
RESEND_API_KEY=your_resend_api_key
```

## Example Usage

**Prompt**: "Minimalist landing page for a vegan protein powder for busy professionals. Focus on taste and clean ingredients. Primary CTA: Join waitlist. Colors: green/black. Tone: confident, friendly."

**Generated**: A complete landing page with Hero section, features highlighting taste and ingredients, CTA for waitlist signup, FAQ section, and footer - all with appropriate copy and a relevant product image.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Database Schema

The application uses the following tables:

- `users` - User profiles
- `projects` - User projects (future feature)
- `pages` - Generated pages with specs
- `leads` - Form submissions
- `images` - Image references
- `analytics_events` - Usage analytics

## Customization

The system is designed to be easily extensible:

- Add new components to the component library
- Modify AI prompts for different generation styles
- Extend schemas for new component properties
- Add new image providers beyond Pexels

## Deployment

### Quick Deploy to Vercel

1. **Connect Repository**

   ```bash
   vercel --prod
   ```

2. **Environment Variables**

   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   PEXELS_API_KEY=your_pexels_api_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

3. **Database Setup**
   - Run `supabase-schema.sql` in Supabase dashboard
   - Run `supabase-custom-domains.sql` for custom domain support

### Generated Website URLs

- **Main app**: `yourdomain.com`
- **Generated sites**: `yourdomain.com/p/[page-id]`
- **Custom domains**: `customdomain.com` → user's page

### Custom Domain Feature

Users can connect their own domains:

```typescript
import { CustomDomainManager } from "@/components/custom-domain-manager";

<CustomDomainManager pageId="page-123" />;
```

**User DNS Setup:**

```dns
TXT _ai-website-builder-verify "verification-token"
CNAME www your-app.vercel.app
```

Features included:

- ✅ Automatic SSL certificates
- ✅ Global CDN distribution
- ✅ Domain verification
- ✅ Professional hosting

See `DEPLOYMENT.md` for complete deployment guide.

## License

MIT License - see LICENSE file for details.
