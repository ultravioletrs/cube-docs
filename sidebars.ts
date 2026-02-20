import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // --- Core docs ---
    'intro',
    'getting-started',
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
        'developer-guide/cvm-management',
        'developer-guide/custom-model-deployment',
        'developer-guide/fine-tuning',
        'developer-guide/auth-and-request-flow',
      ],
    },

    // --- UI ---
    {
      type: 'category',
      label: 'UI',
      items: [
        'ui/overview',
        'ui/domains',
        'ui/user-actions',
      ],
    },

    // --- Security & Access ---
    {
      type: 'category',
      label: 'Security & Access',
      items: [
        'security/roles-and-access-control',
        'security/audit-logs',
      ],
    },
  ],
};

export default sidebars;
