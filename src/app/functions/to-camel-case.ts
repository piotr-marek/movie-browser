import * as camelCase from 'camelcase';
export const toCamelCase = <T extends Object>(obj: T): T | any => {
  if(Array.isArray(obj)) {
    return obj.map(entry => toCamelCase(entry))
  }
  else if(obj!==null && obj.constructor===Object) {
    return Object.fromEntries(Object.entries(obj)
    .map(([key, val]) => [camelCase(key), toCamelCase(val)]))
  }
  return obj
}
