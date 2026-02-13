// sanity/schemaTypes/templates.ts
export default {
  name: 'templates',
  type: 'document',
  title: 'Our Templates',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Design Name',
      description: 'e.g., Mah Sing Wedding, Corporate Gala'
    },
    {
      name: 'designImage',
      type: 'image',
      title: 'Template Image',
      options: {
        hotspot: true // Allows you to crop the design perfectly in the dashboard
      }
    }
  ]
}