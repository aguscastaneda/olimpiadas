const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend")

const CLIENT = process.env.CLIENT

const mailerSend = new MailerSend({
  apiKey: process.env.TOKEN_MAILER,
});

const sentFrom = new Sender("zona_atleta@trial-o65qngkr6934wr12.mlsender.net", "Zona Atleta");

function getEmailParams(emails, subject, html) {
  const recipients = emails.map(e => new Recipient(e, "Your Client"))
  return new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(subject)
    .setHtml(html)
}

async function sendEmailVerification(email, code) {
  const emailParams = getEmailParams([email], 'Verifica tu correo electronico', `
  <div style="max-width: 512px; margin: 0 auto; font-family: Arial,Helvetica,sans-serif; border: 1px solid rgba(0, 0, 0, .25); border-radius: .375rem;">
    <div style="padding: 32px; background-color: #ed3237; border-top-left-radius: .375rem; border-top-right-radius: .375rem; font-family: Arial,Helvetica,sans-serif">
      <h4 style="margin: 0; font-size: 32px; text-align: center; color: #ffffff; font-family: Arial,Helvetica,sans-serif;">Zona Atleta</h4>
      <h4 style="margin: 0; font-size: 24px; font-weight: 100; text-align: center; color: #ffffffaa; font-family: Arial,Helvetica,sans-serif;">Verifica tu correo electronico</h4>
    </div>
    <div style="padding: 32px; background-color: #ffffff; border-radius: .375rem; font-family: Arial,Helvetica,sans-serif;">
      <p style="font-size: 18px; text-align: center; font-family: Arial,Helvetica,sans-serif;" class="email__text">Codigo de verificacion</p>
      <p style="font-size: 32px; margin-top: 16px; border-radius: 10px; text-align: center; text-decoration:none;color:#ed3237; display:block;padding:16px 10px; font-weight: bold; font-family: Arial,Helvetica,sans-serif;">${code}</p>
    </div>
  </div>`)

  await mailerSend.email.send(emailParams)
}

async function sendEmailRegister(email) {
  const emailParams = getEmailParams([email], 'Registro Exitoso!', `
  <div style="max-width: 512px; margin: 0 auto; font-family: Arial,Helvetica,sans-serif; border: 1px solid rgba(0, 0, 0, .25); border-radius: .375rem;">
    <div style="padding: 32px; background-color: #ed3237; border-top-left-radius: .375rem; border-top-right-radius: .375rem; font-family: Arial,Helvetica,sans-serif">
      <h4 style="margin: 0; font-size: 32px; text-align: center; color: #ffffff; font-family: Arial,Helvetica,sans-serif;">Zona Atleta</h4>
      <h4 style="margin: 0; font-size: 24px; font-weight: 100; text-align: center; color: #ffffffaa; font-family: Arial,Helvetica,sans-serif;">Gracias por elegirnos!</h4>
    </div>
    <div style="padding: 32px; background-color: #ffffff; border-radius: .375rem; font-family: Arial,Helvetica,sans-serif;">
      <p style="font-size: 18px; text-align: center; font-family: Arial,Helvetica,sans-serif;" class="email__text">Zona atleta se esfuerza dia a dia para mejorar la calidad de sus productos</p>
    </div>
  </div>`)

  await mailerSend.email.send(emailParams)
}

async function sendEmailPasswordReset(email) {
  const emailParams = getEmailParams([email], 'Contraseña Restablecida', `
  <div style="max-width: 512px; margin: 0 auto; font-family: Arial,Helvetica,sans-serif; border: 1px solid rgba(0, 0, 0, .25); border-radius: .375rem;">
    <div style="padding: 32px; background-color: #ed3237; border-top-left-radius: .375rem; border-top-right-radius: .375rem; font-family: Arial,Helvetica,sans-serif">
      <h4 style="margin: 0; font-size: 32px; text-align: center; color: #ffffff; font-family: Arial,Helvetica,sans-serif;">Zona Atleta</h4>
      <h4 style="margin: 0; font-size: 24px; font-weight: 100; text-align: center; color: #ffffffaa; font-family: Arial,Helvetica,sans-serif;">Contrasenia restablecida</h4>
    </div>
    <div style="padding: 32px; background-color: #ffffff; border-radius: .375rem; font-family: Arial,Helvetica,sans-serif;">
      <p style="font-size: 18px; text-align: center; font-family: Arial,Helvetica,sans-serif;" class="email__text">Zona atleta informa de un cambio de contrasenia del usuario con este email</p>
    </div>
  </div>`)

  await mailerSend.email.send(emailParams)
}

