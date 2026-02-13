export default {
  name: 'photoboothPage',
  title: 'Photobooth Page',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      initialValue: 'Photo Booth',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { 
        hotspot: true 
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'featuredMedia',
      title: 'Featured Media (Photo Booth Samples)',
      type: 'object',
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
          validation: (Rule: any) => Rule.required()
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
    },
    {
      name: 'features',
      title: 'Features Provided',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { 
            name: 'title', 
            type: 'string', 
            title: 'Feature Title',
            validation: (Rule: any) => Rule.required()
          },
          {
          name: 'iconName',
          type: 'string',
          title: 'Icon Name',
          description: 'Enter any Lucide icon name (e.g., Camera, Monitor, Download, Users, Sparkles). See: https://lucide.dev/icons',
          validation: (Rule: any) => Rule.required()
          }
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'iconName'
          }
        }
      }],
      validation: (Rule: any) => Rule.required().min(1)
    },

    // --- OUR SET UP SECTION ---
    {
      name: 'setupTitle',
      title: 'Set Up Section — Title',
      type: 'string',
      description: 'Heading shown above the set-up layout (e.g. "Our Set Up")',
      initialValue: 'Our Set Up',
    },
    {
      name: 'setupImage',
      title: 'Set Up Section — Image',
      type: 'image',
      description: 'Landscape image displayed on the left (recommended: 4:3 ratio)',
      options: { hotspot: true },
    },
    {
      name: 'setupDescription',
      title: 'Set Up Section — Description',
      type: 'text',
      description: 'Optional paragraph shown above the requirements list',
    },
    {
      name: 'setupRequirements',
      title: 'Set Up Section — Requirements List',
      type: 'array',
      description: 'Bullet-point list items (e.g. "Indoor", "4m x 4m space")',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'item',
              type: 'string',
              title: 'Requirement',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'item' },
          },
        },
      ],
    },
    // --- END: OUR SET UP SECTION ---

    {
      name: 'backdropColors',
      title: 'Backdrop Colors',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { 
            name: 'name', 
            type: 'string', 
            title: 'Color Name',
            validation: (Rule: any) => Rule.required()
          },
          { 
            name: 'hex', 
            type: 'string', 
            title: 'Hex Code',
            description: 'Include the # symbol (e.g., #E5E4E2)',
            validation: (Rule: any) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
              name: 'hex color',
              invert: false
            }).error('Must be a valid hex color (e.g., #E5E4E2)')
          },
          {
            name: 'image',
            type: 'image',
            title: 'Backdrop Image',
            description: 'Upload an image showing this backdrop color',
            options: {
              hotspot: true
            },
            validation: (Rule: any) => Rule.required()
          }
        ],
        preview: {
          select: {
            title: 'name',
            subtitle: 'hex',
            media: 'image'
          }
        }
      }],
      validation: (Rule: any) => Rule.required().min(1)
    },
    {
      name: 'templates',
      title: 'Sample Templates',
      type: 'array',
      of: [{ 
        type: 'image', 
        title: 'Template Image',
        options: {
          hotspot: true
        }
      }],
      description: 'Upload sample template images for the slider'
    },
    {
      name: 'addOns',
      title: 'Optional Add-Ons',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            type: 'string',
            title: 'Add-On Title',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'description',
            type: 'text',
            title: 'Description',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'image',
            type: 'image',
            title: 'Add-On Image',
            description: 'Upload an image for this add-on',
            options: {
              hotspot: true
            },
            validation: (Rule: any) => Rule.required()
          }
        ],
        preview: {
          select: {
            title: 'title',
            media: 'image'
          }
        }
      }],
      validation: (Rule: any) => Rule.min(1)
    }
  ],
  preview: {
    select: {
      title: 'heroTitle'
    }
  }
}