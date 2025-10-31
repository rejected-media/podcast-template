# Security

## Known Low-Severity Dependencies

### npm Audit Warnings (10 low-severity)

If you run `npm audit`, you'll see **10 low-severity warnings** related to the Sanity CMS dependency tree. These are known, documented, and **not a security concern** for this project.

**Summary:**
- **Severity:** Low (CVSS 2.9/10)
- **Package:** `min-document@2.19.0` (unmaintained package deep in Sanity's dependency chain)
- **Vulnerability:** Prototype pollution (CVE-2025-57352)
- **Exploitation Probability:** <0.1% (EPSS score: 0.065%)
- **Impact:** None for podcast websites (only affects server-side CMS tooling)
- **Status:** Awaiting upstream fix from Sanity

### Why This Is Low Risk

1. **Very low severity** - CVSS score of 2.9/10
2. **Extremely unlikely to be exploited** - Less than 0.1% probability
3. **Not user-facing** - Only affects Sanity Studio backend, not your public website
4. **No practical attack vector** - Would require server-side access and specific conditions
5. **Server-side only** - Runs in development/build tools, not production site code
6. **Unmaintained source** - The vulnerable package (`min-document`) has been officially deprecated by its author since 2016

### What's Happening

The issue originates from this dependency chain:

```
sanity@4.12.0 (latest stable version)
└── get-random-values-esm@1.0.2 (Sanity-maintained wrapper)
    └── get-random-values@1.2.2 (outdated version from 2017)
        └── global@4.4.0
            └── min-document@2.19.0 ← VULNERABLE (abandoned package)
```

All 10 warnings cascade from this single abandoned package that Sanity transitively depends on.

### Why We Can't Fix It

- **npm audit fix --force** would downgrade Sanity v4 → v2 (major breaking change, loses all v4 features)
- **Dependency overrides** could break Sanity Studio in unexpected ways
- **Forking and maintaining** would require updating with every Sanity release

The fix requires Sanity to update their `get-random-values-esm` package to use `get-random-values@^4.1.0` (which eliminates the `min-document` dependency entirely).

### What We're Doing

✅ **Documented** - This security analysis ensures awareness
✅ **Monitoring** - Checking Sanity updates monthly for fixes
✅ **Risk accepted** - Low severity and low probability don't warrant breaking changes
✅ **No user impact** - Your podcast listeners are not affected

### For Security Audits

If you need to explain these warnings to security auditors or compliance teams:

> "We've identified 10 low-severity npm audit warnings in our Sanity CMS dependencies, all originating from a single unmaintained package (min-document) deep in the dependency tree. After thorough security analysis, these pose minimal risk (CVSS 2.9/10, <0.1% exploitation probability) and only affect server-side development tools, not the public-facing website. We're monitoring for upstream fixes from Sanity and will apply updates when available. Full analysis available in SECURITY.md."

### Technical Details

For a comprehensive technical analysis including:
- Full CVE details and CVSS scoring
- Complete dependency chain analysis
- Root cause explanation
- Alternative mitigation options
- Decision rationale

See: `/tmp/SECURITY_ANALYSIS.md` (development environment only)

### Review Schedule

This security assessment is reviewed **quarterly** or whenever:
- Sanity releases major/minor version updates
- npm audit reports new vulnerabilities
- Severity level changes

**Last Review:** October 31, 2025
**Next Review:** January 31, 2026
**Status:** No action required ✅

---

## Reporting Security Issues

If you discover a security vulnerability in the **Podcast Framework** (not dependencies):

1. **Do NOT open a public GitHub issue**
2. Email security concerns to: [Your security email]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

We'll respond within 48 hours and work with you on a fix and disclosure timeline.

---

## Security Best Practices

When deploying this template:

### Environment Variables
- ✅ Never commit `.env` files to version control
- ✅ Use different tokens for staging and production
- ✅ Rotate API tokens quarterly
- ✅ Use Sanity Editor role tokens (not Admin) for API routes
- ✅ Keep `RESEND_API_KEY` and other secrets secure

### Sanity CMS
- ✅ Enable Two-Factor Authentication on your Sanity account
- ✅ Use viewer tokens for public read-only access
- ✅ Use write tokens only for authenticated API routes
- ✅ Audit Sanity project members regularly
- ✅ Review CORS settings in Sanity API configuration

### Deployment
- ✅ Enable HTTPS/SSL (automatic on Cloudflare/Vercel/Netlify)
- ✅ Configure Content Security Policy headers
- ✅ Use platform-provided DDoS protection
- ✅ Enable platform security features (Cloudflare WAF, etc.)
- ✅ Monitor deployment logs for suspicious activity

### Updates
- ✅ Run `npm audit` monthly
- ✅ Update framework packages when available: `npm update @rejected-media/podcast-framework-core`
- ✅ Update Astro and other dependencies: `npm update`
- ✅ Test updates in staging before deploying to production

---

## Dependencies Security Status

| Package | Version | Status |
|---------|---------|--------|
| Astro | 5.x | ✅ Up to date |
| Sanity | 4.12.0 | ✅ Latest stable (10 low-severity transitive deps) |
| @rejected-media/podcast-framework-core | 0.1.7 | ✅ Latest |
| Tailwind CSS | 4.x | ✅ Up to date |
| React | 19.x | ✅ Up to date |

**Overall Security Posture:** ✅ Good

All direct dependencies are up to date. The 10 low-severity warnings are transitive dependencies from Sanity that pose no practical risk.

---

**Last Updated:** October 31, 2025
**Maintained By:** [Your team/name]
