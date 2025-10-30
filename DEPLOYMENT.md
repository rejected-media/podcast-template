# Production Deployment Guide

**Comprehensive guide for deploying your podcast website to production with staging environments, branch strategies, and best practices.**

---

## Table of Contents

1. [Overview](#overview)
2. [Environment Strategy](#environment-strategy)
3. [Sanity CMS Setup](#sanity-cms-setup)
4. [Platform Configuration](#platform-configuration)
5. [Branch Strategy](#branch-strategy)
6. [Deployment Workflow](#deployment-workflow)
7. [Environment Variables](#environment-variables)
8. [Custom Domains](#custom-domains)
9. [Testing & Validation](#testing--validation)
10. [Rollback Procedures](#rollback-procedures)
11. [Monitoring & Analytics](#monitoring--analytics)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers professional production deployment with:
- ✅ **Staging environment** for testing
- ✅ **Production environment** for live site
- ✅ **Branch-based deployments** (automatic)
- ✅ **Environment separation** (data, configs, credentials)
- ✅ **Rollback procedures** for emergencies
- ✅ **Monitoring and analytics** setup

**Prerequisites:**
- GitHub repository with your podcast code
- Sanity account with project created
- Hosting platform account (Cloudflare Pages recommended)
- Custom domain (optional but recommended)

---

## Environment Strategy

### Two-Environment Setup

| Environment | Purpose | Branch | URL Pattern | Sanity Dataset |
|-------------|---------|--------|-------------|----------------|
| **Staging** | Testing, previews | `staging` | `staging.yourpodcast.com` | `staging` |
| **Production** | Live site | `main` | `yourpodcast.com` | `production` |

### Benefits

**Staging Environment:**
- Test new features before going live
- Preview content changes
- Validate integrations (newsletter, analytics, etc.)
- Train content editors
- Run automated tests
- Safe experimentation

**Production Environment:**
- Stable, live site
- Only receives tested changes
- Separate dataset (prevents accidental content changes)
- Monitored and optimized for performance

---

## Sanity CMS Setup

### Create Two Datasets

1. **Log in to Sanity** at [sanity.io/manage](https://sanity.io/manage)
2. **Select your project**
3. **Create datasets:**

   **Production Dataset:**
   - Click "Datasets" → "Add dataset"
   - Name: `production`
   - Visibility: Public
   - Click "Create"

   **Staging Dataset:**
   - Click "Datasets" → "Add dataset"
   - Name: `staging`
   - Visibility: Public
   - Click "Create"

### Create API Tokens

Create separate tokens for each environment:

1. **Production Token:**
   - Go to "API" → "Tokens"
   - Click "Add API token"
   - Label: `Production Site`
   - Permissions: Viewer (or Editor if using RSS import on server)
   - Dataset: `production` only
   - Save the token securely

2. **Staging Token:**
   - Click "Add API token"
   - Label: `Staging Site`
   - Permissions: Editor (for testing imports)
   - Dataset: `staging` only
   - Save the token securely

### Deploy Studio Instances

**Option A: Single Studio with Dataset Switcher (Recommended)**

The Studio can access both datasets, and you switch between them in the UI:

```bash
# Deploy Studio to Sanity Cloud
npm run sanity:deploy
```

Your Studio will be at `https://yourpodcast.sanity.studio`

In the Studio, use the dataset switcher (bottom left) to toggle between `production` and `staging`.

**Option B: Separate Studio Deployments**

Deploy two Studio instances if you want strict separation:

```bash
# Configure Studio for production
export SANITY_STUDIO_DATASET=production
npm run sanity:deploy -- --hostname yourpodcast-prod

# Configure Studio for staging
export SANITY_STUDIO_DATASET=staging
npm run sanity:deploy -- --hostname yourpodcast-staging
```

---

## Platform Configuration

### Cloudflare Pages (Recommended)

#### Create Production Deployment

1. **Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/pages)**
2. **Click "Create a project"**
3. **Connect to GitHub** and authorize
4. **Select your repository**
5. **Configure build:**
   - **Project name:** `yourpodcast-production`
   - **Production branch:** `main`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** *(leave empty)*

6. **Add environment variables** (see [Environment Variables](#environment-variables) section)
7. **Click "Save and Deploy"**

#### Create Staging Deployment

1. **In the same Cloudflare Pages project**
2. **Go to Settings → Builds & deployments**
3. **Enable branch deployments:**
   - Branch: `staging`
   - Automatically deploy: **Yes**

4. **Add staging environment variables:**
   - Go to Settings → Environment variables
   - Add variables with **Preview** scope (for `staging` branch)
   - Use staging Sanity token and dataset

Your deployments will now work like this:
- Push to `main` → Deploys to `yourpodcast-production.pages.dev` (production)
- Push to `staging` → Deploys to `staging.yourpodcast-production.pages.dev` (staging)

#### Alternative: Separate Projects

For stricter separation, create two Cloudflare Pages projects:
- `yourpodcast-production` (watches `main` branch)
- `yourpodcast-staging` (watches `staging` branch)

---

### Vercel

**Production:**
1. Import project at [vercel.com/new](https://vercel.com/new)
2. Select GitHub repository
3. Set production branch to `main`
4. Add production environment variables
5. Deploy

**Staging:**
1. In project settings → Git
2. Enable preview deployments for `staging` branch
3. Go to Settings → Environment Variables
4. Add staging variables with "Preview" scope
5. Specify `staging` branch

---

### Netlify

**Production:**
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import from Git"
3. Select repository
4. Set branch to `main`
5. Add production environment variables
6. Deploy

**Staging:**
1. Create a second site: "Add new site"
2. Select same repository
3. Set branch to `staging`
4. Add staging environment variables
5. Deploy

---

## Branch Strategy

### Branch Structure

```
main (production)
  ├── staging (pre-production)
  │    ├── feature/episode-player-redesign
  │    ├── feature/new-homepage
  │    └── bugfix/newsletter-signup
  └── hotfix/critical-bug (emergency fixes)
```

### Workflow

#### Normal Development Flow

```bash
# 1. Create feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/episode-player-redesign

# 2. Make changes and commit
git add .
git commit -m "Redesign episode player UI"

# 3. Push and create pull request to staging
git push origin feature/episode-player-redesign
# Create PR: feature/episode-player-redesign → staging

# 4. After PR approval, merge to staging
# This deploys to staging environment automatically

# 5. Test on staging site

# 6. If tests pass, promote to production
git checkout main
git pull origin main
git merge staging
git push origin main
# This deploys to production automatically
```

#### Hotfix Flow (Production Bug)

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-newsletter-bug

# 2. Fix the bug and commit
git add .
git commit -m "Fix newsletter subscription error"

# 3. Merge to main immediately
git checkout main
git merge hotfix/critical-newsletter-bug
git push origin main
# Deploys to production

# 4. Backport to staging
git checkout staging
git merge hotfix/critical-newsletter-bug
git push origin staging
# Keeps staging in sync
```

---

## Deployment Workflow

### Deploy to Staging

**Purpose:** Test all changes before production

**Steps:**
1. Merge feature branch to `staging`
2. Push to GitHub
3. Automatic deployment triggers
4. Wait 2-3 minutes
5. Visit staging URL
6. Test thoroughly

**What to test:**
- ✅ New features work as expected
- ✅ Existing features still work
- ✅ Content displays correctly
- ✅ Newsletter signup works (if enabled)
- ✅ Contribution form works
- ✅ Episode pages load
- ✅ Guest pages load
- ✅ Search works
- ✅ Mobile responsiveness
- ✅ Cross-browser compatibility

### Deploy to Production

**Purpose:** Release tested changes to live site

**Prerequisites:**
- ✅ All tests passed on staging
- ✅ Content reviewed and approved
- ✅ No critical bugs
- ✅ Performance acceptable

**Steps:**
1. Merge `staging` branch to `main`
2. Push to GitHub
3. Automatic deployment triggers
4. Wait 2-3 minutes
5. Visit production URL
6. Smoke test critical paths

**Smoke tests (quick validation):**
- ✅ Homepage loads
- ✅ Latest episode visible
- ✅ Navigation works
- ✅ No console errors

---

## Environment Variables

### Production Environment

Add these in your hosting platform's dashboard with **Production** scope:

```bash
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=your_production_token

# Site Configuration
PUBLIC_SITE_URL=https://yourpodcast.com

# Newsletter (Optional)
CONVERTKIT_API_KEY=your_api_key
CONVERTKIT_FORM_ID=your_form_id

# Email Notifications (Optional)
RESEND_API_KEY=your_resend_key
NOTIFICATION_EMAIL=admin@yourpodcast.com

# Analytics (Optional)
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Studio URL (Optional)
STUDIO_URL=https://yourpodcast.sanity.studio
```

### Staging Environment

Add these with **Preview/Staging** scope:

```bash
# Sanity CMS
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=staging  # ← Different dataset
SANITY_TOKEN=your_staging_token  # ← Different token

# Site Configuration
PUBLIC_SITE_URL=https://staging.yourpodcast.com

# Newsletter (Optional) - Use test account
CONVERTKIT_API_KEY=your_test_api_key
CONVERTKIT_FORM_ID=your_test_form_id

# Email Notifications (Optional) - Use test email
RESEND_API_KEY=your_resend_key
NOTIFICATION_EMAIL=staging-test@yourpodcast.com

# Analytics (Optional) - Use separate property
GA_MEASUREMENT_ID=G-YYYYYYYYYY

# Studio URL (Optional)
STUDIO_URL=https://yourpodcast.sanity.studio
```

### Security Best Practices

- ✅ **Never commit secrets** to Git (use `.env.local`, not `.env`)
- ✅ **Use separate tokens** for staging and production
- ✅ **Rotate tokens** periodically (every 90 days)
- ✅ **Limit token permissions** (use Viewer for read-only access)
- ✅ **Use test accounts** for staging (ConvertKit, email, analytics)
- ✅ **Enable 2FA** on all service accounts

---

## Custom Domains

### Cloudflare Pages

**Production Domain:**

1. **Go to your Pages project**
2. **Click "Custom domains"**
3. **Click "Set up a custom domain"**
4. **Enter your domain:** `yourpodcast.com`
5. **Follow DNS instructions:**
   - Add CNAME record: `yourpodcast.com` → `yourpodcast-production.pages.dev`
   - Or use Cloudflare's automatic DNS (if domain registered with Cloudflare)
6. **Wait for SSL certificate** (automatic, 1-5 minutes)
7. **Verify:** Visit https://yourpodcast.com

**Staging Subdomain:**

1. **Click "Set up a custom domain"** again
2. **Enter staging subdomain:** `staging.yourpodcast.com`
3. **Add DNS record:**
   - CNAME: `staging` → `staging.yourpodcast-production.pages.dev`
4. **Wait for SSL**
5. **Verify:** Visit https://staging.yourpodcast.com

**WWW Redirect (Optional):**

Add `www.yourpodcast.com` as custom domain, and Cloudflare will redirect to apex.

---

### Vercel

1. **Go to project → Settings → Domains**
2. **Add domain:** `yourpodcast.com`
3. **Configure DNS:**
   - CNAME: `yourpodcast.com` → `cname.vercel-dns.com`
4. **Vercel auto-configures SSL**

---

### Netlify

1. **Go to site → Domain settings**
2. **Add custom domain**
3. **Configure DNS:**
   - CNAME: `yourpodcast.com` → `yoursite.netlify.app`
4. **Enable HTTPS** (automatic)

---

## Testing & Validation

### Pre-Deployment Checklist

Before every production deployment:

**Content Validation:**
- [ ] All episodes have correct metadata (title, description, audio URL)
- [ ] Episode numbers are sequential
- [ ] Publish dates are correct
- [ ] Guest information is complete
- [ ] Host information is current
- [ ] Podcast metadata is accurate (name, description, logo)

**Configuration Validation:**
- [ ] Theme is configured and active
- [ ] Homepage config is active
- [ ] About page config exists (if using)
- [ ] Newsletter is configured (if enabled)
- [ ] Social links are correct
- [ ] RSS feed URL is correct

**Technical Validation:**
- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Lighthouse score > 90 (performance, accessibility)
- [ ] Mobile responsive
- [ ] Cross-browser tested (Chrome, Safari, Firefox)

**Integration Validation:**
- [ ] ConvertKit integration works
- [ ] Email notifications work
- [ ] Google Analytics tracking
- [ ] RSS feed validates
- [ ] Sitemap generates correctly
- [ ] Robots.txt is correct

### Post-Deployment Validation

After deploying to production:

**Smoke Tests (Immediate):**
- [ ] Homepage loads without errors
- [ ] Latest episode is visible
- [ ] Navigation works
- [ ] Newsletter signup works
- [ ] Contribution form works
- [ ] Episode pages load
- [ ] Guest pages load
- [ ] About page loads
- [ ] RSS feed accessible
- [ ] Sitemap accessible

**Thorough Tests (Within 24 hours):**
- [ ] Test from multiple devices
- [ ] Test from multiple browsers
- [ ] Test newsletter subscription
- [ ] Test form submissions
- [ ] Check Google Search Console for errors
- [ ] Check analytics tracking
- [ ] Check page load times
- [ ] Check mobile responsiveness
- [ ] Check accessibility (screen readers, keyboard nav)

---

## Rollback Procedures

### Emergency Rollback (< 5 minutes)

If critical bug deployed to production:

**Option 1: Revert via Git**

```bash
# Find the last working commit
git log --oneline -10

# Revert to that commit
git checkout main
git revert HEAD  # Or git revert <commit-hash>
git push origin main
# Platform automatically redeploys in 2-3 minutes
```

**Option 2: Platform Rollback (Cloudflare Pages)**

1. Go to Cloudflare Dashboard → Your project
2. Click "View build history"
3. Find last successful deployment
4. Click "⋯" → "Rollback to this deployment"
5. Confirm
6. Site reverts immediately

**Option 3: Platform Rollback (Vercel)**

1. Go to Vercel dashboard → Deployments
2. Find last successful deployment
3. Click "⋯" → "Promote to production"
4. Site reverts immediately

**Option 4: Platform Rollback (Netlify)**

1. Go to Netlify site dashboard → Deploys
2. Find last successful deploy
3. Click "Publish deploy"
4. Site reverts immediately

### Scheduled Rollback (Non-urgent)

1. Create hotfix branch
2. Fix the bug
3. Test on staging
4. Deploy to production normally

---

## Monitoring & Analytics

### Google Analytics 4

**Setup:**

1. **Create GA4 property** at [analytics.google.com](https://analytics.google.com)
2. **Get Measurement ID** (format: G-XXXXXXXXXX)
3. **Add to environment variables:**
   ```bash
   GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. **Deploy**
5. **Verify tracking** in GA4 Realtime view

**Key Metrics to Monitor:**
- Page views
- User sessions
- Bounce rate
- Episode page views
- Newsletter signups
- Contribution submissions
- Average session duration
- Traffic sources

### Cloudflare Analytics

**Built-in** for Cloudflare Pages:
- Page views
- Unique visitors
- Bandwidth usage
- Geographic distribution
- Most popular pages
- Referrer sources

**Access:** Cloudflare Dashboard → Your project → Analytics

### Error Monitoring (Optional)

**Recommended: Sentry**

```bash
npm install @sentry/astro @sentry/node
```

Add to environment variables:
```bash
SENTRY_DSN=your_sentry_dsn
```

Configure in `astro.config.mjs` (see Sentry Astro docs).

### Uptime Monitoring (Optional)

Free tools:
- [UptimeRobot](https://uptimerobot.com) - Free for 50 monitors
- [Pingdom](https://www.pingdom.com) - Free tier available
- [Freshping](https://www.freshworks.com/website-monitoring/) - Free for 50 URLs

Set alerts for:
- Website down (HTTP 500/502/503)
- Slow response time (> 3 seconds)
- SSL certificate expiration

---

## Troubleshooting

### Build Failures

**Error: "Missing environment variables"**

**Solution:**
1. Check environment variables in platform dashboard
2. Verify all required variables are set (see [Environment Variables](#environment-variables))
3. Ensure variables have correct scope (Production/Preview)
4. Retry deployment

**Error: "Module not found"**

**Solution:**
1. Check `package.json` for missing dependencies
2. Run `npm install` locally
3. Commit `package-lock.json`
4. Push and retry

**Error: "TypeScript errors"**

**Solution:**
1. Run `npm run build` locally to see errors
2. Fix TypeScript errors
3. Commit and push

### Runtime Errors

**Error: "Missing Sanity project ID"**

**Solution:**
1. Verify `PUBLIC_SANITY_PROJECT_ID` is set in environment variables
2. Check variable scope (Production vs Preview)
3. Redeploy

**Error: "No episodes found"**

**Solution:**
1. Check Sanity dataset is correct
2. Verify episodes exist in that dataset
3. Check episodes are published (not drafts)
4. Verify API token has read permissions

**Error: "Newsletter signup fails"**

**Solution:**
1. Check ConvertKit API key is valid
2. Verify form ID is correct
3. Check `newsletterEnabled: true` in Sanity podcast document
4. Test API credentials in ConvertKit dashboard

### Performance Issues

**Slow page loads (> 3 seconds)**

**Solutions:**
1. Enable CDN caching (automatic on all platforms)
2. Optimize images (use Sanity image pipeline)
3. Reduce JavaScript bundle size
4. Enable Astro view transitions
5. Check Lighthouse report for specific issues

**High bandwidth usage**

**Solutions:**
1. Compress images (WebP format)
2. Use Sanity CDN for images
3. Enable lazy loading for images
4. Reduce audio file sizes (use MP3 at 128kbps for stereo)

---

## Support & Resources

**Framework Documentation:**
- [Main Repository](https://github.com/rejected-media/podcast-framework)
- [Component Reference](https://github.com/rejected-media/podcast-framework/blob/main/packages/core/COMPONENTS.md)
- [CLI Documentation](https://github.com/rejected-media/podcast-framework/blob/main/packages/cli/README.md)

**Platform Documentation:**
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Astro Docs](https://docs.astro.build/)
- [Sanity Docs](https://www.sanity.io/docs)

**Community:**
- [GitHub Issues](https://github.com/rejected-media/podcast-framework/issues)
- [GitHub Discussions](https://github.com/rejected-media/podcast-framework/discussions)

---

**Happy deploying! 🚀**
