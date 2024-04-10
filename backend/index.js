import express, { json } from "express";
import mysql from "mysql";
import cors from "cors";
import multer from 'multer';

const app = express();

const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"root",
  database:"test"
})

app.use(express.json()); 
app.use(cors());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../client/public/uploads')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.json("hello this is backend");
})

app.get("/books", (req, res) => {
  const q = "SELECT * FROM test.books;";
  db.query(q, (err, data) => {
    if(err) return res.json(err)
    return res.json(data);
  })
})

app.post("/books", upload.single("cover"), (req, res) => {
  const q = "INSERT INTO books (`title`, `desc`, `cover`, `price`) VALUES (?,?,?,?)";
  const values = [
    req.body.title,
    req.body.desc,
    req.file.filename,
    req.body.price,
  ];

  db.query(q, values, (err, data) => {
    if(err) return res.json(err)
    return res.json("Книга создана");
  })
})

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?"

  db.query(q, [bookId], (err, data) => {
    if(err) return res.json(err)
    return res.json("Книга удалена");
  })
})

app.put("/books/:id", upload.single("cover"), (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title` = ?, `desc` = ?, `cover` = ?, `price` = ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.file.filename,
    req.body.price,
  ];
  db.query(q, [...values, bookId], (err, data) => {
    if(err) return res.json(err)
    return res.json("Книга обновлена");
  })
})

app.listen(8800, () => {
  console.log("Connected to backend!");
})

