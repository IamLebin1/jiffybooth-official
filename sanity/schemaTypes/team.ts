// sanity/schemaTypes/team.ts
export default {
  name: 'team',
  type: 'document',
  title: 'Jiffy Team',
  fields: [
    { name: 'teamName', type: 'string', title: 'Display Name' },
    { 
      name: 'teamPhoto', 
      type: 'image', 
      title: 'Main Photo',
      options: { hotspot: true } // Crucial for mobile-friendly cropping
    },
    { name: 'bio', type: 'text', title: 'Biography Text' },

    
  ],
}