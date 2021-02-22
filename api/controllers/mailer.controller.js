// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
import sanitizeHtml from 'sanitize-html'

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

async function SendMail(to, subject, text, html) {
  const msg = {
    to,
    from: process.env.SEND_GRID_FROM,
    subject,
    text,
    html,
  }
  await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

async function SendRegistrationToken(to, subject, verificationToken) {
  const html = `
    <p>Please click the link below to confirm your email address and complete registration.</p>
    <a href="${
      process.env.API_URL || 'http://localhost:3000'
    }/register/confirmation?token=${verificationToken}">Activate your account</a>
  `
  const text = sanitizeHtml(html.toString(), {
    allowedTags: [],
  })
  await SendMail(to, subject, text, html)
}

async function SendPasswordChangeToken(to, subject, verificationToken) {
  const html = `
    <p>Please click the link below to change your address.</p>
    <a href="${
      process.env.API_URL || 'http://localhost:3000'
    }/register/confirmation?token=${verificationToken}">Change your password</a>
  `
  const text = sanitizeHtml(html.toString(), {
    allowedTags: [],
  })
  await SendMail(to, subject, text, html)
}
export default { SendMail, SendRegistrationToken, SendPasswordChangeToken }
