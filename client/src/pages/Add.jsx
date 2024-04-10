import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [book, setBook] = useState({
    title:"",
    desc:"",
    price:null,
    cover:null,
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setBook(prev => ({...prev, [e.target.name]: e.target.value}))
  };

  const handleFile = e => {
    setBook(prev => ({...prev, cover: e.target.files[0]}))
  };

  const handleClick = async e => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', book.title)
      formData.append('desc', book.desc)
      formData.append('price', book.price)
      formData.append('cover', book.cover)
      await axios.post("http://localhost:8800/books", formData, {headers: {'Content-Type': 'multipart/form-data'}})
      navigate("/")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='form'>
      <h1>Добавить книгу</h1>
      <input type="text" placeholder='Название' onChange={handleChange} name='title' />
      <input type="text" placeholder='Описание' onChange={handleChange} name='desc' />
      <input type="number" placeholder='Цена' onChange={handleChange} name='price' />
      <input type="file" onChange={handleFile} name='cover' />
      <button className='formButton' onClick={handleClick}>Добавить</button>
    </div>
  )
}

export default Add
