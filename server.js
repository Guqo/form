const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/* Nastavuje adresu tzv. statických souborů */
app.use(express.static('public'));

/* Nastavení endpointu, na kterém server provede odpověď a pošle klientovi */
// app.get('/about', (req, res) => {
//     res.send('Webserver IT2')
//     res.end();
// });

/* Endpoint serveru očekávající dva parametry - user a password */
/* Příklad URL: http://localhost:3000/secret?user=Pepa&password=007 */
// app.get('/secret', (req, res) => {
//     let user = req.query.user;
//     let password = req.query.password;
//     res.send(`Uživatel: ${user} | heslo: ${password}`);
//     res.end();
// });

// app.get('/save', (req, res) => {
//     let cvik = req.query.cvik;
//     let vaha = req.query.vaha;
//     let serie = req.body.serie;
//     let opakovani = req.body.opakovani;
//     res.send(`Cvik: ${cvik} | Váha: ${vaha} | Série: ${serie} | Opakování ${opakovani}`);
//     res.end();
// });

const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.post('/save', urlencodedParser, (req, res) => {
    let cvik = req.body.cvik;
    let vaha = req.body.vaha;
    let serie = req.body.serie;
    let opakovani = req.body.opakovani;
    let date = new Date();
    let str = `${cvik},${vaha},${serie},${opakovani}\n`;
    fs.appendFile('./data/result.csv', str, function(err) {
        if (err) {
            console.error(err);
            return res.status(400).json({
                success: false,
                message: 'Byla zjištěna chyba při zápisu do souboru'
            });
        }
    });
    res.redirect(301, '/');
});

app.get('/results', (req, res) => {
    csv().fromFile('./data/result.csv')
        .then(data => {
            console.log(data);
            // res.send(data);
            res.render('results.pug', {
                'players': data,
                'nadpis': 'Cviky'
            });
        })
        .catch(err => {
            console.log(err);
        })
});


/* Spuštění web serveru, který naslouchá na portu 3000 */
app.listen(port, () => {
    console.log(`Server funguje na portu ${port}`);
});