function isOnPageAnchor(url: string): boolean {
  return url.substring(0, 1) === '#';
}

function stripDoubles(url: string): string {
  return url.replace('//', '/');
}

function findProtocol(url: string): string {
  if (!url.includes('//')) return '';
  if (url.indexOf('//') === 0) return 'https';
  if (!url.includes('://')) return '';
  return url.substring(0, url.indexOf('://')).toLowerCase();
}

function isRelativeToRoot(url: string): boolean {
  if (url === '') return false;
  if (isOnPageAnchor(url)) return false;
  return findProtocol(url) === '' && url.substring(0, 1) === '/';
}

function isRelativeToPage(url: string): boolean {
  if (url === '') return false;
  if (isOnPageAnchor(url)) return false;
  return findProtocol(url) === '' && url.substring(0, 1) !== '/';
}

function findDomain(url: string): string {
  if (isRelativeToRoot(url)) return '';
  if (isRelativeToPage(url)) return '';
  if (isOnPageAnchor(url)) return '';
  const protocol = findProtocol(url);
  let output = url.replace(protocol, '').toLowerCase();
  const re = /(:?\/\/)/i;
  output = output.replace(re, '');
  if (output.includes('/')) return output.substring(0, output.indexOf('/'));
  return output;
}

function removeDomain(url: string): string {
  let output = url.toLowerCase();
  const domain = findDomain(url);
  //  console.log(url, domain);
  if (domain) output = output.substring(output.indexOf(domain) + domain.length);
  return output;
}

function removeAnchor(url: string): string {
  if (!url.includes('#')) return url;
  const output = url.substring(0, url.indexOf('#'));
  return output;
}

function endURL(url: string): string {
  if (!url.includes('.') && url.substring(url.length - 1) !== '/') return `${url}/`;
  return url;
}

function cleanPath(url: string) {
  let cleanedURL = url;
  cleanedURL = endURL(cleanedURL);
  cleanedURL = stripDoubles(cleanedURL);
  cleanedURL = removeAnchor(cleanedURL);
  return cleanedURL;
}

function findPath(url: string): string {
  if (url === '') return '';
  if (isOnPageAnchor(url)) return '';
  let output = removeDomain(url);
  output = removeAnchor(output);
  if (output === '') return '/';
  output = cleanPath(output);
  return output;
}

function findFileName(url: string): string {
  let output = findPath(url);
  if (!output) return '';
  output = output.substring(output.lastIndexOf('/') + 1);
  if (!output.includes('.')) return '';
  return output;
}

function findPathFromRoot(url: string, sourcePage: string): string {
  let output = '';

  let sourcePath = findPath(sourcePage);

  if (sourcePath.substring(sourcePath.length - 1) !== '/') {
    const fileName = findFileName(sourcePage);
    sourcePath = sourcePath.replace(fileName, '');
  }
  output = sourcePath + url;
  output = cleanPath(output);
  return output;
}

function findFileType(url: string): string {
  let filename = findFileName(url);
  if (!filename) return '';
  if (filename.includes('?')) filename = filename.substring(0, filename.indexOf('?'));
  const fileType = filename.substring(filename.lastIndexOf('.') + 1);
  return fileType;
}

function isRoot(url: string): boolean {
  if (url === '') return false;
  if (isOnPageAnchor(url)) return false;
  let bare = removeDomain(url);
  bare = removeAnchor(bare);
  return bare === '' || bare === '/';
}

function isInternal(url: string, domain: string): boolean {
  if (isRelativeToRoot(url)) return true;
  if (isRelativeToPage(url)) return true;
  const linkDomain = findDomain(url);
  return domain === linkDomain;
}

function formatExternalLink(url: string): string {
  const path = findPath(url);
  let output = '';
  if (path && path !== '/') {
    output = `${findProtocol(url)}://${findDomain(url)}${path}`;
  } else {
    output = `${findProtocol(url)}://${findDomain(url)}/`;
  }

  return output;
}

function formatLink(url: string, domain: string, current: string): string {
  if (url === '') return '';
  if (isOnPageAnchor(url)) return '';
  if (!isInternal(url, domain)) return formatExternalLink(url);

  if (isRoot(url)) return `https://${domain}/`;
  let path: string;

  if (isRelativeToPage(url)) {
    path = findPathFromRoot(url, current);
  } else {
    path = findPath(url);
  }
  // console.log(path);
  const output = `https://${domain}${path}`;
  return output;
}

export default {
  findProtocol,
  findFileType,
  isInternal,
  findDomain,
  cleanLink: formatLink,
  findPath,
  isOnPageAnchor,
  findFileName,
  isRelativeToPage,
  isRelativeToRoot,
  formatLink,
  isRoot,
};
