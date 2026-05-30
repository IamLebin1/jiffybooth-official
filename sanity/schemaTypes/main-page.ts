              /* eslint-disable @typescript-eslint/no-explicit-any */
              import {defineField, defineType} from 'sanity'

              export default defineType({
                name: 'mainPage',
                title: 'Main Page Content',
                type: 'document',
                fields: [
                  defineField({
                    name: 'heroLogo',
                    title: 'Hero Brand Logo',
                    type: 'image',
                    options: { hotspot: true }
                  }),

                  defineField({
                    name: 'heroTitle',
                    title: 'Hero Title',
                    type: 'string',
                    validation: (rule: any) => rule.required(),
                  }),

                  defineField({
                    name: 'heroBio',
                    title: 'Hero Tagline',
                    type: 'string',
                    validation: (rule: any) => rule.required(),
                  }),

                  defineField({
                    name: 'heroBackgroundType',
                    title: 'Hero Background Type',
                    type: 'string',
                    options: { list: [{ title: 'Image', value: 'image' }, { title: 'Video', value: 'video' }], layout: 'radio' },
                    initialValue: 'image'
                  }),

                  defineField({
                    name: 'heroBackgroundImage',
                    title: 'Hero Background Image',
                    type: 'image',
                    options: { hotspot: true },
                    hidden: ({ parent }) => parent?.heroBackgroundType !== 'image'
                  }),

                  defineField({
                    name: 'heroBackgroundVideo',
                    title: 'Hero Background Video',
                    type: 'file',
                    options: { accept: 'video/mp4' },
                    hidden: ({ parent }) => parent?.heroBackgroundType !== 'video'
                  }),

                  defineField({
                    name: 'templates',
                    title: 'Sample Templates Slider',
                    type: 'array',
                    of: [
                      defineField({
                        name: 'template',
                        type: 'object',
                        fields: [
                          { name: 'title', type: 'string' },
                          { name: 'designImage', type: 'image', options: { hotspot: true }, validation: (rule: any) => rule.required() }
                        ]
                      })
                    ]
                  }),

                  defineField({
                    name: 'brands',
                    title: 'Partner Logos (Dynamic Marquee)',
                    type: 'array',
                    of: [
                      { type: 'object', fields: [{ name: 'name', type: 'string' }, { name: 'logo', type: 'image' }] }
                    ]
                  }),

                  defineField({
                    name: 'categories',
                    title: 'Event Categories',
                    type: 'array',
                    of: [
                      defineField({
                        name: 'category',
                        type: 'object',
                        fields: [
                          { name: 'title', type: 'string', validation: (rule: any) => rule.required() },
                          { name: 'slug', type: 'slug', options: { source: 'title' }, validation: (rule: any) => rule.required() },
                          { name: 'description', type: 'text', validation: (rule: any) => rule.required() },
                          { name: 'image', type: 'image', options: { hotspot: true }, validation: (rule: any) => rule.required() }
                        ]
                      })
                    ]
                  }),

                  defineField({
                    name: 'testimonials',
                    title: 'Client Testimonials',
                    type: 'array',
                    of: [
                      { type: 'object', fields: [ { name: 'name', type: 'string' }, { name: 'text', type: 'text' }, { name: 'rating', type: 'number', validation: (rule: any) => rule.min(1).max(5).integer() } ] }
                    ]
                  })
                ],
                preview: { select: { title: 'heroTitle' } }
              })

