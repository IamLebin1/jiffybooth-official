import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Us Page',
  type: 'document',
  fields: [
    // --- HERO ---
    defineField({ name: 'title', title: 'Page Title', type: 'string' }),
    defineField({ name: 'heroBio', title: 'Hero Description', type: 'text', rows: 2 }),
    defineField({ name: 'heroBackgroundImage', title: 'Hero Background Image', type: 'image', options: { hotspot: true } }),

    // --- CONTACT DETAILS ---
    defineField({ name: 'whatsappNumber', title: 'WhatsApp (No spaces, e.g. 60163966562)', type: 'string' }),
    defineField({ name: 'instagramUser', title: 'Instagram Username (e.g. jiffybooth)', type: 'string' }),
    defineField({ name: 'emailAddress', title: 'Public Contact Email', type: 'string' }),

    // --- BOOKING TIMELINE ---
    defineField({ name: 'bookingTitle', title: 'Booking Section Title', type: 'string', initialValue: 'How to Book?' }),
    defineField({
      name: 'bookingSteps',
      title: 'Booking Steps Timeline',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Step Title', type: 'string' },
          { name: 'description', title: 'Step Description', type: 'text', rows: 2 }
        ]
      }]
    }),
  ],
})