/** Client-safe email constants (no nodemailer / Node-only imports). */

export const EMAIL_NOT_CONFIGURED_CODE = 'EMAIL_NOT_CONFIGURED';

export const EMAIL_NOT_CONFIGURED_MESSAGE =
  'Email is not configured for this site. Add SMTP_EMAIL_USER and SMTP_EMAIL_PASSWORD (your Gmail address and app password) to the server environment variables to enable outbound email.';
