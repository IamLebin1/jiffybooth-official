import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website Content')
    .items([
      // 1. MAIN PAGE (Single Document)
      S.listItem()
        .title('Main Page Content')
        .id('mainPage')
        .child(
          S.document()
            .schemaType('mainPage')
            .documentId('mainPage')
        ),

      S.divider(), // Adds a visual line

      // 2. ABOUT US (Single Document)
      S.listItem()
        .title('About Us Page')
        .id('aboutUs') 
        .child(
          S.document()
            .schemaType('aboutUs') 
            .documentId('aboutUs')
        ),

      // 3. ALL BOOTH SERVICES (List of Documents)
      S.documentTypeListItem('ourServices')
        .title('Our Services (Booths)'),

      // 4. ALL EVENTS (List of Documents)
      S.documentTypeListItem('ourEvents')
        .title('Our Events'),

      S.divider(),

      // 5. Contact Us Page (Single Document)
      S.listItem()
        .title('Contact Us Page')
        .id('contactPage')
        .child(
          S.document()
            .schemaType('contactPage')
            .documentId('contactPage')
        ),

      // 6. FAQ Page (Single Document)
      S.listItem()
        .title('FAQ Page')
        .id('faqPage')
        .child(
          S.document()
            .schemaType('faqPage')
            .documentId('faqPage')
        ),

      // 7. LEGAL PAGES (List of Documents: Privacy, Terms, etc.)
      S.documentTypeListItem('legalPage')
        .title('Legal Pages (Privacy/Terms)'),

      S.divider(),

      // 8. HEADER & FOOTER (Single Document)
      S.listItem()
        .title('Header & Footer')
        .id('headerFooter')
        .child(
          S.document()
            .schemaType('headerFooter')
            .documentId('headerFooter')
        ),

      // Automatically hide document types from the "generic" list if they are managed above
      // ADDED 'legalPage' to this filter to keep the sidebar clean
      ...S.documentTypeListItems().filter(
        (item) => !['mainPage', 'ourServices', 'ourEvents', 'aboutUs', 'team', 'contactPage', 'faqPage', 'photoboothPage', 'headerFooter', 'legalPage'].includes(item.getId()!)
      ),
    ])