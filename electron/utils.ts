type WindowType = 'main' | 'screenshot' | 'content';

// this path is only used in dev server, so the absolute filePath is ok.
export function getWindowHtmlPath(window: WindowType): string {
  return `/src/windows/${window}/index.html`;
}
