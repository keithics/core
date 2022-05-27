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
