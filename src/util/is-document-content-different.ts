import { diff } from 'deep-object-diff';

const isObject = (o: any) => o != null && typeof o === 'object';

export const isContentDifferent = (oldContent: any, newContent: any): boolean =>
  isObject(oldContent) && isObject(newContent) && Object.keys(diff(oldContent, newContent)).length > 0;
