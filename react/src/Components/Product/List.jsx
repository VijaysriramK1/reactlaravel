/* eslint-disable react-hooks/exhaustive-deps */
import axios from '../../Services/Api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Template/Header';
import Footer from '../Template/Footer';
import ReactPaginate from "react-paginate";
import './List.css';

function List() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getProducts = async (page = currentPage) => {
    const response = await axios.get(`get-product-list?page=${page}`);
    setProducts(response.data.data);
    setTotalPages(response.data.total_pages);
  };
  
  const changePage = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    getProducts(selectedPage);
  }

  const goToProductCreate = async () => {
    navigate('/create');
  };

  const deleteProduct = async (id) => {
      await axios.delete(`product-delete/${id}`);
      getProducts(currentPage);
  };

  useEffect(() => {
    getProducts(currentPage);
  }, [currentPage]);

  return (
  <div>
    <Header />
    <div class="container mt-5" style={{ marginBottom: '100px' }}>
       <div class="d-flex justify-content-end">
         <button class="btn btn-primary" onClick={goToProductCreate}>Create</button>
       </div>
    <table class="table mt-3">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Image</th>
        <th scope="col">Status</th>
        <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody>
    {
      products.map((product, index) => (
          <tr key={product.id}>
          <th scope="row">{index + 1 + (currentPage - 1) * 10}</th>
            <td>{product.name}</td>
            <td><img src={product.image} alt="Product" style={{ maxWidth: '100px', height: 'auto' }} /></td>
            <td>{product.status ? ( <span class="badge bg-success">Active</span> ) : ( <span class="badge bg-danger">Deactive</span>)}</td>
            <td>
            <div class="d-grid gap-2 d-md-block">
            <button class="btn btn-primary" onClick={() => navigate(`/edit/${product.id}`)}>Edit</button>
            <button class="btn btn-danger ms-md-2" onClick={() => deleteProduct(product.id)}>Delete</button>
            </div>
            </td>
          </tr>
      ))
    }
    </tbody>
  </table>
  <ReactPaginate
         previousLabel={"Previous"}
         nextLabel={"Next"}
         breakLabel={"..."}
         pageCount={totalPages}
         marginPagesDisplayed={1}
         pageRangeDisplayed={3}
         onPageChange={changePage}
         containerClassName={"pagination"}
         activeClassName={"active"} 
         disabledClassName={"disabled"} 
         breakClassName={"break"} 
  />

  </div>
  <Footer />
  </div>
  );
}

export default List;
