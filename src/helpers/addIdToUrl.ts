import { URL } from 'url';

export function addIdToUrl(url: string, id: number): string {
  const urlObject = new URL(url);
  urlObject.pathname = urlObject.pathname.endsWith('/')
    ? `${urlObject.pathname}${id}`
    : `${urlObject.pathname}/${id}`;
  return urlObject.toString();
}
