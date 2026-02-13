// sanity/schemaTypes/index.ts
import team from './team' // Keep your existing team schema
import aboutUs from './about-us' 
import services from './our-services'
import mainPage from './main-page'
import contactPage from './contactPage'
import faqPage from './faqPage'
import legalPage from './legal'
import headerFooter from './headerFooter'

export const schema = {
  types: [team,aboutUs,services,mainPage,contactPage,faqPage,legalPage,headerFooter],
}