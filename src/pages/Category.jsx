import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";

const Category = () => {
  const [category, setCategory] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedCategory(null);
  };
  const accessToken = localStorage.getItem("access_token");

  // Get category
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
    setIsLoading(true);
    const body = JSON.stringify({
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
      body,
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Add category successfuly");
          closeModal();
          setIsLoading(false);
          getCategory();
        } else {
          e.target.name_en.focus();
          toast.error(data.message);
        }
      })
      .finally(() => setIsLoading(false));
  };

  // Edit Category
  const editCategory = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const body = JSON.stringify({
      name_en: e.target.name_en.value,
      name_ru: e.target.name_ru.value,
      name_de: e.target.name_de.value,
    });
    fetch(`https://back.ifly.com.uz/api/category/${editedCategory.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Edited category successfuly");
          closeModal();
          setIsLoading(false);
          getCategory();
        } else {
          e.target.name_en.focus();
          toast.error(data.message);
        }
      })
      .finally(() => setIsLoading(false));
  };

  // Delete Category
  const deleteCategory = (id) => {
    fetch(`https://back.ifly.com.uz/api/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.data.message);
          getCategory();
        } else {
          console.log(data.message);
          data.message.includes(
            'update or delete on table "category" violates foreign key constraint'
          )
            ? toast.error("This category is linked to the product.")
            : toast.error(data.message);
        }
      })
      .catch((error) => toast.error(error.message));
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
        <Modal closeFunc={closeModal}>
          <h3 className="text-xl font-bold mb-4">
            {" "}
            {editedCategory ? "Edit Category" : "Add Category"}
          </h3>
          <form onSubmit={editedCategory ? editCategory : addCategory}>
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
                defaultValue={editedCategory?.name_en ?? ""}
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
                defaultValue={editedCategory?.name_ru ?? ""}
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
                defaultValue={editedCategory?.name_de ?? ""}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="German name"
                maxLength={80}
              />
            </div>
            <button
              disabled={isLoading}
              className="w-full mt-4 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading
                ? "Loading..."
                : editedCategory
                ? "Edit Category"
                : "Add Category"}
            </button>
          </form>
        </Modal>
      )}

      {isLoading ? (
        <Loader />
      ) : category.length === 0 ? (
        <NoData />
      ) : (
        <div className="relative max-h-[55vh] lg:max-h-[60vh] h-full overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 translate-x-[0.7px] -translate-y-[0.4px] w-full">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">№</th>
                <th className="border border-gray-300 p-2">Title ENG</th>
                <th className="border border-gray-300 p-2">Title RU</th>
                <th className="border border-gray-300 p-2">Title DE</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="max-h-[200px] h-full">
              {category.map?.(({ id, name_en, name_ru, name_de }, i) => (
                <tr key={id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2">{name_en}</td>
                  <td className="border border-gray-300 p-2">{name_ru}</td>
                  <td className="border border-gray-300 p-2">{name_de}</td>
                  <td className="border border-gray-300 p-2 w-[200px]">
                    <button
                      onClick={() => {
                        setIsOpenModal(true);
                        setEditedCategory({ id, name_en, name_ru, name_de });
                      }}
                      className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Category;
