import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'User Guide',
      items: [
        'intro',
        'user/getting-started',
        'user/guardrails',
        {
          type: 'category',
          label: 'UI',
          items: [
            'user/ui/overview',
            'user/ui/domains',
            'user/ui/user-actions',
          ],
        },
        {
          type: 'category',
          label: 'Security & Access',
          items: [
            'user/security/roles-and-access-control',
            'user/security/audit-logs',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Dev Guide',
      items: [
        'developer/architecture',
        {
          type: 'category',
          label: 'Platform Internals',
          items: [
            'developer/platform/vllm',
            'developer/attestation',
          ],
        },
        {
          type: 'category',
          label: 'API',
          items: [
            'developer/api/overview',
            'developer/api/authentication',
            'developer/auth/pats',
            'developer/api/models',
            'developer/api/chat-completions',
            'developer/api/completions',
            'developer/api/embeddings',
            'developer/api/speech-to-text',
            'developer/api/translations',
            'developer/api/routes',
          ],
        },
        {
          type: 'category',
          label: 'Integrations',
          items: [
            'developer/integrations/continue',
            'developer/integrations/opencode',
          ],
        },
        {
          type: 'category',
          label: 'Developer Guide',
          items: [
            'developer/guide/index',
            'developer/guide/chat-ui',
            'developer/guide/private-model-upload',
            'developer/guide/hal',
            'developer/guide/cvm-management',
            'developer/guide/fine-tuning',
            'developer/guide/auth-and-request-flow',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
