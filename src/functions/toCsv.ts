import jsonexport from 'jsonexport';

export const toCsv = async (obj: Record<string, any>) =>
  jsonexport(obj, {
    rowDelimiter: ',',
    textDelimiter: '"',
    forceTextDelimiter: true,
    includeHeaders: false,
  });
