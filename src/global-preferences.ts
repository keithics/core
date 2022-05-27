const globalPrefs = {
  paginationLimit: 15,
  fuse: {
    options: {
      threshold: 0,
      location: 0,
      distance: 0,
      maxPatternLength: 32,
      minMatchCharLength: 2,
    },
  },
  passwordRegex: new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'),
  passwordMessage: 'Password must be at least 8 characters long,  a mix of letters (uppercase and lowercase), numbers and symbols',
  repeatPassword: 'Passwords must be the same',
};

export default globalPrefs;
