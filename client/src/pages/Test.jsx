import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, TextField, Typography } from '@material-ui/core/node';
import Navbar from './Navbar';

const Test = ({ action }) => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    price: null,
    cover: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const bookId = location.pathname.split("/")[2];


  // Callback
  const handleChange = useCallback((e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, []);

  const handleFile = useCallback((e) => {
    setBook(prev => ({ ...prev, cover: e.target.files[0] }))
  }, []);
  const handleClick = useCallback(async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append('title', book.title)
      formData.append('desc', book.desc)
      formData.append('price', book.price)        
      formData.append('cover', book.cover)
      if (action === "add") {
        await axios.post("http://localhost:8800/books", formData, {headers: {'Content-Type': 'multipart/form-data'}})
      } else if (action === "update") {
        await axios.put(`http://localhost:8800/books/${bookId}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
      }
      // Навигация на главную страницу
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }, [action, book, bookId, navigate]);

  // Memoизация книги
  const memoizedBook = useMemo(() => book, [book]);

  return (
    <>
    <Navbar showSearch={false}/>
    <Container maxWidth = "md">
      <Typography variant="h4" gutterBottom mt="25px">
        {action === "add" ? "Добавить книгу" : "Изменить информацию о книге"}
      </Typography>
      <form onSubmit={handleClick}>
      <TextField
          label="Название"
          placeholder="Название"
          fullWidth
          margin="normal"
          name="title"
          value={memoizedBook.title}
          onChange={handleChange}
        />
      <TextField
          label="Описание"
          placeholder="Описание"
          fullWidth
          margin="normal"
          name="desc"
          value={memoizedBook.desc}
          onChange={handleChange}
        />
      <TextField
          label="Цена"
          placeholder="Цена"
          fullWidth
          margin="normal"
          name="price"
          value={memoizedBook.price}
          onChange={handleChange}
      />
      <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
      <Button
        variant="contained"
        component="label"
      >
        Загрузить обложку
      <input
        name="cover"
        type="file"
        hidden
        onChange={handleFile}/>
      </Button>
      <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{margin:"auto 0em"}}
        >
          {action === "add" ? "Добавить" : "Изменить"}
        </Button>
      </Container>
      </form>
    </Container>
    </>
  )
}

export default Test;

// useRef, useMemo, useCallback, стили, жизненный цикл компонента + mobx statetree, makeStyle(materialUI)