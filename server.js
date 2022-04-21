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

const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.post('/save', urlencodedParser, (req, res) => {
    let cvik = req.body.cvik;
    let vaha = req.body.vaha;
    let serie = req.body.serie;
    let opakovani = req.body.opakovani;
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
            res.render('results.pug', {
                cviky: data,
                nadpis: 'Cviky'
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