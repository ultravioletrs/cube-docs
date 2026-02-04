import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
import math from 'remark-math';
import katex from 'rehype-katex';

const config: Config = {
    title: 'Cube AI',
    tagline: 'Framework for building GPT-based AI applications using confidential computing',
    favicon: 'img/logo.png',

    // Set the production url of your site here
    url: 'https://docs.cube.ultraviolet.rs',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'ultravioletrs', // Usually your GitHub org/user name.
    projectName: 'cube-docs', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    markdown: {
        mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],

    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    routeBasePath: '/',
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/ultravioletrs/cube-docs/tree/main/',
                    remarkPlugins: [math],
                    rehypePlugins: [katex],
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    stylesheets: [
        {
            href: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
            type: 'text/css',
            integrity:
                'sha384-KI1CcbBaGdBrw9FjD0oaWZ8i3tYtU4WnFGOwJKhRZ7QkKQ+0r8zAaepK3QKX5F2y',
            crossorigin: 'anonymous',
        }
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            logo: {
                alt: 'Cube AI Logo',
                src: 'img/logos/altLogo.svg',
                srcDark: 'img/logos/sidebarLogo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Docs',
                },
                {
                    href: 'https://www.ultraviolet.rs/blog/?category=cube+ai',
                    label: 'Blog',
                    position: 'left',
                },
                {
                    href: 'https://github.com/ultravioletrs/cube',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Docs',
                            to: '/',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'X',
                            href: 'https://x.com/ultravioletrs',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/ultravioletrs/cube',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} Cube AI, Inc. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
