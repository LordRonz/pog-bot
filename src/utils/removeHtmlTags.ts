export const removeHtmlTags = (s: string) => s.replace(/<\/?[^>]+(>|$)/g, '');

export default removeHtmlTags;
