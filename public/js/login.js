import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  showAlert('warning', 'Logging in');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err.response.data);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/users/logout'
    });

    if (res.data.status === 'success') {
      location.reload(true);
    }
  } catch (err) {
    console.log(err.resposne)
    showAlert('error', 'Error logging out! Please try again');
  }
};
