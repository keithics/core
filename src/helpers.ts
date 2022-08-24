export function randomString(length = 12) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * snakeCase to Capitalized Words
 * eg: firstName = First Name, homeFirstName = Home First Name
 * @param string
 */
export function snakeToCapitalize(string) {
  return string
    .replace(/([A-Z])/g, function (match) {
      return ' ' + match;
    })
    .replace(/^./, function (match) {
      return match.toUpperCase();
    });
}

/***
 * Shows a different error message if in dev mode
 */

export function dconsole(message) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    if (typeof message === 'object') {
      const object = JSON.parse(message);
      console.dir(object, { depth: null, colors: true });
    } else {
      console.log(message);
    }
  }
}
