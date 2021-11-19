const locales = {}
let defaultLocale = null

const throwNoDefaultLocale = () => {
  throw new Error(`No default locale defined. Import at least one locale!`)
}

const throwNoLocale = (locale: string) => {
  throw new Error(`The locale [${locale}] is not imported or supported.`)
}

const throwNotLocaleData = (locale: string, key: string) => {
  throw new Error(`The locale [${locale}] data of [${key}] doest not exists. Mostly not implemented yet!.`)
}

const throwNotImplemented = () => {
  throw new Error(`Not implemented yet.`)
}

const getLocaleData = <T>({ locale: _locale, key }: { locale?: string, key: string }): T => {
  if (!defaultLocale) throwNoDefaultLocale()

  const locale = _locale || defaultLocale
  if (!locales[locale]) throwNoLocale(locale)

  const localeData = locales[locale]
  if (!localeData[key]) throwNotLocaleData(locale, key)
  return localeData[key]
}

export const addLocale = (name: string, locale) => {
  const noLocales = Object.keys(locales).length === 0
  locales[name] = locale
  if (noLocales) setDefaultLocale(name)
}

export const setDefaultLocale = (locale: string) => {
  if (!locales[locale]) throwNoLocale(locale)
  defaultLocale = locale
}

export const number = (options: { min?: number, max?: number, float?: boolean } = {}): number => {
  const { min, max, float } = { min: 0, max: 1, float: false, ...options }
  const value = min + Math.random() * (max - min)
  if (!float) return Math.round(value)
  return value
}

export const boolean = () => {
  return !!number({ max: 1 })
}

export const arrayElement = <T>(array: T[]): T => {
  return array[number({ max: array.length - 1 })]
}

export const array = <T>(count: number, cb: (index: number) => void): T[] => {
  let newArray = []
  for (let i = 0; i < count; i++) {
    newArray = [...newArray, cb(i)]
  }
  return newArray
}

