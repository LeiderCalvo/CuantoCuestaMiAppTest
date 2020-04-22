const functions = require('firebase-functions');
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');
var Email = require('email-templates');
const express = require('express');
const cors = require('cors');

admin.initializeApp(functions.config().firebase);

const app = express();
app.use(cors({ origin: true }));

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
const email = new Email({
    message: {
        from: 'firebaseGCE@gmail.com',
    },
    //send: true,
    transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'firebaseGCE@gmail.com',
            pass: 'Conexion_2020'
        }
    },
    views: {
        options: {
          extension: 'ejs' 
        }
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
        date: obj[10],
        dateText: obj[11]
    }).then(r =>  res.send('completed') 
    ).catch(err=> res.send(err) );

    return email.send({
        template: 'quoteResponse',
        message: {
          to: [`${obj[0]}`, 'firebaseGCE@gmail.com'],
          subject: 'Gracias por confiar en nosotros'
        },
        locals: {
            email: obj[0],
            webType: obj[1],
            design: obj[2],
            etage: obj[3],
            ans4: `${obj[4][0]} sections, ${obj[4][1]} products, ${obj[4][2]} languages`,
            ans5: obj[5][0]+' ,'+obj[5][1]+' ,'+obj[5][2],
            ans6: obj[6][0]+' ,'+obj[6][1]+' ,'+obj[6][2],
            ans7: obj[7],
            price: obj[8],
            plan: obj[9],
            date: obj[10],
            dateText: obj[11]
        }
      })
      .then( r => res.send(r))
      .catch(console.error);
});
//////////////////////////////////////////////////////////////////////////////////// CRUD EXPRESS

app.put('/setUserActionBuy', (req, res) => {
    const obj = req.query.email;
    let id = obj.replace('@',''); id = id.replace('.','');
    admin.firestore().collection('requests').doc(`${id}`).update({action: true}).then(r => res.send('completed')).catch(err=> res.send(err) );
});

app.put('/updateUser', (req, res) => {
    const email = req.query.email,
        obj = JSON.parse(req.query.obj);

    let id = email.replace('@',''); id = id.replace('.','');
    admin.firestore().collection('requests').doc(`${id}`).
    update(obj).then(r => res.send('completed')).catch(err=> res.send(err) );
});

app.get('/getUserDocument', (req, res) => {
    const obj = req.query.email;
    let id = obj.replace('@','');
    id = id.replace('.','');
    
    admin.firestore().collection('requests').doc(`${id}`).get()
    .then(doc => {
        if (!doc.exists) {
            return res.send('Not Found')
        } 
        return res.send( doc.data() );
    } 
    ).catch(err=> res.send(err) );
});

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);