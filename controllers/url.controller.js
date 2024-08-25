// const token = require('../utils/generateToken');
const crypto = require('crypto');
const urlModel = require('../models/url.models');



const generateToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = crypto.randomBytes(5);
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += characters.charAt(bytes.readUInt8(i) % characters.length);
    }
    return token;
}

exports.getLandingPage = (req, res, next) => {
    let msg = null;
    const urlMsg = req.flash('urlMsg');
    if (urlMsg.length > 0) {
        msg = urlMsg[0];
    }
    res.status(200).render('landing', {
        pageTitle: 'URL Shortener',
        errorCode: msg,
    })
}

exports.getDash = (req, res, next) => {
    let msg = null;
    const trackMsg = req.flash('trackMsg');
    if (trackMsg.length > 0) {
        msg = trackMsg[0];
    }
    res.status(200).render('dashboard', {
        pageTitle: 'Dashboard',
        errorCode: msg,
        clicks: '',
    });
}

exports.checkClicks = (req, res, next) => {
    const fullUrl = req.body.url;
    const extractUrl = fullUrl.split('/');
    const token = extractUrl[3];

    urlModel.findOne({ urlToken: token })
        .then((site) => {
            if (!site) {
                req.flash('trackMsg', 'Invalid URL')
                res.redirect('/dashboard');
            } else {

                let msg = null;
                const trackMsg = req.flash('trackMsg');
                if (trackMsg.length > 0) {
                    msg = trackMsg[0];
                }

                res.status(200).render('dashboard', {
                    pageTitle: 'Dashboard',
                    errorCode: msg,
                    clicks: site.clicks,
                });
            }
        })
        .catch(err => {
            console.log(err);
        })
}


exports.shortenUrl = (req, res, next) => {
    let validToken = null;
    let genToken = generateToken();
    const longUrl = `https://${req.body.url}/`;

    urlModel.findOne({ urlToken: genToken })
        .then((tk) => {
            if (!tk) {
                validToken = genToken;
                shortUrl = `https://127.0.0.1:3000/${validToken}`;
                req.flash('urlMsg', shortUrl);
                const genURL = new urlModel(
                    {
                        mainUrl: longUrl,
                        shortUrl: shortUrl,
                        urlToken: genToken,
                    }
                );
                genURL.save();
                res.redirect('/');
            } else {
                req.flash('urlMsg', 'Try Again..Something Wrong!!');
            }
        }).catch(err => {
            console.log(err);
        })

}


exports.redirectPage = (req, res, next) => {
    const token = req.params.token;
    urlModel.findOne({ urlToken: token })
        .then((site) => {
            if (site) {
                let click = Number.parseInt(site.clicks);
                click = click + 1;
                urlModel.updateOne(
                    { urlToken: token },
                    { clicks: click, }
                ).catch(err => {
                    console.log(err);
                })
                res.redirect(site.mainUrl);
            }
        })
        .catch(err => {
            console.log(err);
        })
}


exports.errorHandling = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
    })
}