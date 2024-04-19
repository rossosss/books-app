import express, { json } from "express";
import mysql from "mysql";
import cors from "cors";
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"root",
  database:"test"
})

app.use(express.json()); 
app.use(cors());

const secretKey = "example";
const saltRounds = 10;


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

// Работа с книгами

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

// Работа с пользователями

app.post("/register", (req, res) => {
  const { login, password } = req.body;
  // Проверяем, что все необходимые поля присутствуют
  if (!login || !password) {
    return res.status(400).json({ message: "Необходимы логин и пароль" });
  }
  // Хэшируем пароль
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка хеширования пароля" });
    }
    // Вставляем нового пользователя в базу данных
    const q = "INSERT INTO users (login, password) VALUES (?, ?)";
    db.query(q, [login, hash], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Ошибка при добавлении пользователя" });
      }
      return res.status(201).json({ message: "Пользователь успешно зарегистрирован" });
    });
  });
});

// Логин пользователя

app.post("/login", (req, res) => {
  const { login, password } = req.body;
  // Проверяем, что все необходимые поля присутствуют
  if (!login || !password) {
    return res.status(400).json({ message: "Необходимы логин и пароль" });
  }
  // Получаем данные пользователя из базы данных по логину
  const q = "SELECT * FROM users WHERE login = ?";
  db.query(q, [login], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка при поиске пользователя" });
    }
    // Проверяем, найден ли пользователь
    if (result.length === 0) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }
    // Сверяем хэшированный пароль пользователя с введенным паролем
    bcrypt.compare(password, result[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: "Ошибка при проверке пароля" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Неверный логин или пароль" });
      }
      // Аутентификация успешна, возвращаем информацию о пользователе
      const token = jwt.sign({ userId: result[0].id, login: result[0].login }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ message: "Вход выполнен успешно", user: result[0], token });
    });
  });
});


app.listen(8800, () => {
  console.log("Connected to backend!");
})

