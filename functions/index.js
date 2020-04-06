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
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
});


exports.sendEmailByZoho = functions.https.onRequest((req, res) => {
    // verify connection configuration
    trans.verify(function(error, success) {
        if (error) {
            return res.send(error+'   ver');
        } else {
            return res.send("Server is ready to take our messages");
        }
      });

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

    const obj = JSON.parse(req.body.content);
    let id = obj[0].replace('@',''); id = id.replace('.','');
    
    admin.firestore().collection('requests').doc(`${id}`).set({
        email: obj[0],
        answers: [...obj.slice(1, 4), {...obj[4]}, {...obj[5]}, {...obj[6]}, obj[7]],
        price: obj[8],
        plan: obj[9],
    }).then(r =>  res.send('completed') 
    ).catch(err=> res.send(err) );

    const mailOptions = {
        from: `firebaseGCE@gmail.com`,
        to: `firebaseGCE@gmail.com,${obj[0]}`,
        subject: 'Gracias por confiar en nosotros',
        html: `<h1>Orden completada</h1>
                <p> <b>Email: </b>${obj[0]}</p>
                <p> <b>Answer1: ¿Qué tipo de web estás buscando? - </b>${obj[1]}</p>
                <p> <b>Answer2: ¿Qué diseño quieres que tenga tu Web? - </b>${obj[2]}</p>
                <p> <b>Answer3: ¿En qué etapa se encuentra tu web? - </b>${obj[3]}</p>
                <p> <b>Answer4: ¿Qué tanta información necesita tu web? - </b> paginas: ${obj[4][0]}, productos: ${obj[4][1]}, idiomas:${obj[4][2]}</p>
                <p> <b>Answer5: ¿Necesitas ayuda en la creación de textos o imágenes? - </b>${obj[5][0]}, ${obj[5][1]}, ${obj[5][2]}</p>
                <p> <b>Answer6: ¿Tu web necesita alguno de los siguientes? - </b>${obj[6][0]}, ${obj[6][1]}, ${obj[6][2]}</p>
                <p> <b>Answer7: ¿Tu web necesita servicios de SEO? - </b>${obj[7]}</p>
                <p> <b>Price: </b>${obj[8]} €</p>
                <p> <b>Plan: </b>${obj[9]}</p>
                <h2>Entremos en contacto: https://goconsultingeurope.com/start-selector/</h2>`
    };
    return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            res.send(error.toString());
            return
        }
        return res.send('Sended5');
    });
});

exports.setUserActionBuy = functions.https.onRequest((req, res) => {
    const obj = JSON.parse(req.body.email);
    let id = obj.replace('@',''); id = id.replace('.','');
    
    admin.firestore().collection('requests').doc(`${id}`).update({action: true}).then(r => res.send('completed') 
    ).catch(err=> res.send(err) );
});