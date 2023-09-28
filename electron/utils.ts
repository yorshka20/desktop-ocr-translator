type WindowType = 'main' | 'screenshot' | 'content';
export function getWindowHtmlPath(window: WindowType): string {
  return `/src/windows/${window}/index.html`;
}
