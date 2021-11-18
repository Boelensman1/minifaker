import 'jest'
import minifaker, { MacAddressAdministration, MacAddressSeparator, MacAddressTransmission, PlaceImgCategory, PlaceImgFilter } from '../src'

test('Test function without locale', () => {
  expect(() => minifaker.firstName()).toThrow() // no default locale error
  expect(minifaker.number()).toBeLessThanOrEqual(1)
  expect(minifaker.number({ float: true }))
  expect(minifaker.boolean())
  expect(minifaker.arrayElement(['one', 'two', 'three']))
  expect(minifaker.imageUrlFromPlaceIMG({ width: 500, height: 500 }))
  expect(minifaker.imageUrlFromPlaceIMG({ width: 500, height: 500, category: PlaceImgCategory.ANIMALS, filter: PlaceImgFilter.SEPIA }))
  expect(minifaker.imageUrlFromPlaceholder({ width: 250 }))
  expect(minifaker.imageUrlFromPlaceholder({ width: 250, height: 200, backColor: 'black', textColor: 'white', textValue: 'minifaker' }))
  expect(minifaker.objectElement({ 'key1': 'value', 'key2': 'value' }))
  expect(() => minifaker.objectElement([])).toThrow()
  expect(minifaker.array(5, (i) => i)).toEqual([0, 1, 2, 3, 4])
  expect(minifaker.ip())
  expect(minifaker.port())
  expect(minifaker.ipv6())
  expect(minifaker.color())
  expect(minifaker.color({ r: 1 }))
  expect(minifaker.macAddress())
  expect(minifaker.macAddress({ separator: MacAddressSeparator.NONE }))
  expect(minifaker.macAddress({ separator: MacAddressSeparator.DOT }))
  expect(minifaker.macAddress({ separator: MacAddressSeparator.SPACE }))
  expect(minifaker.macAddress({ separator: MacAddressSeparator.DASH }))
  expect(minifaker.macAddress({ transmission: MacAddressTransmission.MULTICAST, administration: MacAddressAdministration.LAA }))
  expect(minifaker.macAddress({ transmission: MacAddressTransmission.UNICAST, administration: MacAddressAdministration.UAA }))
})
