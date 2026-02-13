export default {
  name: 'headerFooter',
  title: 'Header & Footer Settings',
  type: 'document',
  fields: [
    // HEADER SECTION
    {
      name: 'headerSection',
      title: 'Header Section',
      type: 'object',
      fields: [
        {
          name: 'logo',
          title: 'Logo',
          type: 'image',
          description: 'Logo displayed in the header navigation',
          options: {
            hotspot: true
          },
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'navigationLinks',
          title: 'Navigation Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Link Name',
                  type: 'string',
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'href',
                  title: 'Link URL',
                  type: 'string',
                  description: 'e.g., /about-us, /contact-us',
                  validation: (Rule: any) => Rule.required()
                }
              ],
              preview: {
                select: {
                  title: 'name',
                  subtitle: 'href'
                }
              }
            }
          ]
        }
      ]
    },

    // FOOTER SECTION
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
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'tagline',
          title: 'Tagline/Description',
          type: 'text',
          rows: 3,
          initialValue: '"Capturing a jiffy that lasts forever." We specialize in premium event entertainment that brings people together.',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'socialLinks',
          title: 'Social Media Links',
          type: 'object',
          fields: [
            {
              name: 'instagram',
              title: 'Instagram URL',
              type: 'url',
              validation: (Rule: any) => Rule.uri({
                scheme: ['http', 'https']
              })
            },
            {
              name: 'tiktok',
              title: 'TikTok URL',
              type: 'url',
              validation: (Rule: any) => Rule.uri({
                scheme: ['http', 'https']
              })
            },
            {
              name: 'xiaohongshu',
              title: 'Xiaohongshu URL',
              type: 'url',
              validation: (Rule: any) => Rule.uri({
                scheme: ['http', 'https']
              })
            }
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

    // WHATSAPP SETTINGS
    {
      name: 'whatsappSettings',
      title: 'WhatsApp Settings',
      type: 'object',
      fields: [
        {
          name: 'whatsappNumber',
          title: 'WhatsApp Number',
          type: 'string',
          description: 'Format: country code + number (e.g., 60163966562)',
          validation: (Rule: any) => Rule.required().regex(/^[0-9]+$/, {
            name: 'phone number'
          }).error('Must be numbers only, no spaces or symbols')
        },
        {
          name: 'defaultMessage',
          title: 'Default WhatsApp Message',
          type: 'text',
          initialValue: "Hi Jiffy Booth! I'd like to enquire...",
          description: 'Message that opens when clicking the WhatsApp button',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'floatingMessage',
          title: 'Floating Message Box Text',
          type: 'text',
          initialValue: "Hi, want to make your event amazing?",
          description: 'Message displayed in the floating box above WhatsApp button',
          validation: (Rule: any) => Rule.required()
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Header & Footer Settings'
      }
    }
  }
}