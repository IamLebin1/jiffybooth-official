import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'ourServices',
  title: 'Our Services',
  type: 'document',
  fields: [
    // --- 1. LISTING GRID INFORMATION (Required for the main page) ---
    defineField({ 
      name: 'title', 
      title: 'Service Title', 
      type: 'string',
      description: 'The name shown on the services listing grid.',
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'slug', 
      title: 'Slug', 
      type: 'slug', 
      options: { source: 'title' },
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'description', 
      title: 'Service Description (Grid View)', 
      type: 'text',
      rows: 3,
      description: 'Short summary shown on the main services listing card.'
    }),
    defineField({ 
      name: 'image', 
      title: 'Main Service Image (Grid View)', 
      type: 'image',
      description: 'The primary image shown on the listing card.',
      options: { hotspot: true }
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Sort order on the main grid (1, 2, 3...)',
      validation: Rule => Rule.required()
    }),
    defineField({ 
      name: 'accentColor', 
      title: 'Card Accent Color', 
      type: 'string', 
      description: 'Hex code for the card background (e.g., #f5ebe0).',
      initialValue: '#f5ebe0' 
    }),
    
    // --- 2. DETAIL PAGE HERO SECTION (Required) ---
    defineField({
      name: 'heroTitle',
      title: 'Detail Page Hero Title',
      type: 'string',
      description: 'Large title at the top of the detail page. If empty, uses Service Title.',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'Text below the hero title. If empty, the website will show the Service Title.',
    }),
    defineField({
      name: 'heroBackgroundImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Large background image for the top section.',
      options: { hotspot: true },
    }),

    // --- 3. FEATURED MEDIA SECTION (Optional) ---
    defineField({
      name: 'featuredMedia',
      title: 'Featured Media (Showcase)',
      type: 'object',
      description: 'Sample showcase image or video below the hero.',
      fields: [
        {
          name: 'mediaType',
          title: 'Media Type',
          type: 'string',
          options: {
            list: [
              { title: 'Image', value: 'image' },
              { title: 'Video', value: 'video' }
            ],
            layout: 'radio'
          },
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }: any) => parent?.mediaType !== 'image'
        },
        {
          name: 'videoUrl',
          title: 'Video URL',
          type: 'url',
          description: 'YouTube, Vimeo, or direct video URL',
          hidden: ({ parent }: any) => parent?.mediaType !== 'video'
        }
      ]
    }),

    // --- 4. FEATURES SECTION (Optional) ---
    defineField({
      name: 'features',
      title: 'Features Provided',
      type: 'array',
      description: 'Icon + text features. Leave empty to hide this section.',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', type: 'string', title: 'Feature Title' },
          {
            name: 'iconName',
            type: 'string',
            title: 'Icon Name',
            description: 'Enter Lucide icon name (e.g., Camera, Mic, Monitor).',
          }
        ],
        preview: { select: { title: 'title', subtitle: 'iconName' } }
      }],
    }),

    // --- 5. DYNAMIC SECTIONS (New!) ---
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Drag to reorder sections. Add preset sections or create custom ones.',
      of: [
        // Setup Section
        {
          type: 'object',
          name: 'setupSection',
          title: 'Setup Section',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'setup',
              hidden: true
            },
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              initialValue: 'Our Set Up',
            },
            {
              name: 'backgroundColor',
              type: 'string',
              title: 'Background Color',
              options: {
                list: [
                  { title: 'White', value: '#FFFFFF' },
                  { title: 'Light Grey', value: '#F9FAFB' },
                  { title: 'Custom', value: 'custom' }
                ],
                layout: 'radio'
              },
              initialValue: '#F9FAFB'
            },
            {
              name: 'customBackgroundColor',
              type: 'string',
              title: 'Custom Background Color (Hex Code)',
              description: 'Enter hex code (e.g., #f5ebe0)',
              hidden: ({ parent }: any) => parent?.backgroundColor !== 'custom'
            },
            {
              name: 'image',
              type: 'image',
              title: 'Setup Image',
              options: { hotspot: true },
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              rows: 4
            },
            {
              name: 'requirements',
              type: 'array',
              title: 'Requirements List',
              of: [{ 
                type: 'object', 
                fields: [{ name: 'item', type: 'string', title: 'Requirement' }],
                preview: { select: { title: 'item' } }
              }],
            }
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image'
            },
            prepare({ title, media }) {
              return {
                title: title || 'Setup Section',
                subtitle: 'Setup information and requirements',
                media
              }
            }
          }
        },

        // Backdrop Selection Section
        {
          type: 'object',
          name: 'backdropSection',
          title: 'Backdrop Selection',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'backdrop',
              hidden: true
            },
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              initialValue: 'Crafting your Moment',
            },
            {
              name: 'backgroundColor',
              type: 'string',
              title: 'Background Color',
              options: {
                list: [
                  { title: 'White', value: '#FFFFFF' },
                  { title: 'Light Grey', value: '#F9FAFB' },
                  { title: 'Custom', value: 'custom' }
                ],
                layout: 'radio'
              },
              initialValue: '#FFFFFF'
            },
            {
              name: 'customBackgroundColor',
              type: 'string',
              title: 'Custom Background Color (Hex Code)',
              hidden: ({ parent }: any) => parent?.backgroundColor !== 'custom'
            },
            {
              name: 'backdropColors',
              type: 'array',
              title: 'Backdrop Options',
              of: [{
                type: 'object',
                fields: [
                  { name: 'name', type: 'string', title: 'Color Name' },
                  { name: 'hex', type: 'string', title: 'Hex Code' },
                  { name: 'image', type: 'image', title: 'Backdrop Image', options: { hotspot: true } }
                ],
                preview: { select: { title: 'name', subtitle: 'hex', media: 'image' } }
              }]
            }
          ],
          preview: {
            select: {
              title: 'title',
              count: 'backdropColors.length'
            },
            prepare({ title, count }) {
              return {
                title: title || 'Backdrop Selection',
                subtitle: `${count || 0} backdrop options`
              }
            }
          }
        },

        // Templates Section
        {
          type: 'object',
          name: 'templatesSection',
          title: 'Customizable Templates',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'templates',
              hidden: true
            },
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              initialValue: 'Customisable Templates',
            },
            {
              name: 'subtitle',
              type: 'string',
              title: 'Subtitle',
              initialValue: 'Personalize your experience with our variety of professional templates.',
            },
            {
              name: 'backgroundColor',
              type: 'string',
              title: 'Background Color',
              options: {
                list: [
                  { title: 'White', value: '#FFFFFF' },
                  { title: 'Light Grey', value: '#F9FAFB' },
                  { title: 'Custom', value: 'custom' }
                ],
                layout: 'radio'
              },
              initialValue: '#FFFFFF'
            },
            {
              name: 'customBackgroundColor',
              type: 'string',
              title: 'Custom Background Color (Hex Code)',
              hidden: ({ parent }: any) => parent?.backgroundColor !== 'custom'
            },
            {
              name: 'templates',
              type: 'array',
              title: 'Template Images',
              of: [{ type: 'image', options: { hotspot: true } }],
            }
          ],
          preview: {
            select: {
              title: 'title',
              count: 'templates.length'
            },
            prepare({ title, count }) {
              return {
                title: title || 'Templates Section',
                subtitle: `${count || 0} templates`
              }
            }
          }
        },

        // Add-Ons Section
        {
          type: 'object',
          name: 'addOnsSection',
          title: 'Optional Add-Ons',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'addons',
              hidden: true
            },
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              initialValue: 'Optional Add-Ons',
            },
            {
              name: 'backgroundColor',
              type: 'string',
              title: 'Background Color',
              options: {
                list: [
                  { title: 'White', value: '#FFFFFF' },
                  { title: 'Light Grey', value: '#F9FAFB' },
                  { title: 'Custom', value: 'custom' }
                ],
                layout: 'radio'
              },
              initialValue: '#F9FAFB'
            },
            {
              name: 'customBackgroundColor',
              type: 'string',
              title: 'Custom Background Color (Hex Code)',
              hidden: ({ parent }: any) => parent?.backgroundColor !== 'custom'
            },
            {
              name: 'addOns',
              type: 'array',
              title: 'Add-On Items',
              of: [{
                type: 'object',
                fields: [
                  { name: 'title', type: 'string', title: 'Add-On Title' },
                  { name: 'description', type: 'text', title: 'Description' },
                  { name: 'image', type: 'image', options: { hotspot: true } }
                ],
                preview: { select: { title: 'title', media: 'image' } }
              }],
            }
          ],
          preview: {
            select: {
              title: 'title',
              count: 'addOns.length'
            },
            prepare({ title, count }) {
              return {
                title: title || 'Add-Ons Section',
                subtitle: `${count || 0} add-ons`
              }
            }
          }
        },

        // NEW: Carousel Section
        {
          type: 'object',
          name: 'carouselSection',
          title: 'Carousel Gallery',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'carousel',
              hidden: true
            },
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              initialValue: 'Gallery Showcase',
              description: 'Main heading for the carousel section'
            },
            {
              name: 'backgroundColor',
              type: 'string',
              title: 'Background Color',
              options: {
                list: [
                  { title: 'White', value: '#FFFFFF' },
                  { title: 'Light Grey', value: '#F9FAFB' },
                  { title: 'Custom', value: 'custom' }
                ],
                layout: 'radio'
              },
              initialValue: '#F9FAFB'
            },
            {
              name: 'customBackgroundColor',
              type: 'string',
              title: 'Custom Background Color (Hex Code)',
              description: 'Enter hex code (e.g., #f5ebe0)',
              hidden: ({ parent }: any) => parent?.backgroundColor !== 'custom'
            },
            {
              name: 'items',
              type: 'array',
              title: 'Carousel Items',
              description: 'Add images with titles and descriptions for the carousel',
              of: [{
                type: 'object',
                fields: [
                  { 
                    name: 'image', 
                    type: 'image', 
                    title: 'Image',
                    options: { hotspot: true },
                    validation: (Rule: any) => Rule.required()
                  },
                  { 
                    name: 'title', 
                    type: 'string', 
                    title: 'Title',
                    description: 'Optional title for this slide'
                  },
                  { 
                    name: 'description', 
                    type: 'text', 
                    title: 'Description',
                    rows: 2,
                    description: 'Short description (2 lines max recommended)',
                    validation: (Rule: any) => Rule.max(200)
                  }
                ],
                preview: { 
                  select: { 
                    title: 'title', 
                    subtitle: 'description',
                    media: 'image' 
                  },
                  prepare({ title, subtitle, media }) {
                    return {
                      title: title || 'Carousel Item',
                      subtitle: subtitle || 'No description',
                      media
                    }
                  }
                }
              }],
              validation: (Rule: any) => Rule.min(3).warning('At least 3 items recommended for a good carousel experience')
            },
            {
              name: 'autoplay',
              type: 'boolean',
              title: 'Enable Autoplay',
              description: 'Automatically rotate through slides',
              initialValue: true
            },
            {
              name: 'autoplaySpeed',
              type: 'number',
              title: 'Autoplay Speed (ms)',
              description: 'Time between slides in milliseconds (e.g., 4000 = 4 seconds)',
              initialValue: 4000,
              hidden: ({ parent }: any) => !parent?.autoplay
            }
          ],
          preview: {
            select: {
              title: 'title',
              count: 'items.length',
              firstImage: 'items.0.image'
            },
            prepare({ title, count, firstImage }) {
              return {
                title: title || 'Carousel Section',
                subtitle: `${count || 0} carousel items`,
                media: firstImage
              }
            }
          }
        },

        // Custom Content Section
        {
          type: 'object',
          name: 'customSection',
          title: 'Custom Content Section',
          fields: [
            {
              name: 'sectionType',
              type: 'string',
              initialValue: 'custom',
              hidden: true
            },
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
            },
            {
              name: 'backgroundColor',
              type: 'string',
              title: 'Background Color',
              options: {
                list: [
                  { title: 'White', value: '#FFFFFF' },
                  { title: 'Light Grey', value: '#F9FAFB' },
                  { title: 'Custom', value: 'custom' }
                ],
                layout: 'radio'
              },
              initialValue: '#FFFFFF'
            },
            {
              name: 'customBackgroundColor',
              type: 'string',
              title: 'Custom Background Color (Hex Code)',
              hidden: ({ parent }: any) => parent?.backgroundColor !== 'custom'
            },
            {
              name: 'layout',
              type: 'string',
              title: 'Layout',
              options: {
                list: [
                  { title: 'Image Left, Text Right', value: 'image-left' },
                  { title: 'Image Right, Text Left', value: 'image-right' },
                  { title: 'Image Center with Text Below', value: 'image-center' }
                ],
                layout: 'radio'
              },
              initialValue: 'image-left'
            },
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
            },
            {
              name: 'content',
              type: 'text',
              title: 'Content',
              rows: 6
            }
          ],
          preview: {
            select: {
              title: 'title',
              layout: 'layout',
              media: 'image'
            },
            prepare({ title, layout, media }) {
              const layoutLabels: any = {
                'image-left': 'Image Left',
                'image-right': 'Image Right',
                'image-center': 'Image Center'
              }
              return {
                title: title || 'Custom Section',
                subtitle: layoutLabels[layout] || 'Custom layout',
                media
              }
            }
          }
        }
      ]
    }),

    // --- 6. CALL TO ACTION SECTION ---
    defineField({
      name: 'ctaTitle',
      title: 'Call to Action Title',
      type: 'string',
      description: 'The title for the bottom "Enquire Now" section.',
      initialValue: 'Ready to Capture the Moment?',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'image'
    }
  }
})