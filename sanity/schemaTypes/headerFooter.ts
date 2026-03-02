export default {
  name: 'headerFooter',
  title: 'Header & Footer Settings',
  type: 'document',
  fields: [
    // --- HEADER SECTION ---
    {
      name: 'headerSection',
      title: 'Header Section',
      type: 'object',
      fields: [
        {
          name: 'logo',
          title: 'Logo',
          type: 'image',
          options: { hotspot: true },
          validation: (rule: any) => rule.required()
        },
        {
          name: 'navigationLinks',
          title: 'Navigation Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', title: 'Link Name', type: 'string', validation: (rule: any) => rule.required() },
                { name: 'href', title: 'Link URL', type: 'string', validation: (rule: any) => rule.required() }
              ]
            }
          ]
        }
      ]
    },

    // --- FOOTER SECTION ---
    {
      name: 'footerSection',
      title: 'Footer Section',
      type: 'object',
      fields: [
        {
          name: 'companyName',
          title: 'Company Name',
          type: 'string',
          initialValue: 'Jiffy Booth',
          validation: (rule: any) => rule.required()
        },
        {
          name: 'tagline',
          title: 'Tagline/Description',
          type: 'text',
          rows: 3,
          initialValue: '"Capturing a jiffy that lasts forever."',
          validation: (rule: any) => rule.required()
        },
        {
          name: 'footerLinks',
          title: 'Footer Our Services Links',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'ourServices' }] 
            }
          ]
        },
        {
          name: 'socialLinks',
          title: 'Social Media Links',
          type: 'object',
          fields: [
            { name: 'instagram', title: 'Instagram URL', type: 'url' },
            { name: 'tiktok', title: 'TikTok URL', type: 'url' },
            { name: 'xiaohongshu', title: 'Xiaohongshu URL', type: 'url' }
          ]
        },
        {
          name: 'copyrightText',
          title: 'Copyright Text',
          type: 'string',
          initialValue: '© 2026 Jiffy Ventures. All rights reserved.'
        }
      ]
    },

    // --- WHATSAPP SETTINGS ---
    {
      name: 'whatsappSettings',
      title: 'WhatsApp Settings',
      type: 'object',
      fields: [
        {
          name: 'whatsappNumber',
          title: 'WhatsApp Number',
          type: 'string',
          validation: (rule: any) => rule.required()
        },
        {
          name: 'defaultMessage',
          title: 'Default WhatsApp Message',
          type: 'text',
          validation: (rule: any) => rule.required()
        },
        {
          name: 'floatingMessage',
          title: 'Floating Message Box Text',
          type: 'text',
          validation: (rule: any) => rule.required()
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return { title: 'Header & Footer Settings' }
    }
  }
}