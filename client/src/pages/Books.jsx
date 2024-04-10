import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Books = (props) => {
  console.log(props)
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Книги</h1>
      <input
        type="text"
        placeholder="Поиск по названию"
        value={searchTerm}
        onChange={handleSearch}
      />
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
    </div>
  );
};

export default Books;
