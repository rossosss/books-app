import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Book from './Book';


const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log(props)
    const fetchAllBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8800/books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/books/${id}`);
      window.location.reload();
    } catch (err) {
      if (err.response.status === 404) {
        console.log('OST 404');
      } else {
        console.log(err);
      }
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar onSearch={handleSearch}/>
      <h1>Книги</h1>
      <div className="books">
        {filteredBooks.map(book => (
          <div className="book" key={book.id}>
            <img src={`../uploads/${book.cover}`} alt="" />
            <h2>{book.title}</h2>
            <p>{book.desc}</p>
            <span>{book.price}</span>
            <button className='delete' onClick={() => handleDelete(book.id)}>Удалить</button>
            <button className='update'><Link to={`/update/${book.id}`}>Изменить</Link></button>
          </div>
        ))}
      </div>
      <button><Link to="/add">Добавить новую книгу</Link></button>
    </>
  );
};

export default Books;
