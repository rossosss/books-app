import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Grid, TextField, Typography } from '@material-ui/core/node';

const Auth = ({ type }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const handleChange = useCallback ((e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  }, [formData]);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    setUser(userData);
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      if (type === 'login') {
        // Обработка логина
        const res = await axios.post('http://localhost:8800/login', formData);
        const userData = res.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        login(userData);
        console.log(res.data);
      } else if (type === 'register') {
        const res = await axios.post('http://localhost:8800/register', formData);
        console.log(res.data);
      }
      navigate("/")
    } catch (err) {
      console.error(err);
      setError(err.response.data.error || "Неверный логин и/или пароль");
    }
  }, [type, formData, navigate]);

  return (
    <>
    <Container>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ height: '100vh' }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <div>
            <Typography variant="h2" align="center" gutterBottom>
              {type === 'login' ? 'Вход' : 'Регистрация'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                type="text"
                placeholder="Логин"
                name="login"
                value={formData.login}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <TextField
                type="password"
                placeholder="Пароль"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                fullWidth
              />
              <Button type="submit" variant="contained" color="primary" fullWidth mt="20px">
                {type === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </Button>
              {error && <Typography mt="10px" color="error">{error}</Typography>}
            </form>
          </div>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default Auth;