require('dotenv').config()
const axios = require('axios')
const cheerio = require('cheerio')
const express = require("express");
const app = express();
const cors = require("cors")
const port = 5000;
const bodyparser = require('body-parser');
const { request } = require('express');
const { body, validationResult } = require('express-validator');
var nodemailer = require('nodemailer');
const mailPass = process.env.EMAIL_PASS2;

app.use(express.static('static'))
app.use(bodyparser.urlencoded())
app.use(express.static('static'))
app.use(bodyparser.json()); // support json encoded bodies
app.use(bodyparser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())

const authifyEncrytionController = process.env.ENCYPTIONID;


app.get('/', async (req, res) => {

    try {

        const url = 'http://ipu.ac.in/notices.php'
        const date = new Date;
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthName = ["January", "Februrary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const constructor = monthName[month] + String(year);

        let dataTosend =
        {
            textC: [],
            linkC: [],
            textM: [],
            linkM: [],
        }


        const getData = async (monthName, link = url) => {
            try {
                const response = await axios.get(link, {
                    headers: {
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Accept-Encoding": "gzip, deflate"
                    }
                })

                const $ = cheerio.load(response.data);

                // const urls = $('td > a').prop('href');
                let textDataCurrent = [];
                let linksDataCurrent = [];

                dataTosend.textC = textDataCurrent;
                dataTosend.linkC = linksDataCurrent;

                var dataCurrent = $('tr:not([class]) > td:not([align]) > a').map(function () {
                    textDataCurrent.push($(this).text().trim());
                    return $(this).text();   // or just `return this.title`
                }).get()

                var linksCurrent = $('tr:not([class]) > td:not([align]) > a').map(function () {
                    linksDataCurrent.push($(this).attr('href'));
                    return $(this).attr('href');   // or just `return this.title`
                }).get()



                if (link == 'http://ipu.ac.in/notices.php') {

                    let textDataMonth = [];

                    var dataMonth = $(`tr[class=${monthName}] > td > a`).map(function () {
                        textDataMonth.push($(this).text().trim());
                        return $(this).text();   // or just `return this.title`
                    }).get()

                    let linksDataMonth = [];

                    var linksMonth = $(`tr[class=${monthName}] > td > a`).map(function () {
                        linksDataMonth.push($(this).attr('href'))
                        return $(this).attr('href');   // or just `return this.title`
                    }).get()


                    textDataCurrent.shift();

                    // console.log(textDataMonth);
                    // console.log(linksDataMonth);
                    dataTosend.textM = textDataMonth;
                    dataTosend.linkM = linksDataMonth;
                }



                // console.log(textDataCurrent);
                // console.log(linksDataCurrent);

            }
            catch (error) {
                res.json(error);
            }
        }

        await getData(constructor);
        // console.log(dataTosend)
        res.json(dataTosend)

    } catch (error) {
        res.json(error);
    }
})



app.post('/url', [
    body('url', "Please enter a valid url").isLength({ min: 10 }),
    body('url', "Please enter a valid url").isURL(),
    body('authifyEncrytion', "Please enter a valid encyption id").isLength({ min: 34 }),

], async (req, res) => {


    const errorsInInput = validationResult(req);
    if (!errorsInInput.isEmpty()) {
        return res.status(400).json({ error: errorsInInput.array() });
    }

    if (req.body.authifyEncrytion != authifyEncrytionController) {
        return res.status(404).json({ msg: "NOT ALLOWED" })
    }

    try {

        const url = req.body.url;
        const date = new Date;
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthName = ["January", "Februrary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const constructor = monthName[month] + String(year);

        let dataTosend =
        {
            textC: [],
            linkC: [],
            textM: [],
            linkM: [],
        }


        const getData = async (monthName, link = url) => {
            try {
                const response = await axios.get(link, {
                    headers: {
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Accept-Encoding": "gzip, deflate"
                    }
                })

                const $ = cheerio.load(response.data);

                // const urls = $('td > a').prop('href');
                let textDataCurrent = [];
                let linksDataCurrent = [];

                dataTosend.textC = textDataCurrent;
                dataTosend.linkC = linksDataCurrent;

                var dataCurrent = $('tr:not([class]) > td:not([align]) > a').map(function () {
                    textDataCurrent.push($(this).text().trim());
                    return $(this).text();   // or just `return this.title`
                }).get()

                var linksCurrent = $('tr:not([class]) > td:not([align]) > a').map(function () {
                    linksDataCurrent.push($(this).attr('href'));
                    return $(this).attr('href');   // or just `return this.title`
                }).get()



                if (link == 'http://ipu.ac.in/notices.php') {

                    let textDataMonth = [];

                    var dataMonth = $(`tr[class=${monthName}] > td > a`).map(function () {
                        textDataMonth.push($(this).text().trim());
                        return $(this).text();   // or just `return this.title`
                    }).get()

                    let linksDataMonth = [];

                    var linksMonth = $(`tr[class=${monthName}] > td > a`).map(function () {
                        linksDataMonth.push($(this).attr('href'))
                        return $(this).attr('href');   // or just `return this.title`
                    }).get()


                    textDataCurrent.shift();

                    // console.log(textDataMonth);
                    // console.log(linksDataMonth);
                    dataTosend.textM = textDataMonth;
                    dataTosend.linkM = linksDataMonth;
                }

                // console.log(textDataCurrent);
                // console.log(linksDataCurrent);

            }
            catch (error) {
                res.json(error);
            }
        }

        await getData(constructor);
        // console.log(dataTosend)
        res.json(dataTosend)
    }
    catch (error) {
        res.json(error);
    }
})

const authifyMailer = (to, sub = "Bienvenue à bord! You have been subscribed for new notices and updates", body = "Bienvenue à bord! We are glad to inform you that you have been subscribed now for new notices and updates. As soon as a new notice comes up, you'll receive a notification from Us.\n\nThank you\nError_404") => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'developer.authify@gmail.com',
            pass: mailPass
        }
    });

    var mailOptions = {
        from: 'developer.authify@gmail.com',
        to: to,
        subject: sub,
        text: body,
    };

    try {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ success: true });
                return true
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }

}

app.post('/notifyme', [
    body('to', "Please enter a valid email").isLength({ min: 10 }),
    body('to', "Please enter a valid email").isEmail(),
], async (req, res) => {

    const errorsInInput = validationResult(req);
    if (!errorsInInput.isEmpty()) {
        return res.status(400).json({ error: errorsInInput.array() });
    }

    try {

        if (req.body.new == "1") {
            await authifyMailer(req.body.to, "Alert! New Notice has been posted on the website.", "You have received a new notice on the website. To look more into the notice, What's it's all about? Kindly visit the website\n\nThank you\nError_404");
            res.status(200).json({ success: true });
        }
        else {
            await authifyMailer(req.body.to);
            res.status(200).json({ success: true });
        }

    }
    catch (error) {
        res.json(error)
    }

})



app.listen(process.env.PORT || port, () => {
    console.log(`Server started on  port ${port}`);
})


