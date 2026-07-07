import nodemailer from 'nodemailer';
import {
  EMAIL_NOT_CONFIGURED_CODE,
  EMAIL_NOT_CONFIGURED_MESSAGE,
} from './email-constants';

export { EMAIL_NOT_CONFIGURED_CODE, EMAIL_NOT_CONFIGURED_MESSAGE };

export type EmailConfig = {
  user: string;
  pass: string;
  from: string;
  service: string;
};

export function getEmailConfig(): EmailConfig | null {
  const user = process.env.SMTP_EMAIL_USER?.trim();
  const pass = process.env.SMTP_EMAIL_PASSWORD?.trim();

  if (!user || !pass) {
    return null;
  }

  return {
    user,
    pass,
    from: process.env.SMTP_EMAIL_FROM?.trim() || `EXO SANCTRA <${user}>`,
    service: process.env.SMTP_EMAIL_SERVICE?.trim() || 'gmail',
  };
}

export function createEmailTransporter(): nodemailer.Transporter | null {
  const config = getEmailConfig();
  if (!config) {
    return null;
  }

  return nodemailer.createTransport({
    service: config.service,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export function emailNotConfiguredPayload() {
  return {
    error: EMAIL_NOT_CONFIGURED_CODE,
    message: EMAIL_NOT_CONFIGURED_MESSAGE,
  };
}
