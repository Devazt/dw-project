const express = require('express');
const fs = require('fs')
const path = require('path');
const app = express();
const port = 5000;
const moment = require('moment')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')

// Sequelize config
const config = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require("sequelize")
const sequelize = new Sequelize(config.development)

// setup to call hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// parsing data from client
app.use(express.urlencoded({extended: false}));

// set static file server
app.use(express.static('src/assets'));
app.use(express.static('src/public/images'));

// setup flash
app.use(flash());

app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 2,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "thisIsSecret",
  })
);

const imageDirectory = 'src/public/images'; // directory images

// middleware for images
const multer = require('multer');
const { error } = require('console');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDirectory); // change directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g,""));
  }
});
const upload = multer({ storage: storage });


// local server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

// routing
app.get('/', home);
app.get('/add-project', addproject);
app.post('/project/add', upload.single('image'), postproject);
app.get('/testimonial', testimonial);
app.get('/project/:id/detail', projectdetail);
app.get('/project/:id/edit', editproject);
app.post('/project/:id/update', upload.single('image'), updateproject);
app.get('/project/:id/delete', deleteproject);
app.get('/contact', contact);
app.get('/register', register);
app.get('/login', login);
app.post('/register', newUser);
app.post('/login', loggedOn);

// logout user
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });

// render route 
async function home(req, res) {
    try {
        const query = `SELECT tb_projects.*, users.name AS author FROM tb_projects LEFT JOIN users ON tb_projects.author = users.id`
        const obj = await sequelize.query(query, {type: QueryTypes.SELECT});
        const project = obj.map((res) => ({
            ...res,
            duration: calculateDuration(res.start_date, res.end_date),
            createdAt: moment(res.createdAt).format("dddd, DD MMMM YYYY"),
            isLogin: req.session.isLogin,
            user: req.session.user
        }));
    res.render('index', {
        projects: project,
        isLogin: req.session.isLogin,
        user: req.session.user,
        })
    } catch (error) {
        console.log(error);
    }
}



function addproject(req, res) {
    res.render('add-project', {
        isLogin: req.session.isLogin,
        user: req.session.user
    })
}

async function postproject(req, res) {
    try {
        const { title, start_date, end_date, description, node_js, react_js, next_js, typescript } = req.body
        const image = req.file.filename // image name saved on server
        const idUser = req.session.idUser;
        const nodejs = node_js? true:false;
        const reactjs = react_js? true:false;
        const nextjs = next_js? true:false;
        const tscript = typescript? true:false;

        await sequelize.query(`INSERT INTO tb_projects (title, start_date, end_date, description, author, node_js, react_js, next_js, typescript, image, "createdAt", "updatedAt") VALUES ('${title}', '${start_date}', '${end_date}', '${description}', '${idUser}', '${nodejs}', '${reactjs}', '${nextjs}', '${tscript}','${image}', NOW(), NOW())`)

        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

async function projectdetail(req, res) {
    try {
        const { id } = req.params
        const query = `SELECT tb_projects.*, users.name AS author FROM tb_projects LEFT JOIN users ON tb_projects.author = users.id WHERE tb_projects.id=${id}`
        const obj = await sequelize.query(query, {type: QueryTypes.SELECT });
        const projects = obj.map((res) => ({
            ...res,
            start_date: moment(res.start_date).format("dddd, DD MMMM YYYY"),
            end_date: moment(res.end_date).format("dddd, DD MMMM YYYY"),
            duration: calculateDuration(res.start_date, res.end_date)
        }));
        
        res.render('project-details', { projects: projects[0], isLogin: req.session.isLogin, user: req.session.user });
    }catch (error) {
        // console.log(error);
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


        res.render('edit-project', { project: project[0], isLogin: req.session.isLogin, user: req.session.user });
        console.log(project);
    } catch (error) {
        console.log(error);
    }
}

async function updateproject(req, res) {
    try {
        const { id } = req.params
        const { title, start_date, end_date, description, node_js, react_js, next_js, typescript, } = req.body;
        const image = req.file.filename;
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
                console.log(image);

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

function testimonial(req, res) {
    res.render('testimonial', {
        isLogin: req.session.isLogin,
        user: req.session.user
    })
}

function contact(req, res) {
    res.render('contact',{
        isLogin: req.session.isLogin,
        user: req.session.user
    })
}

function register(req, res) {
    res.render('register')
}

async function newUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const salt = 10;

        await bcrypt.hash(password, salt, (err, hashPassword) => {
            const query = `INSERT INTO users (name, email, password, "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hashPassword}', NOW(), NOW())`;

            sequelize.query(query);
        });
        res.redirect('login');
    } catch (error) {
        console.log(error);
    }
}

function login(req, res) {
    res.render('login')
}

async function loggedOn(req, res) {
    try {
        const { email, password } = req.body;
        const query = `SELECT * FROM users WHERE email = '${email}'`;
        let obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    
        console.log(obj);
    
        if (!obj.length) {
          req.flash("danger", "You Must Be Registered First");
          return res.redirect("/login");
        }
    
        await bcrypt.compare(password, obj[0].password, (err, result) => {
          if (!result) {
            req.flash("danger", "Wrong Password");
            return res.redirect("/login");
          } else {
            req.session.isLogin = true;
            req.session.user = obj[0].name;
            req.session.idUser = obj[0].id;
            req.flash("success", "Login Success!");
            res.redirect("/");
          }
        });
      } catch (error) {
        console.log(error);
      }
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