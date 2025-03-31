import axios from '../../Services/Api';
import React, { useState } from 'react';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); 

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('login', {
        email: email,
        password: password,
      });
      localStorage.setItem('user_auth_token', response.data.token);
      window.location.href = '/list';
    } catch (error) {
      if (error.response.status === 422) {
        document.getElementById('global-errors').innerHTML = '';
        setErrors(error.response.data.errors);
      } else if (error.response.status === 403 || error.response.status === 404) {
        setErrors({});
        document.getElementById('global-errors').innerHTML = `<div class="alert alert-danger mt-2 mb-2">${error.response.data.message}</div>`;
      } else { /* empty */ }
    }
  };
  
  return (
    <div class="container mt-5" style={{ marginBottom: '100px' }}>
    <div class="mx-auto" style={{ width: '30%' }}>
      <div class="card">
        <div class="card-body">
          <form>
          <div id="global-errors"></div>
          <div>
              <label class="form-label">Email</label>
              <input
                type="text"
                class="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
               {errors.email && errors.email.map((error, index) => ( <div key={index} class="text-danger mt-2">{error}</div> ))}
            </div>

            <div class="mt-3">
              <label class="form-label">Password</label>
              <input
                type="text"
                class="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
               {errors.password && errors.password.map((error, index) => ( <div key={index} class="text-danger mt-2">{error}</div> ))}
            </div>

          
            <div class="d-grid gap-2 mt-3">
              <button class="btn btn-primary" onClick={login}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Login;
