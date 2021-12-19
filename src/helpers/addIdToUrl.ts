import { URL } from 'url';

/**
 * Add the id to an url path
 * Example: http://example.com -> http://example.com/id
 * @param url
 * @param id
 */
export function addIdToUrl(url: string, id: number): string {
  const urlObject = new URL(url);
  urlObject.pathname = urlObject.pathname.endsWith('/')
    ? `${urlObject.pathname}${id}`
    : `${urlObject.pathname}/${id}`;
  return urlObject.toString();
}
