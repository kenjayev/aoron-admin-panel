import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmToDeleteModal from "../components/ConfirmToDeleteModal";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";

const Contact = () => {
  const [contacts, setContacts] = useState(null);
  const [editedColor, setEditedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmDeleted, setIsConfirmDeleted] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedColor(null);
    setIsConfirmDeleted(false);
  };

  // getSize
  const getContact = () => {
    setIsLoading(true);
    fetch("https://back.ifly.com.uz/api/contact")
      .then((data) => data.json())
      .then((data) => {
        data.success
          ? setContacts(data.data)
          : toast.error("Something want Error");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Something want ERror");
        toast.error(err);
        setIsLoading(false);
      });
  };
  useEffect(getContact, []);

  // // Add New Color
  // const addColor = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   fetch("https://back.ifly.com.uz/api/colors", {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     body: JSON.stringify({
  //       color_en: e.target.color_en.value,
  //       color_ru: e.target.color_ru.value,
  //       color_de: e.target.color_de.value,
  //     }),
  //   })
  //     .then((data) => data.json())
  //     .then((data) => {
  //       if (data.success) {
  //         toast.success("Color Added successfuly");
  //         closeModal();
  //         getColors();
  //       } else {
  //         toast.error("Something want Error");
  //         toast.error(res.message.message);
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       toast.error("Something want Error");
  //       toast.error(err.message);
  //       toast.error(err);
  //       setIsLoading(false);
  //     });
  // };

  // // Edit Color
  // const editColor = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   fetch(`https://back.ifly.com.uz/api/colors/${editedColor?.id}`, {
  //     method: "PATCH",
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //     body: JSON.stringify({
  //       color_en: e.target.color_en.value,
  //       color_ru: e.target.color_ru.value,
  //       color_de: e.target.color_de.value,
  //     }),
  //   })
  //     .then((data) => data.json())
  //     .then((data) => {
  //       if (data.success) {
  //         toast.success("Color Edited Successfuly");
  //         closeModal();
  //         getColors();
  //       } else {
  //         toast.error("Something want Error");
  //         toast.error(data.message?.message);
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       toast.error("Something want Error");
  //       toast.error(err.message);
  //       toast.error(err);
  //       setIsLoading(false);
  //     });
  // };

  // // Delete Color Func
  // const deleteColor = (id) => {
  //   setIsLoading(true);
  //   fetch(`https://back.ifly.com.uz/api/colors/${id}`, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   })
  //     .then((req) => req.json())
  //     .then((req) => {
  //       if (req.success) {
  //         toast.success("Deleted Discount Successfuly");
  //         getColors();
  //       } else {
  //         req.message?.includes?.(
  //           'update or delete on table "discount" violates foreign key constraint'
  //         )
  //           ? toast.error(
  //               "This Discount is linked to the product. You don't delete this discount"
  //             )
  //           : toast.error(req.message.message);
  //       }
  //     })
  //     .catch((error) => toast.error(error.message))
  //     .finally(() => {
  //       setIsLoading(false);
  //       closeModal();
  //     });
  // };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6">Contact</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="mb-5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
        >
          Add Contact
        </button>
      </div>

      {isOpenModal && (
        <Modal closeFunc={closeModal}>
          <h3 className="text-xl font-bold mb-4">
            {editedColor ? "Edit" : "Add"} FAQ
          </h3>

          {/* <form onSubmit={editedColor ? editColor : addColor}>
            <div className="mb-3">
              <label
                htmlFor="color_en"
                className="block mb-1 text-sm font-medium"
              >
                Color (EN):
              </label>
              <input
                required
                type="text"
                name="color_en"
                id="color_en"
                placeholder="Color in English"
                defaultValue={editedColor?.color_en ?? ""}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="color_ru"
                className="block mb-1 text-sm font-medium"
              >
                Color (RU):
              </label>
              <input
                required
                type="text"
                name="color_ru"
                id="color_ru"
                placeholder="Цвет на русском"
                defaultValue={editedColor?.color_ru ?? ""}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="color_de"
                className="block mb-1 text-sm font-medium"
              >
                Color (DE):
              </label>
              <input
                required
                type="text"
                name="color_de"
                id="color_de"
                placeholder="Farbe auf Deutsch"
                defaultValue={editedColor?.color_de ?? ""}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              disabled={isLoading}
              className="w-full mt-4 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading
                ? "Loading..."
                : editedColor
                ? "Edit Category"
                : "Add Category"}
            </button>
          </form> */}
        </Modal>
      )}

      {/* Confirm Modal for Deleted Size */}
      {isConfirmDeleted && (
        <ConfirmToDeleteModal
          type="color"
          isLoading={isLoading}
          closeModal={closeModal}
          deleteFunc={() => deleteColor(editedColor?.id)}
        >
          {editedColor?.color_en} | {editedColor?.color_ru} |{" "}
          {editedColor?.color_de}
        </ConfirmToDeleteModal>
      )}

      {/* print Size data to table */}
      {isLoading ? (
        <Loader />
      ) : !contacts ? (
        <NoData /> // Internet server error
      ) : contacts.length === 0 ? (
        <NoData />
      ) : (
        <div className="relative max-h-[55vh] lg:max-h-[60vh] h-full overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 translate-x-[0.7px] -translate-y-[0.4px] w-full">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">№</th>
                <th className="border border-gray-300 p-2">Phone Number</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Address (EN)</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="max-h-[200px] h-full">
              {contacts.map?.((contact, i) => (
                <tr key={contact.id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {contact.phone_number}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {contact.email}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {contact.address_en}
                  </td>
                  <td className="border border-gray-300 p-2 w-[200px]">
                    <button
                      onClick={() => {
                        setIsOpenModal(true);
                        setEditedColor({ ...faq });
                      }}
                      className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsConfirmDeleted(true);
                        setEditedColor({ ...faq });
                      }}
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

export default Contact;
