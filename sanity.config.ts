/**
 * Sanity Studio Configuration
 *
 * This configures your Sanity Studio (CMS admin interface)
 *
 * SETUP REQUIRED:
 * 1. Replace 'your-project-id' with your actual Sanity project ID
 * 2. Update dataset if you're not using 'production'
 * 3. Update the title to match your podcast name
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

// Import base schemas from framework
import {
  episode,
  guest,
  host,
  podcast,
  contribution
} from '@rejected-media/podcast-framework-sanity-schema';

// You can extend schemas with custom fields if needed
// Example:
// import { extendEpisodeSchema } from '@rejected-media/podcast-framework-sanity-schema';
// const customEpisode = extendEpisodeSchema([
//   { name: 'sponsor', type: 'reference', to: [{ type: 'sponsor' }] }
// ]);

export default defineConfig({
  name: 'default',
  title: 'My Podcast', // TODO: Update this

  // Project ID and dataset from environment variables
  // Set these in your .env.local file
  //
  // IMPORTANT: For cloud deployment to sanity.studio, you must replace
  // process.env.SANITY_PROJECT_ID with your actual project ID string
  // Example: projectId: 'abc123xyz',
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool(),
    visionTool() // Useful for testing GROQ queries
  ],

  schema: {
    types: [
      // Framework base schemas
      podcast,
      episode,
      guest,
      host,
      contribution,

      // Add your custom schemas here
      // Example:
      // {
      //   name: 'sponsor',
      //   type: 'document',
      //   fields: [
      //     { name: 'name', type: 'string' },
      //     { name: 'website', type: 'url' }
      //   ]
      // }
    ]
  }
});
