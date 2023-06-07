const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const multer = require('multer');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser=require('body-parser');
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());

const conn = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "end_term",
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected with App...');
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/login', function(req, res) {
	let username = req.body.Username;
	let password = req.body.Password;
	if (username && password) {
		conn.query('SELECT * FROM registration WHERE Username = ? AND Password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                const Id = results[0].id;
                const token="your-token-string";
                res.cookie('token', token);
                res.cookie('username', username);
                res.cookie('Id', Id);
                res.json({success:true, token, Id});
                console.log(results);
			} else {
                res.status(401).json({error: "Incorrect username and/or password"});
			}
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
    res.end();
	}
});

app.post("/register", (req,res)=>{
    const mobile= req.body.MobNumber;
    const username=req.body.Username;
    const password= req.body.Password;
    const cpassword= req.body.Cpassword;
    if( mobile && username && password && cpassword){
        if(password==cpassword){
            let q=`SELECT * FROM registration WHERE Username = '${username}'`;
            conn.query(q,(err,result)=>{
                if(err)console.log(err);
                if(result.length>0){
                    res.send('User already exists');
                }
                else{
                    var sqlq=`INSERT INTO registration (MobNumber, Username, Password) VALUES ('${mobile}', '${username}', '${password}')`;
                    conn.query(sqlq,(err,result)=>{
                        if(err)console.log(err);
                        else{
                            req.session.username=username;
                            req.session.loggedin=true;
                            res.send("User created");
                        }
                    })
                }
            })
        }
        else{
            res.send("Password mismatch");
        }
    }
    else{
        res.send("fill all fields");
    }
});

app.get('/home2', (req, res) => {
  const query = 'SELECT * FROM posts'; // Modify the query if needed

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Error fetching blogs' });
    } else {
      res.json(results);
    }
  });
});

app.get('/posts', (req, res) => {
  const category = req.query.cat;
  console.log(category);
  let query = 'SELECT * FROM posts';

  if (category) {
    query += ` WHERE category = '${category}'`;
  }

  conn.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching posts from the database: ', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post('/write', upload.single('image'), (req, res) => {
  const { title, subtitle, category, body, createdUser } = req.body;
  const img = req.file ? req.file.filename : null;

  // Get current timestamp
  const currentTime = new Date().toISOString();

  // Prepare the SQL query to insert a new post
  const query = `
    INSERT INTO posts (title,subtitle, category, body, img, timeCreated, createdUser)
    VALUES (?, ?,?, ?, ?, ?, ?)
  `;

  // Execute the SQL query with the post data
  conn.query(
    query,
    [title,subtitle, category, body, img, currentTime, createdUser],
    (error, results) => {
      if (error) {
        console.error('Error saving post to the database: ', error);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        console.log('New post saved successfully');
        res.status(201).json({ message: 'Post created successfully' });
      }
    }
  );
});

app.get('/myblogs', (req, res) => {
  const username = req.query.username;

  if (!username) {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  const query = 'SELECT * FROM posts WHERE createdUser = ?';
  conn.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Error fetching user blogs' });
    } else {
      res.json(results);
    }
  });
});

app.delete('/blogs/:id', (req, res) => {
  const blogId = req.params.id;
  
  // Perform the deletion operation in the database
  const query = 'DELETE FROM posts WHERE id = ?';

  conn.query(query, [blogId], (error, results) => {
    if (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      console.log('Blog post deleted successfully');
      res.status(200).json({ message: 'Blog post deleted successfully' });
    }
  });
});

app.get('/blogs/:id', (req, res) => {
  const blogId = req.params.id;
  conn.query('SELECT * FROM posts WHERE id = ?', [blogId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const blog = results[0]; 

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blog);
  });
});


app.put('/blogs/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;

  // Extract the form data
  const { title,subtitle, body } = req.body;
  let image = null;

  // Check if a new image is selected
  if (req.file) {
    image = req.file.filename;
  }

  // Retrieve the current image value from the database
  const getImageSql = 'SELECT img FROM posts WHERE id = ?';
  conn.query(getImageSql, [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving current image');
      return;
    }

    // Get the current image value
    const currentImage = results[0].img;

    // Construct the SQL query
    let sql, updateValues;
    if (image) {
      // Update both the title, body, and image
      sql = 'UPDATE posts SET title = ?,subtitle=?, body = ?, img = ? WHERE id = ?';
      updateValues = [title,subtitle, body, image, id];
    } else {
      // Update only the title and body, keep the current image
      sql = 'UPDATE posts SET title = ?,subtitle=?, body = ? WHERE id = ?';
      updateValues = [title,subtitle, body, id];
    }

    // Execute the SQL query with the provided parameters
    conn.query(sql, updateValues, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error updating blog post');
      } else {
        console.log('Blog post updated successfully');
        res.send(results);
      }
    });
  });
});



app.listen(3001, () => {
    console.log("running on 3001");
})