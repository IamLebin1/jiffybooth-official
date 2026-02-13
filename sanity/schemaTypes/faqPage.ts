import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', initialValue: 'FAQ' }),
    defineField({ 
      name: 'subtitle', 
      title: 'Page Subtitle', 
      type: 'text', 
      rows: 2, 
      initialValue: 'Everything you need to know about booking Jiffy Booth.' 
    }),
    defineField({
      name: 'faqs',
      title: 'Questions & Answers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', title: 'Answer', rows: 4 }
          ]
        }
      ]
    }),
  ],
})