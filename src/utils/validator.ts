

/**
 * Validates whether the password is valid.
 * @param password The password to validate
 * @returns { ret, message }
 */
export const validatePassword = (password: string, isCheckPattern: boolean = false) => {
  if (!password) {
    return { ret: false, message: "Password empty" };
  }

  if (password.length < 8 || password.length > 12) {
    return { ret: false, message: "Password min 8 max 12" };
  }

  if (isCheckPattern) {
    const passwordPattern = /^((?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>~\/?]))([a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>~\/?]){8,}$/;
    if (passwordPattern.test(password)) {
      return { ret: true };
    }

    return { ret: false, message: "Invalid format" };
  } else {
    return { ret: true };
  }

  // Must include at least one letter and one number.
  // if (/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(password)) {
  //   return { ret: true };
  // }


  // return { ret: false, message: 'Invalid password format' };
};

export const validateName = (name: string, isCheckPattern: boolean = false) => {
  if (!name) {
    return { ret: false, message: "Email empty"};
  }

  if (name.length < 2 || name.length > 20) {
    return { ret: false, message: "Email min 2 max 20" };
  }

  if (isCheckPattern) {
    const namePattern = /^[^0-9!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]{2,20}$/;
    if (namePattern.test(name)) {
      return { ret: true };
    }

    return { ret: false, message: "Invalid format" };
  } else {
    return { ret: true };
  }
}

/**
 * Validates whether the email format is valid.
 * @param email The email to validate
 * @returns { ret, message }
 */
export const validateEmail = (email: string) => {
  if (!email || email.length > 64) {
    return { ret: false, message: "Invalid format" };
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(email)) {
    return { ret: true };
  }

  return { ret: false, message: "Invalid format" };
};

/**
 * Validates whether the phone number format is valid.
 * @param phone The phone number to validate
 * @returns { ret, message }
 */
export const validatePhone = (phone: string) => {
  // if (!phone || phone length < 10 || phone length > 12) {
  //   return { ret: false, message: 'Phone number length is too short or too long' };
  // }

  if (/^\d+$/.test(phone)) {
    return { ret: true };
  }

  return { ret: false, message: 'Invalid phone number format' };
};
