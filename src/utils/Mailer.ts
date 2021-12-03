import nodemailer from 'nodemailer';
require('dotenv').config();

class Mailer {
  private readonly service: string
  private readonly user: string
  private readonly password: string

  constructor(service: string, user: string, password: string) {
    this.service = service;
    this.user = user
    this.password = password
  }

  private async createTransporter() {
    const transporter =  nodemailer.createTransport({
      pool: true,
      service: this.service,
      auth: {
        user: this.user,
        pass: this.password,
      },
    })

    const check = await transporter.verify();

    if (!check) {
      throw new Error('Transporter create error')
    }

    return transporter
  }

  public async sendMail(to: string, subject: string, html: string) {
    const transporter = await this.createTransporter()

    const result = await transporter.sendMail({
      from: { name: 'Node Mailer', address: this.user },
      to,
      subject,
      html,
    })

    //result {
    //   accepted: [ 'forcenet22@yandex.ru' ],
    //   rejected: [],
    //   envelopeTime: 35,
    //   messageTime: 351,
    //   messageSize: 316,
    //   response: '250 2.0.0 Ok: queued on myt6-efff10c3476a.qloud-c.yan
    // dex.net as 1638103305-ekZNzUZ7Md-fjweTWSw',
    //   envelope: { from: 'alex@enslit.ru', to: [ 'forcenet22@yandex.ru'
    //  ] },
    //   messageId: '<94a6dbe8-82f6-c642-b060-e0ba7ea6331f@enslit.ru>'
    // }

    transporter.close()
    return result
  }
}

const {
  SMTP_SERVICE,
  SMTP_USER,
  SMTP_PASS
} = process.env

if (!SMTP_SERVICE || !SMTP_USER || !SMTP_PASS) {
  throw new Error('ENV SMTP settings undefined')
}

const Mail = new Mailer(SMTP_SERVICE, SMTP_USER, SMTP_PASS)

export default Mail