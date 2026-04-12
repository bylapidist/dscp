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
      { text: 'Document shape', link: '/document' },
      { text: 'Generator', link: '/generator' },
      { text: 'Markdown output', link: '/markdown' },
      { text: 'Type guards', link: '/guards' },
      { text: 'API', link: '/api' },
      { text: 'Changelog guide', link: '/changelog-guide' },
    ],
  },
];

export default defineConfig({
  title: 'dscp',
  description: 'Design System Context Protocol',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: 'https://dscp.lapidist.net' },
  themeConfig: {
    logo: '/logo.svg',
    outline: { level: [2, 3], label: 'On this page' },
    search: {
      provider: 'local',
    },
    nav: [
      { text: 'Guide', link: '/introduction', activeMatch: '^/(introduction|installation|quickstart)$' },
      { text: 'Spec', link: '/spec', activeMatch: '^/spec' },
      {
        text: 'Reference',
        activeMatch: '^/(document|generator|markdown|guards|api|changelog-guide)',
        items: [
          { text: 'Document shape', link: '/document' },
          { text: 'Generator', link: '/generator' },
          { text: 'Markdown output', link: '/markdown' },
          { text: 'Type guards', link: '/guards' },
          { text: 'API', link: '/api' },
          { text: 'Changelog guide', link: '/changelog-guide' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bylapidist/dscp' },
    ],
    sidebar: {
      '/': guideSidebar,
    },
    editLink: {
      pattern: 'https://github.com/bylapidist/dscp/edit/main/docs/:path',
      text: 'Edit this page',
    },
    lastUpdatedText: 'Last updated',
    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },
    footer: {
      message: 'Released under the MIT License.',
    },
  },
  markdown: {
    headers: {
      level: [2, 3, 4],
    },
  },
});
