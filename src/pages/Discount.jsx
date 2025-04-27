import React, { useState } from "react";
import Modal from "../components/Modal";
import NoData from "../components/NoData";

const Discount = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [discount, setDiscount] = useState([]);
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Discount</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition cursor-pointer"
        >
          Add Discount
        </button>
      </div>
      {isOpenModal && (
        <Modal closeFunc={setIsOpenModal}>
          <h3 className="text-2xl font-bold mb-4">Add Discount</h3>
          <form>
            <input
              type="number"
              step={1}
              min={0}
              max={100}
              placeholder="Discount (%)"
              name="discount"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="date"
              placeholder="Created Date"
              name="started_at"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="date"
              placeholder="Finished Date"
              name="finished_at"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                name="status"
                className="w-4 h-4 border-2 border-gray-300 rounded-lg checked:bg-green-500  focus:bg-green-500 transition-all duration-200"
              />
              <span className="text-md text-gray-700 font-medium">Active</span>
            </label>
            <button className="w-full text-center p-2 text-white bg-green-500 rounded-lg cursor-pointer">
              Add Discount
            </button>
          </form>
        </Modal>
      )}
      {discount && discount.length === 0 ? (
        <NoData />
      ) : (
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
            {discount.map(({ id, name_en, name_ru, name_de }, i) => (
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
      )}
    </section>
  );
};

export default Discount;
