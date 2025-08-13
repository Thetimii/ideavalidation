<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AI Website Builder - Copilot Instructions

This is an AI-powered website builder that generates landing pages from natural language prompts using Gemini 1.5 Pro.

## Key Architecture Principles

- **Strict Component Library**: Only use predefined components (Hero, FeaturesGrid, SocialProof, Pricing, Steps, FAQ, CTA, Footer)
- **Schema-First**: All AI outputs must conform to Zod schemas for validation
- **No Freeform HTML**: AI generates structured JSON specs, not HTML
- **Predictable Props**: Component props are small and well-defined

## Component Guidelines

When working with components:

- Each component takes `tokens` (ThemeTokens) for consistent styling
- Use the `cn()` utility for conditional classes
- Follow the established variant patterns
- Images are always passed as normalized objects with multiple sizes

## API Patterns

- All routes use proper error handling and validation
- Database operations use Supabase client with RLS
- AI calls include retry logic and schema validation
- Image operations include scoring and caching

## Styling Approach

- Use CSS-in-JS with style objects for dynamic theming
- Combine with Tailwind classes for layout and spacing
- Respect the design tokens from the brand specification
- Maintain responsive design principles

## Data Flow

1. User prompt → AI generation → Schema validation → Database storage
2. Page request → Database fetch → Image sourcing → Component rendering
3. Form submission → Database storage → Email notification → Analytics

## File Organization

- `/components/blocks/` - Component library implementations
- `/lib/schemas.ts` - All Zod schemas and TypeScript types
- `/app/api/` - API route handlers
- `/app/p/[id]/` - Generated page display

When adding new features, follow the established patterns for schema validation, error handling, and component composition.
