// Book.jsx
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core/node';
import { Link } from 'react-router-dom';
import React from 'react';

const Book = ({ book, handleDelete }) => {
  return (
    <Card sx={{ maxWidth: 200, mt: "30px" }} key={book.id}>
      <CardMedia 
        component="img"
        height="300"
        image={`../uploads/${book.cover}`}
        alt="Обложка книги"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {book.desc}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Цена: {book.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => handleDelete(book.id)}>Удалить</Button>
        <Button component={Link} to={`/update/${book.id}`} color="primary">Изменить</Button>
      </CardActions>
    </Card>
  );
};

export default Book;
