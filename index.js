const express = require('express');
const fs = require('fs')
const path = require('path');
const app = express();
const port = 5000;
const mockDataPath = path.join(__dirname,'./src/mocks/blogs.json');
const moment = require('moment')

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
        const query = `SELECT * FROM tb_projects`
        let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

        const projects = obj.map((res) => ({
            ...res,
            author: "Nandy Septiana",
            createdAt: moment(res).format("dddd, DD MMMM YYYY")
        }))
        projects.forEach(project => {
                const duration = calculateDuration(project.start_date, project.end_date);
                project.duration = duration;
              });

        res.render('index', { projects });
    } catch (error) {
        console.log(error);
    }
}

function addproject(req, res) {
    res.render('add-project')
}

async function postproject(req, res) {
    try {
        const { title, start_date, end_date, description, node_js, react_js, next_js, typescript } = req.body
        const image = req.file.filename // image name saved on server
        const nodejs = node_js? true:false;
        const reactjs = react_js? true:false;
        const nextjs = next_js? true:false;
        const tscript = typescript? true:false;

        await sequelize.query(`INSERT INTO tb_projects (title, start_date, end_date, description, node_js, react_js, next_js, typescript, image, "createdAt", "updatedAt") VALUES ('${title}', '${start_date}', '${end_date}', '${description}', '${nodejs}', '${reactjs}', '${nextjs}', '${tscript}','${image}', NOW(), NOW())`)

        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

async function projectdetail(req, res) {
    try {
        const { id } = req.params
        const query = `SELECT * FROM tb_projects WHERE id=${id}`
        const obj = await sequelize.query(query, {type: QueryTypes.SELECT });
        const projects = obj.map((res) => ({
            ...res,
            author: "Nandy Septiana",
            start_date: moment(res.start_date).format("dddd, DD MMMM YYYY"),
            end_date: moment(res.end_date).format("dddd, DD MMMM YYYY")
        }));
        projects.map(project => {
            const duration = calculateDuration(project.start_date, project.end_date);
            project.duration = duration;
          });
        
        res.render('project-details', { projects: projects[0] });
    }catch (error) {
        console.log(error);
    }
};

async function editproject(req, res) {
    try {
        const { id } = req.params;
        const query = `SELECT * FROM tb_projects WHERE id=${id}`;
        const projects = await sequelize.query(query, {type: QueryTypes.SELECT});
        const project = projects.map((res) => {
            return {
                ...res,
                start_date: moment(res.start_date).format("YYYY-MM-DD"),
                end_date: moment(res.end_date).format("YYYY-MM-DD")
            }
        })


        res.render('edit-project', { project: project[0] });
    } catch (error) {
        console.log(error);
    }
}

async function updateproject(req, res) {
    try {
        const { id } = req.params
        const { title, start_date, end_date, description, node_js, react_js, next_js, typescript } = req.body
        const image = "image.jpg" // image name saved on server
        const nodejs = node_js? true:false;
        const reactjs = react_js? true:false;
        const nextjs = next_js? true:false;
        const tscript = typescript? true:false;
        
        await sequelize.query(`UPDATE tb_projects
            SET
                title = '${title}',
                start_date = '${start_date}',
                end_date = '${end_date}',
                description = '${description}',
                node_js = '${nodejs}',
                react_js = '${reactjs}',
                next_js = '${nextjs}',
                typescript = '${tscript}',
                image = '${image}',
                "updatedAt" = NOW()
            WHERE
                id = ${id}
                `)

        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}

async function deleteproject(req, res) {
    try {
        const { id } = req.params

        const data = await sequelize.query(`DELETE FROM tb_projects WHERE id=${id}`);
        res.redirect('/')
    } catch (error){
        console.log(error);
    }
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