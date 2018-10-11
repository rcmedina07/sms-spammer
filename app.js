const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mms = require('./src/twilio/sendMms');

const app = express();

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './src/public')));
app.use(express.static(path.join(__dirname, './dist')));

app.set('views', './src/views');
app.engine('html', require('ejs').renderFile);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, () => {
  console.log("Runing in port 3000");
});

app.get('/', (req, res) => res.render('index.html'));

app.post('/mms', (req, res) => {
    const { numbers, message, url, count } = req.body;
    const promisesEjecution = [];

    numbers.forEach((number) => {
        for (let i = 0; i < count; i++) {
            promisesEjecution.push(mms.sendMms(number, message, url));
        }
    });
    return Promise.all(promisesEjecution).then(data => {
        return res.sendStatus(200);
    }).catch(err => {
        return res.sendStatus(500);
    });
});