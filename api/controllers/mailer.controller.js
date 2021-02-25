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

/**
 * Verify that the person signing up has access to the inbox they used
 * @param {*} to
 * @param {*} subject
 * @param {*} verificationToken
 */
async function SendRegistrationToken(to, subject, verificationToken) {
  const url = `${process.env.API_URL}/register/confirmation?token=${verificationToken}`
  const html = `
    <p>Please click the link below to confirm your email address and complete registration.</p>
    <a href="${url}">Activate your account</a>
  `
  const text = sanitizeHtml(html.toString(), {
    allowedTags: [],
  })
  await SendMail(to, subject, text, html)
}

/**
 * Verify that the user actually issued a password change request
 * @param {*} to
 * @param {*} subject
 * @param {*} verificationToken
 */
async function SendPasswordChangeToken(to, subject, verificationToken) {
  const url = `${process.env.API_URL}/login/reset/password?token=${verificationToken}`
  const html = `
    <p>Please click the link below to change your password.</p>
    <a href="${url}">Change your password</a>
  `

  const text = sanitizeHtml(html.toString(), {
    allowedTags: [],
  })
  await SendMail(to, subject, text, html)
}
export default { SendMail, SendRegistrationToken, SendPasswordChangeToken }
