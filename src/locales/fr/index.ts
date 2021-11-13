import minifaker from '../../index'

import firstNames from './name/firstNames'
import maleFirstNames from './name/maleFirstNames'
import femaleFirstNames from './name/femaleFirstNames'
import phoneFormats from './phone/formats'
import cityNames from './address/cityNames'
import lastNames from './name/lastNames'

const locale = {
  maleFirstNames,
  femaleFirstNames,
  firstNames,
  phoneFormats,
  cityNames,
  lastNames
}

minifaker.addLocale('fr', locale)

export default locale
