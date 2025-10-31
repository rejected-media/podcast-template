# Podcast Template

**A ready-to-use template for creating beautiful podcast websites** built with [Podcast Framework](https://github.com/rejected-media/podcast-framework).

---

## 🚀 Quick Start

### 1. Use This Template

Click the **"Use this template"** button above to create your own repository.

### 2. Clone Your Repository

```bash
git clone https://github.com/YOUR_USERNAME/your-podcast.git
cd your-podcast
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Sanity CMS

Create a Sanity project at [sanity.io/manage](https://sanity.io/manage)

1. Click "Create Project"
2. Name your project
3. Copy the Project ID

### 5. Configure Environment Variables

```bash
# Copy the template
cp .env.template .env.local

# Edit .env.local and add your credentials
nano .env.local
```

**Required variables:**
- `PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID (exposed to client)
- `SANITY_PROJECT_ID` - Your Sanity project ID (server-side)
- `PUBLIC_SANITY_DATASET` - Usually "production" (exposed to client)
- `SANITY_DATASET` - Usually "production" (server-side)
- `SANITY_API_TOKEN` - Create a write token in Sanity dashboard (for API routes)

### 6. Start Development Servers

**Start the website:**
```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

**Start Sanity Studio (in another terminal):**
```bash
npm run sanity:dev
```

Open [http://localhost:3333](http://localhost:3333)

---

## 🎛️ Sanity Studio

### Local Development

The Sanity Studio is your content management interface. Run it locally to add/edit episodes:

```bash
npm run sanity:dev
```

This starts the Studio at http://localhost:3333

### Deploy Studio to Sanity Cloud

To make your Studio accessible from anywhere (recommended for production):

1. Make sure your `.env.local` has correct credentials
2. Deploy to Sanity Cloud:
   ```bash
   npm run sanity:deploy
   ```
3. Follow the prompts to choose a studio hostname
4. Your Studio will be available at `https://your-studio.sanity.studio`

The free tier includes unlimited Studio hosting.

### Studio Features

- Create and edit podcast episodes
- Manage guests and hosts
- Configure podcast metadata
- Upload audio files
- Add episode transcripts
- Rich text editing for show notes

---

## 📰 Newsletter Configuration

The framework includes a built-in newsletter signup form that integrates with ConvertKit.

### Setup Requirements

For the newsletter signup form to appear, **both** of the following must be configured:

1. **ConvertKit API credentials** in `.env`:
   ```bash
   CONVERTKIT_API_KEY=your_api_key
   CONVERTKIT_FORM_ID=your_form_id
   ```

2. **Newsletter enabled in Sanity CMS:**
   - Open Sanity Studio (http://localhost:3333 or your deployed Studio)
   - Go to the "Podcast" document
   - Set `Newsletter Enabled` to **true**
   - Set `Is Active` to **true**
   - Save and publish

### Why This Two-Step Setup?

This design allows you to:
- Temporarily disable the newsletter without removing API credentials
- Test the site without ConvertKit configured
- Control newsletter visibility per environment

### Troubleshooting

**Newsletter form not appearing?**
- ✅ Check ConvertKit credentials are in `.env`
- ✅ Verify `newsletterEnabled: true` in Sanity podcast document
- ✅ Verify `isActive: true` in Sanity podcast document
- ✅ Restart dev server after adding environment variables

---

## 📥 Importing Episodes from RSS Feed

If you have an existing podcast with episodes in an RSS feed (from Transistor, Spotify, Apple Podcasts, etc.), you can bulk import them into Sanity.

### When to Import

Run the import **after** you've set up Sanity CMS but **before** your first deployment.

### Import Command

```bash
npm run import:episodes
```

### What Happens

The CLI will:
1. Prompt for your podcast's RSS feed URL
2. Fetch all episodes from the feed
3. Parse episode metadata (title, description, audio URL, publish date, etc.)
4. Create episode documents in Sanity CMS
5. Show a summary of imported episodes

### Expected Output

```
🎙️  Importing episodes from RSS feed...

✓ Found 42 episodes in feed
✓ Creating episode documents in Sanity...
✓ Imported 42 episodes successfully

Episodes are now in your Sanity CMS. Visit your Studio to review and publish them.
```

### Re-importing Episodes

To import new episodes without duplicating existing ones:

```bash
npm run import:episodes
```

The CLI intelligently skips episodes that already exist in Sanity (matched by episode number or GUID).

### Supported RSS Feed Sources

- Transistor
- Spotify for Podcasters
- Apple Podcasts
- Buzzsprout
- Libsyn
- Any RSS 2.0 or Atom podcast feed

### Troubleshooting

**Import fails?**
- ✅ Verify your RSS feed URL is correct and accessible
- ✅ Check Sanity credentials are in `.env`
- ✅ Ensure you have write permissions (SANITY_API_TOKEN with Editor role)
- ✅ Check console output for specific error messages

---

## 📦 What's Included

### Framework Packages

- **@rejected-media/podcast-framework-core** - Components, layouts, utilities
- **@rejected-media/podcast-framework-sanity-schema** - CMS schemas
- **Astro 5** - Static site generator
- **Sanity 3** - Headless CMS

### Components (8)

- Header - Navigation with mobile menu
- Footer - Social links and newsletter
- NewsletterSignup - Email subscription
- EpisodeSearch - Client-side search
- TranscriptViewer - Transcript display
- FeaturedEpisodesCarousel - Episode carousel
- SkeletonLoader - Loading states
- BlockContent - Rich text renderer

### Features

- ✅ SEO optimized (meta tags, Schema.org)
- ✅ Google Analytics 4 ready
- ✅ Responsive design
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Episode transcripts
- ✅ Newsletter signup
- ✅ Community contributions
- ✅ Multi-cloud deployment (Cloudflare/Vercel/Netlify)

---

## 🎨 Customization

### Override Components

Create `src/components/ComponentName.astro` to override any framework component:

```astro
---
// src/components/Header.astro
---
<header class="custom-header">
  <!-- Your custom header -->
</header>
```

The framework automatically uses your version!

### Extend Schemas

```typescript
// sanity/sanity.config.ts
import { extendEpisodeSchema } from '@rejected-media/podcast-framework-sanity-schema';

const episode = extendEpisodeSchema([
  {
    name: 'sponsor',
    type: 'reference',
    to: [{ type: 'sponsor' }]
  }
]);
```

### Configure Features

Edit `podcast.config.js` to enable/disable features:

```javascript
features: {
  transcripts: true,
  newsletter: true,
  search: true,
  comments: false  // Disable comments
}
```

---

## 🚢 Deployment

This template is **pre-configured for Cloudflare Pages** with the adapter already installed. You can also deploy to Netlify or Vercel with minor configuration changes.

### Platform Requirements

All platforms require:
- **Node.js 18+** for the build
- **SSR adapter** installed (handles API routes and server-side rendering)
- **Environment variables** configured in the platform dashboard

---

### Cloudflare Pages (Recommended - Pre-configured)

**Why Cloudflare Pages?**
- ✅ Free tier includes unlimited bandwidth
- ✅ Global CDN with 300+ locations
- ✅ Built-in analytics
- ✅ Zero-config SSL
- ✅ Excellent performance

**Adapter:** Already installed (`@astrojs/cloudflare`)

**Deployment Steps:**

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/your-podcast.git
   git push -u origin main
   ```

2. **Create Cloudflare Pages project**
   - Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/pages)
   - Click "Create a project"
   - Select "Connect to Git"
   - Authorize GitHub and select your repository

3. **Configure build settings**
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** (leave empty)

4. **Add environment variables** (in Cloudflare Pages dashboard):
   ```
   PUBLIC_SANITY_PROJECT_ID=your_project_id
   PUBLIC_SANITY_DATASET=production
   SANITY_PROJECT_ID=your_project_id
   SANITY_DATASET=production
   SANITY_API_TOKEN=your_write_token
   PUBLIC_SITE_URL=https://your-podcast.pages.dev

   # Optional: Newsletter
   CONVERTKIT_API_KEY=your_api_key
   CONVERTKIT_FORM_ID=your_form_id

   # Optional: Email notifications
   RESEND_API_KEY=your_resend_key
   NOTIFICATION_EMAIL=admin@yourpodcast.com

   # Optional: Analytics
   GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

5. **Deploy!**
   - Click "Save and Deploy"
   - Wait 2-3 minutes for build
   - Your site will be live at `https://your-podcast.pages.dev`

6. **Set up custom domain** (optional)
   - Go to your Pages project → Custom domains
   - Click "Set up a custom domain"
   - Follow DNS configuration instructions

**Troubleshooting:**
- ❌ Build fails → Check environment variables are set
- ❌ API routes 404 → Verify adapter is `@astrojs/cloudflare` in `astro.config.mjs`
- ❌ Missing content → Check Sanity project ID and token

**Branch Deployments:**
- `main` branch → Production (your-podcast.pages.dev)
- Other branches → Preview deployments (branch-name.your-podcast.pages.dev)

---

### Vercel

**Adapter Required:** `@astrojs/vercel`

**Setup:**

1. **Install Vercel adapter**
   ```bash
   npm uninstall @astrojs/cloudflare
   npm install @astrojs/vercel
   ```

2. **Update `astro.config.mjs`**
   ```javascript
   import vercel from '@astrojs/vercel/serverless';

   export default defineConfig({
     output: 'server',
     adapter: vercel(),
     // ... rest of config
   });
   ```

3. **Deploy**
   - Push to GitHub
   - Import project at [vercel.com/new](https://vercel.com/new)
   - Vercel auto-detects Astro and configures build
   - Add environment variables in Vercel dashboard
   - Deploy!

**Build settings:**
- Framework: Astro
- Build command: `npm run build`
- Output directory: `dist`

---

### Netlify

**Adapter Required:** `@astrojs/netlify`

**Setup:**

1. **Install Netlify adapter**
   ```bash
   npm uninstall @astrojs/cloudflare
   npm install @astrojs/netlify
   ```

2. **Update `astro.config.mjs`**
   ```javascript
   import netlify from '@astrojs/netlify';

   export default defineConfig({
     output: 'server',
     adapter: netlify(),
     // ... rest of config
   });
   ```

3. **Create `netlify.toml`** (optional, for build config)
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

4. **Deploy**
   - Push to GitHub
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import from Git"
   - Select repository and configure
   - Add environment variables in Netlify dashboard
   - Deploy!

---

### Environment Variables by Platform

**All platforms need these variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `PUBLIC_SANITY_PROJECT_ID` | Your project ID | From sanity.io/manage (client-side) |
| `PUBLIC_SANITY_DATASET` | `production` | Usually "production" (client-side) |
| `SANITY_PROJECT_ID` | Your project ID | From sanity.io/manage (server-side) |
| `SANITY_DATASET` | `production` | Usually "production" (server-side) |
| `SANITY_API_TOKEN` | Write token | For API routes (contribute, etc.) |
| `PUBLIC_SITE_URL` | Your domain | Full URL (https://...) |

**Optional variables:**

| Variable | Required For | Description |
|----------|--------------|-------------|
| `CONVERTKIT_API_KEY` | Newsletter | From ConvertKit settings |
| `CONVERTKIT_FORM_ID` | Newsletter | Your form ID |
| `RESEND_API_KEY` | Email notifications | From resend.com |
| `NOTIFICATION_EMAIL` | Email notifications | Where to send admin emails |
| `GA_MEASUREMENT_ID` | Google Analytics | G-XXXXXXXXXX format |
| `STUDIO_URL` | Email links | URL to your Studio (optional) |

---

### Staging vs Production

For a professional setup with staging and production environments:

1. **Create two Sanity datasets:**
   - `staging` - for testing
   - `production` - for live site

2. **Set up two deployments:**
   - **Staging:** Deploy from `staging` branch → Uses `SANITY_DATASET=staging`
   - **Production:** Deploy from `main` branch → Uses `SANITY_DATASET=production`

3. **Workflow:**
   ```bash
   # Develop on feature branch
   git checkout -b feature/new-design
   git commit -m "Update homepage design"

   # Merge to staging for testing
   git checkout staging
   git merge feature/new-design
   git push origin staging  # → Deploys to staging.yourpodcast.com

   # After testing, promote to production
   git checkout main
   git merge staging
   git push origin main  # → Deploys to yourpodcast.com
   ```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a comprehensive production deployment guide.

---

### Deployment Checklist

Before your first deployment:

- [ ] ✅ All environment variables configured in platform dashboard
- [ ] ✅ Sanity Studio deployed (`npm run sanity:deploy`)
- [ ] ✅ DNS configured (if using custom domain)
- [ ] ✅ SSL/TLS enabled (auto on all platforms)
- [ ] ✅ Episodes imported or created in Sanity
- [ ] ✅ Podcast metadata configured (name, description, logo)
- [ ] ✅ Theme configured (colors, typography, layout)
- [ ] ✅ Homepage config created and activated in Sanity
- [ ] ✅ About page config created (optional)
- [ ] ✅ Test newsletter signup (if enabled)
- [ ] ✅ Test contribution form
- [ ] ✅ Verify episode pages load correctly
- [ ] ✅ Check mobile responsiveness

**First deployment usually takes:**
- ⏱️ Cloudflare Pages: 2-3 minutes
- ⏱️ Vercel: 1-2 minutes
- ⏱️ Netlify: 2-4 minutes

**Subsequent deployments:**
- ⏱️ All platforms: 1-2 minutes (cached dependencies)

---

## 📚 Documentation

### Framework Documentation

- [Main Repository](https://github.com/rejected-media/podcast-framework)
- [Component Reference](https://github.com/rejected-media/podcast-framework/blob/main/packages/core/COMPONENTS.md)
- [CLI Commands](https://github.com/rejected-media/podcast-framework/blob/main/packages/cli/README.md)

### Guides

- **Setup Guide:** See [Quick Start](#quick-start) above
- **Deployment Guide:** See [Deployment](#deployment) above
- **Customization:** See [Customization](#customization) above

---

## 🔒 Security

### npm Audit Warnings

You may see **10 low-severity warnings** when running `npm audit`. These are known, documented, and **not a security concern**. They originate from an unmaintained package deep in Sanity's dependency tree.

**TL;DR:** Low severity (2.9/10), extremely low exploitation probability (<0.1%), only affects server-side development tools, and doesn't impact your public website.

**For full details, see:** [SECURITY.md](./SECURITY.md)

---

## 🛠️ CLI Commands

The framework includes a CLI tool for common tasks:

```bash
# Validate your project
npx @podcast-framework/cli validate

# List available components
npx @podcast-framework/cli list-components

# Override a component
npx @podcast-framework/cli override Header

# Check for framework updates
npx @podcast-framework/cli check-updates

# Update framework packages
npx @podcast-framework/cli update
```

---

## 🤝 Contributing

Found a bug or want to contribute? Visit the [main repository](https://github.com/rejected-media/podcast-framework).

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 🙏 Built With

- [Podcast Framework](https://github.com/rejected-media/podcast-framework)
- [Astro](https://astro.build)
- [Sanity](https://www.sanity.io)
- [Tailwind CSS](https://tailwindcss.com)

---

**Happy podcasting! 🎙️**
