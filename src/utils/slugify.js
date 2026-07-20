// Decode HTML entities before slugifying to prevent &amp; becoming 'amp' in URLs
const decodeHtmlForSlug = (str) => {
  if (!str) return str;
  let decoded = str;
  // Run twice to handle double-encoding like &amp;amp;
  for (let i = 0; i < 2; i++) {
    decoded = decoded
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/');
  }
  return decoded;
};

export const generateSlug = (text) => {
  if (!text) return "";
  return decodeHtmlForSlug(text)
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with a hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};
