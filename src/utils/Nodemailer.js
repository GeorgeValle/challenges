const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')

const signup = async (req, res) => {
    let testAccount = await nodemailer.createTestAccount()
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })
    let message = {
        from: "Leo Messi <leo@messi.com>",
        to: "alexmarinmendez@gmail.com",
        subject: "Hello World!!!",
        html: "<b>Hello World</b>"
    }

    transporter.sendMail(message)
        .then(info => {
            res.status(201).json({
                msg: "Revisa tu inbox... tiene sun mensaje",
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            })
        })
        .catch(err => res.status(500).json({err}))
   
}