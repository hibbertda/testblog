import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// import customBlocks from 'remark-custom-blocks';
// import markdownRemark from '@astrojs/markdown-remark';
// import remarkHtml from 'remark-html';
// import remarkAttr from 'remark-attr';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.notanexpert.us',
  integrations: [mdx(), sitemap(), tailwind()],
  vite: {
    build: {
      brotliSize: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0];
            }
          }
        }
      }
    }
  },
  // markdown: {
  //   remarkPlugins: [
  //     [customBlocks, {
  //       note: 'note',
  //       warning: 'warning',
  //     }
  //     ]
  //   ]
  // }
});

