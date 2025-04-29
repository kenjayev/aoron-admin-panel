import React, { useState } from "react";

const Products = () => {
  // const [products, setProducts] = useState([]);

  // const getProducts = () => {
  //   fetch("")
  // }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Products</h2>
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition cursor-pointer">
          Add Product
        </button>
      </div>
    </section>
  );
};

export default Products;