async function sendEmailPurchaseMade(email) {
  const emailParams = getEmailParams([email], 'Compra Realiza!', `
  <div style="max-width: 512px; margin: 0 auto; font-family: Arial,Helvetica,sans-serif; border: 1px solid rgba(0, 0, 0, .25); border-radius: .375rem;">
    <div style="padding: 32px; background-color: #ed3237; border-top-left-radius: .375rem; border-top-right-radius: .375rem; font-family: Arial,Helvetica,sans-serif">
      <h4 style="margin: 0; font-size: 32px; text-align: center; color: #ffffff; font-family: Arial,Helvetica,sans-serif;">Zona Atleta</h4>
      <h4 style="margin: 0; font-size: 24px; font-weight: 100; text-align: center; color: #ffffffaa; font-family: Arial,Helvetica,sans-serif;">Compra realizada exitosamente!</h4>
    </div>
    <div style="padding: 32px; background-color: #ffffff; border-radius: .375rem; font-family: Arial,Helvetica,sans-serif;">
      <p style="font-size: 18px; text-align: center; font-family: Arial,Helvetica,sans-serif;" class="email__text">Puede ver los detalles de su compra en su perfil</p>
    </div>
  </div>`)

  await mailerSend.email.send(emailParams)
}

async function sendEmailDiscount(emails) {
  const emailParams = getEmailParams(emails, 'Mira nuestros nuevos descuentos', `
  <div style="max-width: 512px; margin: 0 auto; font-family: Arial,Helvetica,sans-serif; border: 1px solid rgba(0, 0, 0, .25); border-radius: .375rem;">
    <div style="padding: 32px; background-color: #ed3237; border-top-left-radius: .375rem; border-top-right-radius: .375rem; font-family: Arial,Helvetica,sans-serif">
      <h4 style="margin: 0; font-size: 32px; text-align: center; color: #ffffff; font-family: Arial,Helvetica,sans-serif;">Zona Atleta</h4>
      <h4 style="margin: 0; font-size: 24px; font-weight: 100; text-align: center; color: #ffffffaa; font-family: Arial,Helvetica,sans-serif;">Hola, mira nuestros nuevos descuentos en zona atleta</h4>
    </div>
    <div style="padding: 32px; background-color: #ffffff; border-radius: .375rem; font-family: Arial,Helvetica,sans-serif;">
      <p style="font-size: 18px; text-align: center; font-family: Arial,Helvetica,sans-serif;" class="email__text">Zona atleta despide una radiente vibra de nuevos descuentos totalmente imperdibles!!!</p>
      <a style="margin-top: 16px; border-radius: 10px; text-align: center; text-decoration:none;color:#f9f9f9; background-color: #ed3237; display:block;padding:16px 10px; font-weight: bold; font-family: Arial,Helvetica,sans-serif;" href="${CLIENT}/product/from/discount" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://brubank.com/app/startup/confirm-email/20b1af05-39f0-4b9d-b955-19bd6f2a795f&amp;source=gmail&amp;ust=1726315228509000&amp;usg=AOvVaw2YvbGRSdqwoHoveXbvIIxz">Ir a ver descuentos</a>
    </div>
  </div>`)

  await mailerSend.email.send(emailParams)
}

module.exports = {
  sendEmailVerification,
  sendEmailRegister,
  sendEmailPasswordReset,
  sendEmailPurchaseMade,
  sendEmailDiscount
}