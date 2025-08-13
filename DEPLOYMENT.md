# 🚀 Deployment & Custom Domain Guide

## Quick Deployment (5 minutes)

### 1. Deploy to Vercel

```bash
# Connect your GitHub repo to Vercel
vercel --prod

# Or use the Vercel dashboard:
# 1. Visit vercel.com
# 2. Import your GitHub repository
# 3. Add environment variables
# 4. Deploy
```

### 2. Environment Variables

Add these to your Vercel project settings:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
PEXELS_API_KEY=your-pexels-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. Database Setup

Run the SQL files in your Supabase dashboard:

1. `supabase-schema.sql` (main tables)
2. `supabase-custom-domains.sql` (custom domain support)

## 🌐 How Generated Websites Are Hosted

### URL Structure

- **Main app**: `yourdomain.com` (homepage & generator)
- **Generated sites**: `yourdomain.com/p/[page-id]`
- **Custom domains**: `customdomain.com` → redirects to page

### Example URLs

```
yourdomain.com                    → Homepage
yourdomain.com/p/page-123         → Generated website
mycoolstartup.com                 → Custom domain → page-123
```

### Global Performance

- ✅ **Edge deployment** - Served from 100+ locations worldwide
- ✅ **CDN optimization** - Images & assets cached globally
- ✅ **Fast database** - Supabase with global read replicas
- ✅ **Instant loading** - Static generation + edge functions

## 🏷️ Custom Domain Feature

### For Your Users (Easy!)

1. **User generates website** → Gets `yourdomain.com/p/abc123`
2. **User wants custom domain** → Uses the CustomDomainManager component
3. **User adds DNS records** → Points their domain to your app
4. **Automatic verification** → Domain becomes active

### Implementation

The custom domain system is already built:

```typescript
// Add to any page management interface
import { CustomDomainManager } from "@/components/custom-domain-manager";

<CustomDomainManager pageId="page-123" />;
```

### DNS Requirements for Users

Users need to add 2 DNS records:

```dns
# Verification (required once)
TXT _ai-website-builder-verify "verification-token-here"

# Redirect (points domain to your app)
CNAME www your-app.vercel.app
```

### Automatic Features

- ✅ **Domain verification** - Ensures user owns the domain
- ✅ **SSL certificates** - Automatic HTTPS via Vercel
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Custom headers** - SEO optimization per domain

## 💰 Business Model Integration

### Pricing Tiers

```typescript
// Free tier: yourdomain.com/p/[id] only
// Pro tier: Custom domain + analytics
// Enterprise: White-label + API access
```

### Revenue Opportunities

1. **Freemium** - Free generation, paid custom domains
2. **Subscription** - $10/month for custom domains
3. **One-time** - $50 for lifetime custom domain
4. **White-label** - $500/month for agencies

## 🔧 Advanced Configuration

### Multiple Domains Per Page

```sql
-- Users can have multiple domains pointing to same page
INSERT INTO custom_domains (page_id, domain) VALUES
  ('page-123', 'mysite.com'),
  ('page-123', 'www.mysite.com');
```

### Analytics & Tracking

```typescript
// Built-in analytics per domain
await trackEvent("page_view", {
  domain: "customdomain.com",
  pageId: "page-123",
});
```

### A/B Testing

```typescript
// Different versions per domain
const variant = domain.includes("test") ? "experimental" : "stable";
```

## 🚨 Production Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Custom domain middleware active
- [ ] DNS verification working
- [ ] SSL certificates auto-renewing
- [ ] Analytics tracking setup
- [ ] Error monitoring configured
- [ ] Backup strategy implemented

## 🎯 User Experience

Your users will experience:

1. **Generate website** (30 seconds)
2. **Get shareable link** (instant)
3. **Add custom domain** (5 minutes setup)
4. **Professional website** (enterprise-grade hosting)

This creates a **premium experience** that justifies higher pricing compared to simple webpage builders.

## 📈 Scaling Considerations

- **10,000 websites**: No issues with current architecture
- **100,000 websites**: Add Redis caching layer
- **1,000,000 websites**: Consider database sharding
- **Global scale**: Add regional Supabase instances

Your architecture is already built for scale! 🚀
