/**
 * Generates an avatar URL.
 * If a valid URL is provided, it returns it.
 * Otherwise, it generates a Robohash URL based on the username.
 * @param {string | null | undefined} url - The potential avatar URL.
 * @param {string} username - The username to use for the fallback.
 * @returns {string} - A valid avatar URL.
 */
export const formatAvatar = (url: string | null | undefined, username: string): string => {
  if (url && url.trim() !== '') {
    return url;
  }
  // Use a fallback if the username is also empty, to avoid a malformed URL
  const fallbackUsername = username && username.trim() !== '' ? username : 'zenith-user';
  return `https://robohash.org/${encodeURIComponent(fallbackUsername)}.png`;
};
