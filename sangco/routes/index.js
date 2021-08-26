const express = require('express')
const router = express.Router()

const template = require('../template')

const auth = require('../lib/auth')

router.get('/', (req, res) => {
    const title = 'Welcome';
    const description = 'Hello Node.js'
    const list = template.List(req.list);
    const html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/topic/create"> create</a>`,
        auth.statusUI(req,res))
    res.send(html)
})

module.exports = router;