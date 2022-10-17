// here stays useful functions that can be used both on the server and on the mobile client

export const upperCase = (str) => str.toUpperCase()

export const shuffle = (str) =>
  str
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
