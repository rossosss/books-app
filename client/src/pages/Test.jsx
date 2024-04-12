import React, { useState } from 'react';
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

  const handleChange = e => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }))
  };

  const handleFile = e => {
    setBook(prev => ({ ...prev, cover: e.target.files[0] }))
  };

  const handleClick = async e => {
    e.preventDefault();
    try {
      if (action === "add") {
        const formData = new FormData()
        formData.append('title', book.title)
        formData.append('desc', book.desc)
        formData.append('price', book.price)
        formData.append('cover', book.cover)
        await axios.post("http://localhost:8800/books", formData, {headers: {'Content-Type': 'multipart/form-data'}})
        } else if (action === "update") {
          const formData = new FormData()
          formData.append('title', book.title)
          formData.append('desc', book.desc)
          formData.append('price', book.price)
          formData.append('cover', book.cover)
          await axios.put(`http://localhost:8800/books/${bookId}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        }
      // Навигация на главную страницу
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

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
          value={book.title}
          onChange={handleChange}
        />
      <TextField
          label="Описание"
          placeholder="Описание"
          fullWidth
          margin="normal"
          name="desc"
          value={book.desc}
          onChange={handleChange}
        />
      <TextField
          label="Цена"
          placeholder="Цена"
          fullWidth
          margin="normal"
          name="price"
          value={book.price}
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
