import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 *  - create an ordered group of docs
 *  - render a sidebar for each doc of that group
 *  - provide next/previous navigation
 *
 * The sidebars can be generated from the filesystem, or explicitly defined here.
 *
 * Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // --- Core docs ---
    'intro',
    'getting-started',
    'architecture',
    'guardrails',
    'vllm',
    'attestation',

    // --- API documentation ---
    {
      type: 'category',
      label: 'API',
      items: [
        'api/overview',
        'api/authentication',
        'api/models',
        'api/chat-completions',
        'api/completions',
        'api/embeddings',
        'api/speech-to-text',
        'api/translations',
      ],
    },

    // --- Integrations ---
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/continue',
        'integrations/opencode',
      ],
    },

    // --- Developer Guide ---
    {
      type: 'category',
      label: 'Developer Guide',
      items: [
        'developer-guide/index',
        'developer-guide/chat-ui',
        'developer-guide/private-model-upload',
        'developer-guide/hal',
        'developer-guide/fine-tuning',
      ],
    },
  ],
};

export default sidebars;
