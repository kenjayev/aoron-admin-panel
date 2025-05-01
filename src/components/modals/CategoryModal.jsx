import React from "react";

const CategoryModal = ({ closeModal, setData, editedCategory }) => {
  return (
    <Modal closeFunc={closeModal}>
      <h3 className="text-xl font-bold mb-4">
        {editedCategory ? "Edit Category" : "Add Category"}
      </h3>
      <form onSubmit={editedCategory ? editCategory : addCategory}>
        <div className="mb-3">
          <label htmlFor="name_en" className="block mb-1 text-sm font-medium">
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
          <label htmlFor="name_ru" className="block mb-1 text-sm font-medium">
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
          <label htmlFor="name_de" className="block mb-1 text-sm font-medium">
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
  );
};

export default CategoryModal;
