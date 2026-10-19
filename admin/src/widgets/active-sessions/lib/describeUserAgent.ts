/*
Грубый разбор user-agent: браузер и система, чтобы узнать своё устройство в списке.
Точность не нужна, поэтому без библиотеки.
**/

const BROWSERS: [RegExp, string][] = [
  [/YaBrowser\//, 'Яндекс Браузер'],
  [/Edg\//, 'Edge'],
  [/OPR\//, 'Opera'],
  [/Firefox\//, 'Firefox'],
  [/Chrome\//, 'Chrome'],
  [/Safari\//, 'Safari'],
];

const SYSTEMS: [RegExp, string][] = [
  [/Windows/, 'Windows'],
  [/Android/, 'Android'],
  [/iPhone|iPad/, 'iOS'],
  [/Mac OS X/, 'macOS'],
  [/Linux/, 'Linux'],
];

const findName = (userAgent: string, patterns: [RegExp, string][]) =>
  patterns.find(([pattern]) => pattern.test(userAgent))?.[1] ?? null;

export const describeUserAgent = (userAgent: string | null) => {
  if (!userAgent) return null;

  const parts = [findName(userAgent, BROWSERS), findName(userAgent, SYSTEMS)]
    .filter(part => part !== null);

  return parts.length > 0 ? parts.join(', ') : null;
};
