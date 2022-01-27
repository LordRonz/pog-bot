const isValidUrl = (input: string): boolean => {
  let res: URL;
  const url = input.startsWith('http://') || input.startsWith('https://') ? input : 'https://' + input;
  try {
    res = new URL(url);
  } catch (_) {
    return false;
  }
  return res.protocol === 'http:' || res.protocol === 'https:';
};

export default isValidUrl;
