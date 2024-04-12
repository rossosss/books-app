import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Book from './Book';
import { Box, Button, Container, Grid } from '@material-ui/core/node';


const Books = (props) => {
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

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar onSearch={handleSearch} showSearch={true}/>

      <Container>
        <Grid container spacing={2}>
          {filteredBooks.map(book => (
            <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}> {/* Используем Grid для распределения */}
              <Book book={book} handleDelete={handleDelete} /> {/* Используем компонент Book */}
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="center" mt={10}> {/* Используем Box для выравнивания кнопки по центру */}
          <Button component={Link} to="/add" variant="contained" color="primary" style={{ marginTop: '15px' }}>Добавить новую книгу</Button>
        </Box>
      </Container>
    </>
  );
};

export default Books;
