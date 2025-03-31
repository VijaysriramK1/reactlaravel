import axios from '../../Services/Api';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {

  const navigate = useNavigate(); 

  const logout = async (e) => {
    e.preventDefault();
    await axios.post('logout');
    localStorage.removeItem('user_auth_token');
    navigate('/');
  };


  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <a class="navbar-brand" href="javascript:void(0);">Logo</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <button class="nav-link active" aria-current="page" onClick={() => navigate('/list')}>Product</button>
        </li>

        <li class="nav-item">
          <button class="nav-link active" aria-current="page" onClick={logout}>Logout</button>
        </li>
      </ul>
      
    </div>
  </div>
</nav>
  );
}

export default Header;
