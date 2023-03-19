export const getImageSrc = (url: string): string => url?.match(/^http/) ? url : '../../assets/images/no-poster.svg'
