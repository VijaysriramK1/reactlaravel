/* eslint-disable react-hooks/exhaustive-deps */
import axios from '../../Services/Api';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Template/Header';
import Footer from '../Template/Footer';
import Select from 'react-select';

function Edit() {
  const [productName, setProductName] = useState('');
  const [years, setYears] = useState([]);
  const [status, setStatus] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});

  const yearsOptions = [
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
  ];

  const uploadImage = (event) => {
    const file = event.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearImagePreview = () => {
    setImage('');
    setImagePreview('');
    document.getElementById('product-image').value = '';
  };

  const getProduct = async () => {
    const response = await axios.get(`get-product/${id}`);
    setProductName(response.data.name);
    setStatus(response.data.status);
    setImagePreview(response.data.image);
    setYears(response.data.years.map((year) => ({
      value: year,
      label: year,
    })));
  };

  const updateProduct = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', productName);
      formData.append('status', status);
      formData.append('image', image);

      years.forEach((year, index) => {
        formData.append(`years[${index}]`, year.value);
      });

      await axios.post('product-update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/list');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

return (
  <div>
   <Header />
  <div class="container mt-5" style={{ marginBottom: '100px' }}>
  <div class="mx-auto" style={{width: '30%'}}>
  <div class="card">
    <div class="card-body">
    <form>
      <div>
      <label class="form-label">Product Name</label>
       <input type="text" class="form-control" value={productName} onChange={event => setProductName(event.target.value)} />
       {errors.name && errors.name.map((error, index) => ( <div key={index} class="text-danger mt-2">{error}</div> ))}
      </div>

      <div class="mt-3">
       <label class="form-label">Years</label>
       <Select options={yearsOptions} isMulti className="basic-multi-select" classNamePrefix="select" value={years} onChange={(selectedOptions) => {setYears(selectedOptions)}} />
       {errors.years && errors.years.map((error, index) => ( <div key={index} class="text-danger mt-2">{error}</div> ))}
      </div>
      
      <div class="mt-3">
        <label class="form-label">Product Image</label>
        <input id="product-image" class="form-control" type="file" accept="image/*" onChange={uploadImage} />
        {errors.image && errors.image.map((error, index) => ( <div key={index} class="text-danger mt-2">{error}</div> ))}
      </div>

      {imagePreview && (
          <div class="mt-3 position-relative">
              <button type="button" class="btn-close position-absolute top-0 end-0" aria-label="Close" onClick={clearImagePreview}></button>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
          </div>
      )}
      
      <div class="mt-3">
      <input class="form-check-input" type="checkbox" checked={status} onChange={event => setStatus(event.target.checked)} />
      <label class="form-check-label ms-2">{status ? 'Active' : 'Deactive'}</label>
      </div>
      <div class="d-grid gap-2 mt-3">
       <button class="btn btn-primary" onClick={updateProduct}>Submit</button>
      </div>
    </form>
    </div>
    </div>
   </div>
  </div>
  <Footer />
  </div>
  );
}

export default Edit;
