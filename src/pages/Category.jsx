import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";

const Category = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const accessToken = localStorage.getItem("access_token");

  const getCategory = () => {
    setIsLoading(true);
    fetch("https://back.ifly.com.uz/api/category")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategory(data.data);
        } else {
          toast.error("something want error");
        }
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setIsLoading(false));
  };

  // Add new Category
  const addCategory = (e) => {
    e.preventDefault();
    const data = JSON.stringify({
      name_en: e.target.name_en.value,
      name_ru: e.target.name_ru.value,
      name_de: e.target.name_de.value,
    });
    fetch("https://back.ifly.com.uz/api/category", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    })
      .then((data) => data.json())
      .then((data) => console.log(data));
  };

  useEffect(getCategory, []);

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-6">Category</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="cursor-pointer mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Add Category
        </button>
      </div>
      {isOpenModal && (
        <Modal closeFunc={setIsOpenModal}>
          <h3 className="text-xl font-bold mb-4">Add Category</h3>
          <form onSubmit={addCategory}>
            <div className="mb-3">
              <label
                htmlFor="name_en"
                className="block mb-1 text-sm font-medium"
              >
                Category Name (EN)
              </label>
              <input
                required
                name="name_en"
                id="name_en"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="English name"
                maxLength={80}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="name_ru"
                className="block mb-1 text-sm font-medium"
              >
                Category Name (RU)
              </label>
              <input
                required
                name="name_ru"
                id="name_ru"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Russian name"
                maxLength={80}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="name_de"
                className="block mb-1 text-sm font-medium"
              >
                Category Name (DE)
              </label>
              <input
                required
                name="name_de"
                id="name_de"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="German name"
                maxLength={80}
              />
            </div>
            <button className="w-full mt-4 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer">
              Add Category
            </button>
          </form>
        </Modal>
      )}

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">№</th>
            <th className="border border-gray-300 p-2">Title ENG</th>
            <th className="border border-gray-300 p-2">Title RU</th>
            <th className="border border-gray-300 p-2">Title DE</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {category &&
            category.map(({ id, name_en, name_ru, name_de }, i) => (
              <tr key={id} className="text-center hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{i + 1}</td>
                <td className="border border-gray-300 p-2">{name_en}</td>
                <td className="border border-gray-300 p-2">{name_ru}</td>
                <td className="border border-gray-300 p-2">{name_de}</td>
                <td className="border border-gray-300 p-2 w-[200px]">
                  <button className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default Category;
