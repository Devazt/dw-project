const express = require('express');
const fs = require('fs')
const path = require('path');
const app = express();
const port = 5000;
const mockDataPath = path.join(__dirname,'./src/mocks/blogs.json');

// Sequelize config
const config = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require("sequelize")
const sequelize = new Sequelize(config.development)

// setup to call hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// parsing data from client
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// set static file server
app.use(express.static('src/assets'));
app.use(express.static('src/public'));

// create helper
const hbs = require('hbs');
hbs.registerHelper('jsInclude', (array, value) => {
    return array.includes(value);
})

const imageDirectory = 'src/public/images'; // directory images

// middleware for images
const multer = require('multer');
const { error } = require('console');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDirectory); // change directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });


// local server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

// routing
app.get('/', home)
app.get('/add-project', addproject)
app.post('/project/add', upload.single('image'), postproject)
app.get('/testimonial', testimonial)
app.get('/project-details/:id', projectdetail)
app.get('/project/:id/edit', editproject)
app.post('/project/:id/update', updateproject)
app.get('/project/:id/delete', deleteproject)
app.get('/contact', contact)

// render route 
async function home(req, res) {
    try {
        const query = `SELECT id, title, start_date, end_date, technologies, description, image, "createdAt" FROM tb_projects`
        let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

        const projects = obj.map((res) => ({
            ...res,
            author: "Nandy Septiana"
        }))
        projects.forEach(project => {
                const duration = calculateDuration(project.start_date, project.end_date);
                project.duration = duration;
              });

        res.render('index', { projects });
    } catch (error) {
        console.log(error);

    }
    // const projects = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
    // projects.forEach(project => {
    //     const duration = calculateDuration(project.start_date, project.end_date);
    //     project.duration = duration;
    //     project.imagePath = path.join('/', imageDirectory, project.image);
    //   });

}

function addproject(req, res) {
    res.render('add-project')
}

function postproject(req, res) {
    // get the form data
    const { title, start_date, end_date, description, technologies } = req.body
    const image = req.file.filename // image name saved on server
    const newProject = {
        id: generateProjectId(), // create function for generate unique ID
        title,
        start_date,
        end_date,
        description,
        technologies: Array.isArray(technologies) ? technologies : [technologies],
        image,
    };

    //save the project to mock data
    const projects = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
    projects.push(newProject);
    console.log(newProject);

    // save the updated mock data
    fs.writeFileSync(mockDataPath, JSON.stringify(projects, null, 2));

    // redirect to homepage
    res.redirect('/');
}

function projectdetail(req, res) {
    const projectId = parseInt(req.params.id);
    const projects = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
    const project = projects.find(p => p.id === projectId);

    const duration = calculateDuration(project.start_date, project.end_date);
    project.duration = duration;

    res.render('project-details', { project });
};

function editproject(req, res) {
    const projectId = parseInt(req.params.id);
    const projects = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
    const project = projects.find(p => p.id === projectId);    

    res.render('edit-project', { project });
    console.log(projects);
}

function updateproject(req, res) {
    const projectId = parseInt(req.params.id);
    const udpatedProject = req.body; // get data from existing form
    const projects = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));

    // update project with same ID
    const projectIndex = projects.findIndex(p => p.id === projectId);
    projects[projectIndex] = {...projects[projectIndex], ...udpatedProject};

    // save back to mock.json
    fs.writeFileSync(mockDataPath, JSON.stringify(projects, null, 2));
    res.redirect('/')
}

function deleteproject(req, res) {
    const projectId = parseInt(req.params.id);
    const projects = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex !== -1) {
        projects.splice(projectIndex, 1);
        fs.writeFileSync(mockDataPath, JSON.stringify(projects, null, 2));
    }

    res.redirect('/')
}

// generate unique ID
function generateProjectId() {
    const projects = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
    const maxId = projects.reduce((max, project) => (project.id > max ? project.id : max), 0);
    return maxId + 1;
}

function testimonial(req, res) {
    res.render('testimonial')
}

function contact(req, res) {
    res.render('contact')
}


// calculate duration
function calculateDuration(start_date, end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const duration = end - start;
  
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 4.345); // 4.345 minggu dalam sebulan rata-rata
    const years = Math.floor(months / 12);
  
    return {
      years,
      months: months % 12,
      weeks: weeks % 4.345,
      days: days % 7,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
    };
  }