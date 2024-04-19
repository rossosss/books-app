import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Book from './Book';
import { Box, Button, Container, Grid } from '@material-ui/core/node';


const Books = (props) => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  // UseRef
  const fetchAllBooksRef = useRef();

  useEffect(() => {
    fetchAllBooksRef.current = async () => {
      try {
        const res = await axios.get("http://localhost:8800/books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBooksRef.current();
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:8800/books/${id}`);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    } catch (err) {
      if (err.response.status === 404) {
        console.log('OST 404');
      } else {
        console.log(err);
      }
    }
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Мемоизация списка книг
  const filteredBooks = useMemo(() => {
    return books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);
  return (
    <>
      <Navbar onSearch={handleSearch} showSearch={true}/>

      <Container>
        <Grid container spacing={2}>
          {filteredBooks.map(book => (
            <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
              <Book book={book} handleDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
        {isAuthenticated && (
        <Box display="flex" justifyContent="center" mt={10}>
          <Button component={Link} to="/add" variant="contained" color="primary" style={{ marginTop: '15px' }}>Добавить новую книгу</Button>
        </Box>
        )}
      </Container>
    </>
  );
};

export default Books;
