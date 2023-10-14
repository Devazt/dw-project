const express = require('express')
const path = require('path')
const app = express()
const port = 5000

// setup to call hbs
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/views'))

// parsing data from client
app.use(express.urlencoded({extended: false}))


// set static file server
app.use(express.static('src/assets'))

// routing
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/add-project', (req, res) => {
    res.render('add-project')
})

app.post('/add-project', (req, res) => {
    const data = req.body
    console.log(data);
})

app.get('/testimonial', (req, res) => {
    res.render('testimonial')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

// local server
app.listen(port, () => {
    console.log("App listening on port 5000");
})