export const objectElement = (obj: any): { key: string, value: unknown } => {
  if (typeof obj !== 'object' || Array.isArray(obj)) throw new Error(`obj must be an object.`)
  const keys = Object.keys(obj)
  const key = arrayElement(keys)
  return { key, value: obj[key] }
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export const firstName = (options: { locale?: string, gender?: Gender } = {}): string => {
  const { locale, gender } = options
  switch (gender) {
    case Gender.FEMALE:
      const femaleFirstNames = getLocaleData<string[]>({ locale, key: 'femaleFirstNames' })
      return arrayElement(femaleFirstNames)
    case Gender.MALE:
      const maleFirstNames = getLocaleData<string[]>({ locale, key: 'maleFirstNames' })
      return arrayElement(maleFirstNames)
    default:
      const firstNames = getLocaleData<string[]>({ locale, key: 'firstNames' })
      return arrayElement(firstNames)
  }
}

export const phoneNumber = (options: { locale?: string, formats?: string[] } = {}) => {
  const { locale, formats } = options
  const phoneFormats = formats || getLocaleData<string[]>({ locale, key: 'phoneFormats' })
  return arrayElement(phoneFormats).split('').map((c) => {
    if (c === '#') return number({ max: 9 })
    return c
  }).join('')
}

export const city = (options: { locale?: string } = {}): string => {
  return throwNotImplemented()
}

export const cityName = (options: { locale?: string } = {}): string => {
  const { locale } = options
  const cityNames = getLocaleData<string[]>({ locale, key: 'cityNames' })
  return arrayElement(cityNames)
}

export const cityPrefix = (options: { locale?: string } = {}): string => {
  const { locale } = options
  const cityPrefixes = getLocaleData<string[]>({ locale, key: 'cityPrefixes' })
  return arrayElement<string>(cityPrefixes)
}

export const citySuffix = (options: { locale?: string } = {}): string => {
  const { locale } = options
  const citySuffixes = getLocaleData<string[]>({ locale, key: 'citySuffixes' })
  return arrayElement<string>(citySuffixes)
}

export enum PlaceImgCategory {
  ANY = 'any',
  ANIMALS = 'animals',
  ARCHITECTURE = 'architecture',
  NATURE = 'nature',
  PEOPLE = 'people',
  TECH = 'tech'
}

export enum PlaceImgFilter {
  GRAYSCALE = 'grayscale',
  SEPIA = 'sepia'
}

export const imageUrlFromPlaceIMG = (options: { width: number, height: number, category?: PlaceImgCategory, filter?: PlaceImgFilter }) => {
  const { width, height, category, filter } = { category: PlaceImgCategory.ANY, ...options }
  const url = `https://placeimg.com/${width}/${height}/${category}`
  if (filter) url + `/${filter}`
  return url
}

export const imageUrlFromPlaceholder = (options: { width: number, height?: number, backColor?: string, textColor?: string, textValue?: string }) => {
  const { width, height, backColor, textColor, textValue } = options
  let url = `https://via.placeholder.com/${width}`
  if (height) url + `x${height}`
  if (backColor) url + `/${backColor}`
  if (textColor) url + `/${textColor}`
  if (textValue) url + `?text=${textValue}`
  return url
}

export const lastName = (options: { locale?: string } = {}): string => {
  const { locale } = options
  const lastNames = getLocaleData<string[]>({ locale, key: 'lastNames' })
  return arrayElement(lastNames)
}

export const name = (options?: { locale?: string, gender?: Gender }): string => {
  return `${firstName(options)} ${lastName(options)}`
}

export const jobTitle = (options?: { locale?: string }): string => {
  return `${jobDescriptor(options)} ${jobArea(options)} ${jobType(options)}`
}

export const jobType = (options: { locale?: string } = {}): string => {
  const { locale } = options
  const jobTypes = getLocaleData<string[]>({ locale, key: 'jobTypes' })
  return arrayElement(jobTypes)
}

export const jobArea = (options: { locale?: string } = {}): string => {
  const { locale } = options
  const jobLevels = getLocaleData<string[]>({ locale, key: 'jobLevels' })
  return arrayElement(jobLevels)
}

export const jobDescriptor = (options: { locale?: string } = {}): string => {
  const { locale } = options
  const jobDescriptors = getLocaleData<string[]>({ locale, key: 'jobDescriptors' })
  return arrayElement(jobDescriptors)
}

export const ip = (): string => {
  return array(4, () => number({ max: 255 })).join('.')
}

export const port = (): number => {
  return number({ max: 65535 })
}

export const ipv6 = (): string => {
  return array(8, () => number({ max: 65535 }).toString(16)).join(':')
}

const hexPadLeft = (value: string) => {
  if (value.length === 1) return `0${value}`
  return value
}

export const color = (options: { r?: number, g?: number, b?: number } = {}): string => {
  const { r, g, b } = options

  const red = (r || number({ max: 256 })).toString(16)
  const green = (g || number({ max: 256 })).toString(16)
  const blue = (b || number({ max: 256 })).toString(16)
  return `#${hexPadLeft(red)}${hexPadLeft(green)}${hexPadLeft(blue)}`
}

export enum WordType {
  VERB = 'verb',
  PREPOSITION = 'preposition',
  NOUN = 'noun',
  INTERJECTION = 'interjection',
  CONJUNCTION = 'conjunction',
  ADVERB = 'adverb',
  ADJECTIVE = 'adjective'
}

export const word = (options: { locale?: string, type?: WordType, filter?: (word: string) => void } = {}): string => {
  const { type, locale, filter } = options
  const _type = type || arrayElement(Object.values(WordType))
  const adjectives = getLocaleData<string[]>({ locale, key: `${_type}s` })
  if (typeof filter === 'function') return arrayElement(adjectives.filter(filter))
  return arrayElement(adjectives)
}

export const username = (options: { locale?: string, type?: number, firstName?: string, lastName?: string } = {}): string => {
  const { locale, type: _type, firstName: _firstName, lastName: _lastName } = options

  const newFirstName = _firstName || firstName({ locale })
  const newLastName = _lastName || lastName({ locale })
  const type = typeof _type !== 'undefined' ? _type : number({ max: 2 })

  switch (type) {
    case 0:
      return newFirstName + number({ max: 99 })
    case 1:
      return newFirstName + arrayElement(['.', '_']) + newLastName
    case 2:
      return newFirstName + arrayElement(['.', '_']) + newLastName + number({ max: 99 })
  }
}

export enum MacAddressSeparator { NONE = '', DOT = '.', COLON = ':', DASH = '-', SPACE = ' ' }

export enum MacAddressTransmission {
  UNICAST = 'unicast',
  MULTICAST = 'multicast'
}

export enum MacAddressAdministration {
  LAA = 'laa', // locally administered
  UAA = 'uaa' // globally unique (oui enforced)
}

// TODO: EUI64 address -- https://kwallaceccie.mykajabi.com/blog/how-to-calculate-an-eui-64-address
export const macAddress = (options: {
  separator?: MacAddressSeparator,
  transmission?: MacAddressTransmission,
  administration?: MacAddressAdministration
} = {}): string => {
  const { separator = MacAddressSeparator.COLON, transmission, administration } = options

  const mac = array(6, (index) => {
    let value = number({ max: 255 })

    // https://en.wikipedia.org/wiki/MAC_address#Address_details
    // use first octet to set transmission and administration bits
    if (index === 0) {
      if (transmission === MacAddressTransmission.MULTICAST)
        value |= 1 << 0 // set bit https://stackoverflow.com/questions/1436438/how-do-you-set-clear-and-toggle-a-single-bit-in-javascript
      else if (transmission === MacAddressTransmission.UNICAST)
        value &= ~(1 << 0) // unset bit

      if (administration === MacAddressAdministration.LAA)
        value |= 1 << 1
      else if (administration === MacAddressAdministration.UAA)
        value &= ~(1 << 1)
    }

    return hexPadLeft(value.toString(16))
  })

  if (separator === MacAddressSeparator.DOT) {
    let dotMac = ''
    for (let i = 0; i < mac.length; i++) {
      dotMac += mac[i]
      if (i % 2 == 1 && i < mac.length - 1) dotMac += separator
    }
    return dotMac
  }

  return mac.join(separator)
}

export const email = (options: { locale?: string, firstName?: string, lastName?: string, provider?: string } = {}): string => {
  const { locale, provider: _provider } = options
  const freeEmails = getLocaleData<string[]>({ locale, key: 'freeEmails' })
  const provider = _provider || arrayElement(freeEmails)
  return `${username(options)}@${provider}`
}

export const domainName = (options: { locale?: string } = {}): string => {
  const { locale } = options

  const name = arrayElement([
    word({ locale, type: WordType.NOUN }),
    firstName({ locale })
  ])

  return `${name.toLowerCase()}.${domainSuffix({ locale })}`
}

export const domainSuffix = (options: { locale?: string } = {}): string => {
  const { locale } = options
  const domainSuffixes = getLocaleData<string[]>({ locale, key: 'domainSuffixes' })
  return arrayElement(domainSuffixes)
}

export const domainUrl = (options: { locale?: string } = {}): string => `https://${domainName(options)}`

export default {
  setDefaultLocale,
  addLocale,
  cityName,
  citySuffix,
  cityPrefix,
  number,
  phoneNumber,
  firstName,
  arrayElement,
  boolean,
  city,
  imageUrlFromPlaceIMG,
  imageUrlFromPlaceholder,
  objectElement,
  array,
  lastName,
  name,
  jobTitle,
  jobArea,
  jobDescriptor,
  jobType,
  ip,
  port,
  word,
  ipv6,
  color,
  username,
  macAddress,
  domainSuffix,
  domainName,
  email,
  domainUrl
}
