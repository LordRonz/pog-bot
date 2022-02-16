import isValidUrl from '../utils/isValidUrl';
import removeHtmlTags from '../utils/removeHtmlTags';

describe('isValidUrl', () => {
  it('should return true if the url is valid and vice versa', () => {
    expect.hasAssertions();
    const result = isValidUrl('https://nyaa.si/');
    const falseResult = isValidUrl('bruh>>.D???');

    expect(result).toBe(true);
    expect(falseResult).toBe(false);
  });
});

describe('removeHtmlTags', () => {
  it('should remove html tags from string', () => {
    expect.hasAssertions();
    const result = removeHtmlTags('Hello i am <br> <span>groot</span>');

    expect(result).toMatch('Hello i am  groot');
  });
});
