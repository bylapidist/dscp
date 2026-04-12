import { defineConfig } from 'vitepress';

const guideSidebar = [
  {
    text: 'Get started',
    items: [
      { text: 'Introduction', link: '/introduction' },
      { text: 'Installation', link: '/installation' },
      { text: 'Quickstart', link: '/quickstart' },
    ],
  },
  {
    text: 'Reference',
    items: [
      { text: 'Specification', link: '/spec' },
      { text: 'DSCPDocument shape', link: '/document' },
      { text: 'Generator API', link: '/generator' },
      { text: 'Type guards', link: '/guards' },
      { text: 'DESIGN_SYSTEM.md format', link: '/markdown' },
      { text: 'API reference', link: '/api' },
      { text: 'Changelog guide', link: '/changelog-guide' },
    ],
  },
];

export default defineConfig({
  title: 'dscp',
  description:
    'Design System Context Protocol — versioned spec and types for communicating design system constraints to generative AI models.',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: 'https://dscp.lapidist.net' },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/introduction' },
      { text: 'Spec', link: '/spec' },
      { text: 'API', link: '/api' },
    ],
    sidebar: {
      '/': guideSidebar,
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/bylapidist/dscp' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Lapidist contributors',
    },
    editLink: {
      pattern: 'https://github.com/bylapidist/dscp/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
