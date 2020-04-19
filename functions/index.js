const functions = require('firebase-functions');
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');
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
        date: obj[10],
        dateText: obj[11]
    }).then(r =>  res.send('completed') 
    ).catch(err=> res.send(err) );

    const mailOptions = {
        from: `firebaseGCE@gmail.com`,
        to: [`${obj[0]}`, 'firebaseGCE@gmail.com'],
        subject: 'Gracias por confiar en nosotros',
        html: get_html(obj)
    };
    return transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            res.send(error.toString());
            return
        }
        return res.send('Sended5');
    });
});

function get_html(obj) {
    return `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Mail Template</title></head><style>*{font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif; font-weight: normal;line-height: 150%; color: #757575}span{color: #7C33FF;font-weight: bold;}hr{opacity: .2; margin-bottom: 20px;}button{border: 2px solid #7C33FF; background: none; box-sizing: border-box; width: 140px; height: 55px; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1); border-radius: 5px; margin: 0 230px;}button a{color: #7C33FF; text-decoration: none; font-weight: bold;}.btn2{background-color: #7C33FF;}.btn2 a{color: white;}body{display: flex; justify-content: center; align-items: center; flex-direction: column;}.banner{width: 90%; background-color: #F7F7F7; padding: 40px; margin-bottom: 20px; display: flex; justify-content: center; align-items: center; flex-direction: column;}.banner img{width: 250px;}.banner h1{color: #7C33FF; margin-bottom: 0;}.col{width: 600px;}.col img{width: 600px;}h3{color: #444444; font-weight: bolder;}.col .row{display: flex; justify-content: center; align-items: center; flex-direction: row; flex-wrap: wrap; margin-top: 50px;}.col .row .response{width: 280px; text-align: center; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 0 10px 40px;}.col .row .response .option{background: #FCFCFC; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1); padding: 10px; margin-bottom: 10px;}.col .row .response .option img{width: 200px;}.col .row .response h3{margin: 0; color: #9933ff;}.col .row .response p{margin: 0;}.ending{text-align: center;}.ending *{margin: 0; margin-top: 10px;}.ending h3{margin-top: 30px;}footer{text-align: center; background-color: #333333; padding: 45px 40px 63px; width: 90%; margin-top: 20px;}footer hr{width: 40%;}footer *:not(hr){color: white; margin: 0; margin-top: 5px;}</style><body> <div class="banner"> <img src="./logo.svg" alt="logo"> <h1>Your website quote has arrived!</h1> </div><div class="col"> <h3>Hi there visitor!</h3> <p>Thanks for using our quotes app in GoConsulting.com.</p><p>Here you can find the estimated total price for your website at the bottom of this email, which would be based on your responses. You can also review your answers and edit them if you need to: <a href="">just create an user with the same email address you used on the quotes app.</a></p><h3>Your recommended plan is: <span>Growth Plan</span></h3> <p>Your website might be an e-commerce with online payments, could have multiple languages, and a system for user registration and suscriptions management.</p><p>If you are looking to level up with custom integrations, or custom developments like web applications, then a Custom Plan might be better for you.</p><h3>Review Your Answers</h3> <img src="./nav.svg" alt="nav"> <div class="row"> <div class="response"> <div class="option"> <img src="22.svg" alt="img"> </div><h3>What kind of website</h3> <p>You selected: <span>Virtual Store</span></p></div><div class="response"> <div class="option"> <img src="22.svg" alt="img"> </div><h3>What kind of website</h3> <p>You selected: <span>Virtual Store</span></p></div><div class="response"> <div class="option"> <img src="22.svg" alt="img"> </div><h3>What kind of website</h3> <p>You selected: <span>Virtual Store</span></p></div><div class="response"> <div class="option"> <img src="22.svg" alt="img"> </div><h3>What kind of website</h3> <p>You selected: <span>Virtual Store</span></p></div><div class="response"> <div class="option"> <img src="22.svg" alt="img"> </div><h3>What kind of website</h3> <p>You selected: <span>Virtual Store</span></p></div><div class="response"> <div class="option"> <img src="22.svg" alt="img"> </div><h3>What kind of website</h3> <p>You selected: <span>Virtual Store</span></p></div><div class="response"> <div class="option"> <img src="22.svg" alt="img"> </div><h3>What kind of website</h3> <p>You selected: <span>Virtual Store</span></p></div></div><hr> <button><a href="https://goconsultingeurope.com/start/">Edit answers</a></button> <div class="ending"> <h3>And now the best part...</h3> <p>Your recommended plan includes everything you have selected, plus</p><span>One Full Year of Hosting, 100% Free.</span> <h3>Estimated Price: <span>493 €</span></h3> <p>Ready to go to the next level?</p><button class="btn2"><a href="https://goconsultingeurope.com/start/">Let's Start</a></button> <h3>Does it differ from your budget?</h3> <p style="text-align: left;">We want to fully understand you and deliver the best solution to your case. You can <a style="color: #7C33FF;" href="https://goconsultingeurope.com/assist/">schedule a free call or meeting</a> if you have any question or want to talk about your expectations; and if you need to re-think your answers you can always use the "Edit Answers" buttom above this section. </p></div></div><footer> <hr/> <p>Copyright © *|CURRENT_YEAR|* Go Consulting Europe, All rights reserved.</p><p>Our mailing address is:</p><a href="mailto:info@goconsultingeurope.com">info@goconsultingeurope.com</a> <p>Want to change how you receive these emails?</p><p>You can update your preferences or unsubscribe from this list.</p></footer></body></html>`/*`<h1>Orden completada</h1> nuevo
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
                <h2>Entremos en contacto: https://goconsultingeurope.com/start-selector/</h2>`*/
}

//////////////////////////////////////////////////////////////////////////////////// CRUD EXPRESS

app.put('/setUserActionBuy', (req, res) => {
    const obj = req.query.email;
    let id = obj.replace('@',''); id = id.replace('.','');
    admin.firestore().collection('requests').doc(`${id}`).update({action: true}).then(r => res.send('completed')).catch(err=> res.send(err) );
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