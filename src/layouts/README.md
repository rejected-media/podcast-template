# Layouts

This folder contains layout components for your podcast website.

## BaseLayout.astro

**The main layout wrapper for all pages.**

### Important: Always Use the Local Wrapper

When creating new pages, **always import BaseLayout from this folder**, not from the framework package:

```astro
✅ Correct:
import BaseLayout from '../layouts/BaseLayout.astro';

❌ Wrong (will break CSS):
import BaseLayout from '@rejected-media/podcast-framework-core/layouts/BaseLayout.astro';
```

### Why?

The framework's `BaseLayout` is intentionally CSS-agnostic to support any styling approach. Your local `BaseLayout.astro` wrapper:

1. **Imports your CSS** (`../styles/global.css`) - includes Tailwind and custom styles
2. **Wraps the framework's BaseLayout** - provides SEO, analytics, Header, Footer
3. **Gives you control** - customize which styles load without modifying framework code

### Architecture

```
Your Page
  └─ src/layouts/BaseLayout.astro (your wrapper)
      ├─ Imports ../styles/global.css
      └─ Wraps @rejected-media/podcast-framework-core/layouts/BaseLayout.astro
          ├─ Handles SEO meta tags
          ├─ Loads Google Analytics
          ├─ Injects theme CSS variables
          ├─ Renders Header component
          └─ Renders Footer component
```

### Customizing

You can customize the wrapper to:
- Import additional CSS files
- Add global scripts
- Modify which components are loaded
- Add custom meta tags

**Example:**
```astro
---
import FrameworkBaseLayout from '@rejected-media/podcast-framework-core/layouts/BaseLayout.astro';
import type { Theme, PodcastInfo } from '@rejected-media/podcast-framework-core';
import '../styles/global.css';
import '../styles/custom.css';  // Add your custom CSS

const props = Astro.props;
---

<FrameworkBaseLayout {...props}>
  <slot name="head" slot="head" />
  <slot />
</FrameworkBaseLayout>
```

## Creating Additional Layouts

You can create additional layout files in this folder for different page types:

```astro
---
// src/layouts/BlogLayout.astro
import BaseLayout from './BaseLayout.astro';
---

<BaseLayout {...Astro.props}>
  <article class="max-w-3xl mx-auto">
    <slot />
  </article>
</BaseLayout>
```

Always build on top of `BaseLayout.astro` to ensure CSS loads correctly.
