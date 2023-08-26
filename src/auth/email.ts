export const sendEmailVerificationLink = async (token: string) => {
  const url = `http://localhost:3000/admin/email-verification/${token}`;
  console.log(`Your email verification link: ${url}`);
};

export const sendPasswordResetLink = async (token: string) => {
  const url = `http://localhost:3000/admin/password-reset/${token}`;
  console.log(`Your password reset link: ${url}`);
};
