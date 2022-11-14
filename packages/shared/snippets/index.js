// here stays useful functions that can be used both on the server and on the mobile client

export const isObject = (element) =>
  Object.prototype.toString.call(element) === '[object Object]'

export const isObjectEmpty = (obj) =>
  obj &&
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype

export const sanitizeText = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
