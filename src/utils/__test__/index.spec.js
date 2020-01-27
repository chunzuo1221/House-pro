import {
  getPropertyAddressComponentValue,
  getHash,
  isEqual,
  uniqueArray,
  generateUUID,
  getSectionGrade
} from '@/utils'

describe('getPropertyAddressComponentValue function', () => {
  it('should return Undefined if it cannot find administrative_area_level_2 value from property object', () => {
    const property = {
      address_components: [
        {
          long_name: '',
          short_name: '',
          types: []
        }
      ]
    }
    expect(getPropertyAddressComponentValue(property, 'postal_code'))
      .toBe('')
  })
  it('should get administrative_area_level_2 value from property object', () => {
    const property = {
      address_components: [
        {
          long_name: 'Ku-Ring-Gai Council',
          short_name: 'Ku-Ring-Gai',
          types: [
            'administrative_area_level_2',
            'political'
          ]
        }
      ]
    }
    expect(getPropertyAddressComponentValue(property, 'administrative_area_level_2', false))
      .toBe('Ku-Ring-Gai Council')
  })
})

describe('isEqual function', () => {
  it('should compare real values regardless look of two objects', () => {
    const a = [
      { a: { b: 1 }, c: 'AAA' },
      { a: { b: 2 }, c: 'BBB' },
    ]
    const b = [
      { c: 'AAA', a: { b: 1 } },
      { c: 'BBB', a: { b: 2 } }
    ]
    expect(isEqual(a, b))
      .toBeTruthy()
  })
})

describe('uniqueArray function', () => {
  it('should remove the duplicated nodes in array', () => {
    const src = [
      { value: 'VALUE' },
      { value: 'VALUE' }
    ]
    expect(uniqueArray(src, 'value'))
      .toEqual([{ value: 'VALUE' }])
  })
})

describe('getHash function', () => {
  it('should calculate hash value of object', () => {
    expect(getHash({ payload: [ 0, 1, 2, 3 ], headers: [ { a: 'b' } ] }))
      .toBe('ae085e74')
  })
})

describe('generateUUID function', () => {
  it('should generate UUID of object', () => {
    expect(generateUUID({ payload: [ 0, 1, 2, 3 ], headers: [ { a: 'b' } ] }))
      .toHaveLength(36)
  })
})

describe('getSectionGrade function', () => {
  it('should return "an excellent" if score is greater than 8', () => {
    expect(getSectionGrade(8.1))
      .toBe('an excellent')
  })
  it('should return "a good" if score is greater than 5', () => {
    expect(getSectionGrade(6.3))
      .toBe('a good')
  })
  it('should return "a poor" if score is less than 5', () => {
    expect(getSectionGrade(3.7))
      .toBe('a poor')
  })
})
