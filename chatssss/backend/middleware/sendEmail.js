const nodeMailer = require('nodemailer');
// module.exports.sendEmail = async (options)=>{
//     const transporter = nodeMailer.createTransport({
//         host : process.env.SMPT_HOST,
//         port : process.env.SMPT_PORT,
//         auth : {
//             user : process.env.SMPT_MAIL,
//             pass : process.env.SMPT_PASSWORD
//         },
//         service : process.env.SMPT_SERVICE
//     })

//     const mailOptions = {
//         from : process.env.SMPT_MAIL,
//         to : options.email,
//         subject : options.subject,
//         text : options.message
//     }

//     await transporter.sendMail(mailOptions)
// }


module.exports.sendEmail = async (options) => {
    var transport = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        auth: {
            user: process.env.SMPT_USER,
            pass: process.env.SMPT_PASS
        }
    });

    const mailoptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    transport.sendMail(mailoptions);
}