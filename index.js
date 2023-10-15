const express = require('express')
const data = require('./src/mocks/blogs.json')
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

// local server
app.listen(port, () => {
    console.log("App listening on port 5000");
})


// routing
app.get('/', home)
app.get('/add-project', addproject)
app.post('/add-project', postproject)
app.get('/testimonial', testimonial)
app.get('/contact', contact)
app.get('/project-details/:id', projectdetail)
app.get('/delete-project/:id', deleteproject)

// variable get 
function home(req, res) {
    res.render('index', { blogs: data })
}

function addproject(req, res) {
    res.render('add-project')
}

function postproject(req, res) {
    const {
        id,
        title, 
        start_date, 
        end_date, 
        description, 
        node_js, 
        react_js, 
        next_js, 
        typescript, 
        file_upload 
    } = req.body
    
    const project = req.body

    data.unshift(project)

    res.redirect('/')
}

function testimonial(req, res) {
    res.render('testimonial')
}

function contact(req, res) {
    res.render('contact')
}

function projectdetail(req, res) {
    const { id } = req.params
    // const data = req.body
    res.render('project-details', { data })
}

function deleteproject(req, res) {
    const { id } = req.params

    data.splice(id, 1)
    res.redirect('/')
}