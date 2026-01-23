import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // --- Core docs ---
    'intro',
    'getting-started',
    'ui/ui-overview', 
    'architecture',
    'guardrails',

    // --- Platform internals ---
    {
      type: 'category',
      label: 'Platform Internals',
      items: [
        'vllm',
        'attestation',
      ],
    },

    // --- API documentation ---
    {
      type: 'category',
      label: 'API',
      items: [
        'api/overview',
        'api/authentication',
        'auth/pats', 
        'api/models',
        'api/chat-completions',
        'api/completions',
        'api/embeddings',
        'api/speech-to-text',
        'api/translations',
        'api/routes',
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
        'developer-guide/auth-and-request-flow',
      ],
    },
  ],
};

export default sidebars;
