import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmToDeleteModal from "../components/ConfirmToDeleteModal";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";

const Faq = () => {
  const [faq, setFaq] = useState(null);
  const [editedFaq, setEditedFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmDeleted, setIsConfirmDeleted] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedFaq(null);
    setIsConfirmDeleted(false);
  };

  // getSize
  const getFaq = () => {
    setIsLoading(true);
    fetch("https://back.ifly.com.uz/api/faq")
      .then((data) => data.json())
      .then((data) => {
        data.success ? setFaq(data.data) : toast.error("Something want Error");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Something want ERror");
        toast.error(err);
        setIsLoading(false);
      });
  };
  useEffect(getFaq, []);

  // Add New Color
  const addFaq = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("https://back.ifly.com.uz/api/faq", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        question_en: e.target.question_en.value,
        question_ru: e.target.question_ru.value,
        question_de: e.target.question_de.value,
        answer_en: e.target.answer_en.value,
        answer_ru: e.target.answer_ru.value,
        answer_de: e.target.answer_de.value,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("FAQ added successfuly");
          closeModal();
          getFaq();
        } else {
          toast.error("Something want Error");
          toast.error(res.message.message);
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
  const editFaq = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`https://back.ifly.com.uz/api/faq/${editedFaq?.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        question_en: e.target.question_en.value,
        question_ru: e.target.question_ru.value,
        question_de: e.target.question_de.value,
        answer_en: e.target.answer_en.value,
        answer_ru: e.target.answer_ru.value,
        answer_de: e.target.answer_de.value,
      }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("FAQ edited Successfuly");
          closeModal();
          getFaq();
        } else {
          toast.error("Something want Error");
          toast.error(data.message?.message);
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
  const deleteFaq = (id) => {
    setIsLoading(true);
    fetch(`https://back.ifly.com.uz/api/faq/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((req) => req.json())
      .then((req) => {
        if (req.success) {
          toast.success("Deleted FAQ successfuly");
          getFaq();
        } else {
          toast.error(req.message.message);
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
        <h2 className="text-2xl font-bold mb-6">FAQ Management</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="mb-5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
        >
          Add FAQ
        </button>
      </div>

      {isOpenModal && (
        <Modal closeFunc={closeModal}>
          <h3 className="text-xl font-bold mb-4">
            {editedFaq ? "Edit" : "Add"} FAQ
          </h3>

          <form onSubmit={editedFaq ? editFaq : addFaq}>
            <div className="mb-2">
              <label htmlFor="question_en" className="block text-gray-700">
                Question (English)
              </label>
              <input
                required
                type="text"
                placeholder="Enter question in English"
                defaultValue={editedFaq?.question_en ?? ""}
                name="question_en"
                id="question_en"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength={200}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="answer_en" className="block text-gray-700">
                Answer (English)
              </label>
              <textarea
                required
                placeholder="Enter answer in English"
                name="answer_en"
                id="answer_en"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength={500}
                defaultValue={editedFaq?.answer_en ?? ""}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="question_ru" className="block text-gray-700">
                Question (Russian)
              </label>
              <input
                required
                type="text"
                placeholder="Enter question in Russian"
                name="question_ru"
                id="question_ru"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength={200}
                defaultValue={editedFaq?.question_ru ?? ""}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="answer_ru" className="block text-gray-700">
                Answer (Russian)
              </label>
              <textarea
                required
                placeholder="Enter answer in Russian"
                name="answer_ru"
                id="answer_ru"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength={500}
                defaultValue={editedFaq?.answer_ru ?? ""}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="question_de" className="block text-gray-700">
                Question (German)
              </label>
              <input
                required
                type="text"
                placeholder="Enter question in German"
                name="question_de"
                id="question_de"
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue={editedFaq?.question_de ?? ""}
                maxLength={200}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="answer_de" className="block text-gray-700">
                Answer (German)
              </label>
              <textarea
                required
                placeholder="Enter answer in German"
                name="answer_de"
                id="answer_de"
                className="w-full p-2 border border-gray-300 rounded"
                defaultValue={editedFaq?.answer_de ?? ""}
                maxLength={500}
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full mt-2 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading ? "Loading..." : editedFaq ? "Edit FAQ" : "Add FAQ"}
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Modal for Deleted Size */}
      {isConfirmDeleted && (
        <ConfirmToDeleteModal
          type="FAQ"
          isLoading={isLoading}
          closeModal={closeModal}
          deleteFunc={() => deleteFaq(editedFaq?.id)}
        >
          {editedFaq?.question_en}
        </ConfirmToDeleteModal>
      )}

      {/* print Size data to table */}
      {isLoading ? (
        <Loader />
      ) : !faq ? (
        <NoData /> // Internet server error
      ) : faq.length === 0 ? (
        <NoData />
      ) : (
        <div className="relative max-h-[55vh] lg:max-h-[60vh] h-full overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 translate-x-[0.7px] -translate-y-[0.4px] w-full">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">№</th>
                <th className="border border-gray-300 p-2">Question (EN)</th>
                <th className="border border-gray-300 p-2">Answer (EN)</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="max-h-[200px] h-full">
              {faq.map?.((faq, i) => (
                <tr key={faq.id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {faq.question_en}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {faq.answer_en}
                  </td>
                  <td className="border border-gray-300 p-2 w-[200px]">
                    <button
                      onClick={() => {
                        setIsOpenModal(true);
                        setEditedFaq({ ...faq });
                      }}
                      className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsConfirmDeleted(true);
                        setEditedFaq({ ...faq });
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

export default Faq;
