import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mainPage',
  title: 'Main Page Content',
  type: 'document',
  fields: [
    // --- HERO SECTION ---
    defineField({
      name: 'heroLogo',
      title: 'Hero Brand Logo',
      type: 'image',
      description: 'Upload the Jiffy logo to appear above the main title',
      options: { hotspot: true }
    }),

    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'heroBio',
      title: 'Hero Tagline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // --- NEW: DYNAMIC HERO BACKGROUND FIELDS ---
    defineField({
      name: 'heroBackgroundType',
      title: 'Hero Background Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio', 
      },
      initialValue: 'image',
    }),

    defineField({
      name: 'heroBackgroundImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.heroBackgroundType !== 'image',
    }),

    defineField({
      name: 'heroBackgroundVideo',
      title: 'Hero Background Video',
      type: 'file',
      description: 'Upload an MP4 file for the background',
      options: {
        accept: 'video/mp4',
      },
      hidden: ({ parent }) => parent?.heroBackgroundType !== 'video',
    }),

    // --- TEMPLATES SECTION ---
    defineField({
      name: 'templates',
      title: 'Sample Templates Slider',
      type: 'array',
      options: {
        layout: 'grid', 
      },
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Template Name'},
            {
              name: 'designImage',
              type: 'image',
              title: 'Design Image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {title: 'title', media: 'designImage'},
          },
        },
      ],
    }),

    // --- PARTNER LOGOS (MARQUEE) ---
    defineField({
      name: 'brands',
      title: 'Partner Logos (Dynamic Marquee)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', type: 'string', title: 'Brand Name'},
            {name: 'logo', type: 'image', title: 'Logo File', options: {hotspot: true}},
          ],
        },
      ],
    }),

    // --- EVENT CATEGORIES ---
    defineField({
      name: 'categories',
      title: 'Event Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Category Title',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'subheading',
              type: 'string',
              title: 'Subheading',
              description: 'Optional text below the title',
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'image',
              type: 'image',
              title: 'Category Image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'bgColor',
              type: 'string',
              title: 'Background Color (Hex Code)',
              initialValue: '#ffffff',
              validation: (Rule) =>
                Rule.regex(/^#[0-9A-Fa-f]{6}$/).error('Must be a valid hex color (e.g., #FFC0CB)'),
            },
          ],
        },
      ],
    }),

    // --- TESTIMONIALS SECTION ---
    defineField({
      name: 'testimonials',
      title: 'Client Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', type: 'string', title: 'Client Name'},
            {name: 'text', type: 'text', title: 'Testimonial Text'},
            {
              name: 'rating',
              type: 'number',
              title: 'Star Rating (1-5)',
              initialValue: 5,
              validation: (Rule) => Rule.min(1).max(5).integer(),
            },
          ],
          preview: {
            select: {title: 'name', subtitle: 'text'},
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
  },
})