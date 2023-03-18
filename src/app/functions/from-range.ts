export const fromRange = (start: number, end: number): Array<number> => {
  if(end<=start) return [];
  const array: Array<number> = new Array(end-start+1)
  for(const index of array.keys()){
    array[index] = start + index
  }
  return array;
}
