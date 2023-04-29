export function Slugify(str: string): string {
  return str
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9\- ]/g, '')
    .replace(/\s+/g, '-')
}
