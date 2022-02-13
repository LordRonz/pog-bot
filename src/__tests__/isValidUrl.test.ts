import isValidUrl from '../utils/isValidUrl';

describe('isValidUrl', () => {
  it('should return true if the url is valid and vice versa', () => {
    const result = isValidUrl('https://nyaa.si/');

    expect(result).toEqual(true);
  });
});
