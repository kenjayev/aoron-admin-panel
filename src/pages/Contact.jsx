import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import ConfirmToDeleteModal from "../components/ConfirmToDeleteModal";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";

const Contact = () => {
  const [contacts, setContacts] = useState(null);
  const [editedContact, setEditedContact] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmDeleted, setIsConfirmDeleted] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedContact(null);
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

  // Add New Color
  const addContact = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("https://back.ifly.com.uz/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        phone_number: `+${phoneNumber}`,
        email: e.target.email.value,
        address_ru: e.target.address_ru.value,
        address_en: e.target.address_en.value,
        address_de: e.target.address_de.value,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Contact added successfuly");
          closeModal();
          getContact();
        } else {
          toast.error("Something want Error");
          toast.error(data.message?.message);
          toast.error(data.message.message[0]);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error("Something want Error");
        toast.error(err.message);
        toast.error(err);
        setIsLoading(false);
      });
  };

  // Edit Color
  const editContact = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`https://back.ifly.com.uz/api/contact/${editedContact?.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        phone_number: `+${phoneNumber}`,
        email: e.target.email.value,
        address_ru: e.target.address_ru.value,
        address_en: e.target.address_en.value,
        address_de: e.target.address_de.value,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Contact Edited Successfuly");
          closeModal();
          getContact();
        } else {
          toast.error("Something want Error");
          toast.error(data.message?.message);
          toast.error(data.message?.message[0]);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error("Something want Error");
        toast.error(err.message);
        toast.error(err);
        setIsLoading(false);
      });
  };

  // Delete Color Func
  const deleteContact = (id) => {
    setIsLoading(true);
    fetch(`https://back.ifly.com.uz/api/contact/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((req) => req.json())
      .then((req) => {
        if (req.success) {
          toast.success("Deleted contact Successfuly");
          getContact();
        } else {
          toast.error(req.message.message);
          toast.error(req.message.message[0]);
        }
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        setIsLoading(false);
        closeModal();
      });
  };

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
            {editedContact ? "Edit" : "Add"} Contact
          </h3>

          <form onSubmit={editedContact ? editContact : addContact}>
            {/* ---------------- Start Phone_Number ------ ----------*/}
            <div className="mb-3">
              <label
                htmlFor="phone_number"
                className="block mb-1 text-sm font-medium"
              >
                Phone Number:
              </label>
              <PhoneInput
                country={"uz"}
                value={editedContact?.phone_number ?? ""}
                onChange={(value) => setPhoneNumber((prev) => value)}
                inputStyle={{ width: "100%" }}
                type="number"
                placeholder="Enter phone number"
                inputProps={{
                  name: "phone_number",
                  id: "phone_number",
                  required: true,
                }}
              />
            </div>
            {/* ---------------- End Phone_Number ------ ----------*/}

            {/* ---------------- Start Email ------ ----------*/}
            <div className="mb-3">
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email:
              </label>
              <input
                required
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                defaultValue={editedContact?.email ?? ""}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {/* ---------------- End Email ------ ----------*/}

            <div className="mb-3">
              <label
                htmlFor="address_en"
                className="block mb-1 text-sm font-medium"
              >
                Address (EN):
              </label>
              <textarea
                required
                name="address_en"
                id="address_en"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Address (EN)"
                maxLength={200}
                defaultValue={editedContact?.address_en ?? ""}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="address_ru"
                className="block mb-1 text-sm font-medium"
              >
                Address (RU):
              </label>
              <textarea
                required
                name="address_ru"
                id="address_ru"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Address (RU)"
                maxLength={200}
                defaultValue={editedContact?.address_ru ?? ""}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="address_de"
                className="block mb-1 text-sm font-medium"
              >
                Address (DE):
              </label>
              <textarea
                required
                name="address_de"
                id="address_de"
                className="w-full p-2 border border-gray-300 rounded "
                placeholder="Address (DE)"
                maxLength={200}
                defaultValue={editedContact?.address_de ?? ""}
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full mt-4 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading
                ? "Loading..."
                : editedContact
                ? "Edit Contact"
                : "Add Contact"}
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Modal for Deleted Size */}
      {isConfirmDeleted && (
        <ConfirmToDeleteModal
          type="contact"
          isLoading={isLoading}
          closeModal={closeModal}
          deleteFunc={() => deleteContact(editedContact?.id)}
        >
          {editedContact?.phone_number} | {editedContact?.email}
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
                        setEditedContact({ ...contact });
                      }}
                      className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsConfirmDeleted(true);
                        setEditedContact({ ...contact });
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
