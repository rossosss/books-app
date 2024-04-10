// Book.jsx
import { Link } from '@material-ui/core/node';
import React from 'react';

const Book = ({ book, handleDelete }) => {
  return (
    <div className="book" key={book.id}>
      <img src={`../uploads/${book.cover}`} alt="" />
      <h2>{book.title}</h2>
      <p>{book.desc}</p>
      <span>{book.price}</span>
      <button className='delete' onClick={() => handleDelete(book.id)}>Удалить</button>
      <button className='update'><Link to={`/update/${book.id}`}>Изменить</Link></button>
    </div>
  );
};

export default Book;
