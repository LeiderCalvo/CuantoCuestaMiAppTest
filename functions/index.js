const functions = require('firebase-functions');
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');
admin.initializeApp(functions.config().firebase);

/*Intento con zoho*/
var trans = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@goconsultingeurope.com',
        pass: 'MailConsulting*19'
    }
});

exports.sendEmailByZoho = functions.https.onRequest((req, res) => {

    const options = {
        from: `info@goconsultingeurope.com`,
        to: 'leidercalvo@gmail.com',
        subject: 'contact form message',
        html: `<h1>Order Confirmation</h1>
        <p> <b>Email: </b>lo mio</p>`
    };

    return trans.sendMail(options, (error, data) => {
        if (error) {
            console.log(error);
            res.send(error.toString());
            return
        }
        console.log("Sent!")
        return res.send('SendedByZoho');
    });
});

/*Funciona con gmail*/
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'firebaseGCE@gmail.com',
        pass: 'Conexion_2020'
    }
});

exports.sendEmails = functions.https.onRequest((req, res) => {

    const mailOptions = {
        from: `firebaseGCE@gmail.com`,
        to: 'leidercalvo@gmail.com',
        subject: 'contact form message',
        html: `<h1>Order Confirmation</h1>
        <p> <b>Email: </b>lo mio</p>`
    };
    return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            console.log(error);
            res.send(error.toString());
            return
        }
        console.log("Sent!")
        return res.send('Sended5');
    });
});