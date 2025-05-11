import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmToDeleteModal from "../components/ConfirmToDeleteModal";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";
import { fetchWithAuth } from "../services/fetchWithAuth";

const News = () => {
  const [news, setNews] = useState(null);
  const [editedNews, setEditedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmDeleted, setIsConfirmDeleted] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedNews(null);
    setIsConfirmDeleted(false);
  };

  // getSize
  const getNews = () => {
    setIsLoading(true);
    fetch("https://testaoron.limsa.uz/api/news")
      .then((data) => data.json())
      .then((data) => {
        data.success ? setNews(data.data) : toast.error("Something want error");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Something want error");
        toast.error(err);
        setIsLoading(false);
      });
  };
  useEffect(getNews, []);

  const getDataForm = (e) => {
    const dataForm = new FormData();
    dataForm.append("title_en", e.target.title_en.value);
    dataForm.append("title_ru", e.target.title_ru.value);
    dataForm.append("title_de", e.target.title_de.value);
    dataForm.append("description_en", e.target.description_en.value);
    dataForm.append("description_ru", e.target.description_ru.value);
    dataForm.append("description_de", e.target.description_de.value);
    dataForm.append("file", e.target.file.files[0]);
    return dataForm;
  };

  // Add New Color
  const addNews = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetchWithAuth("https://testaoron.limsa.uz/api/news", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: getDataForm(e),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("News added successfuly");
          closeModal();
          getNews();
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
  const editNews = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetchWithAuth(`https://testaoron.limsa.uz/api/news/${editedNews?.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: getDataForm(e),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("News edited Successfuly");
          closeModal();
          getNews();
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
  const deleteNews = (id) => {
    setIsLoading(true);
    fetchWithAuth(`https://testaoron.limsa.uz/api/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((req) => req.json())
      .then((req) => {
        if (req.success) {
          toast.success("Deleted news successfuly");
          getNews();
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
        <h2 className="text-2xl font-bold mb-6">News</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="mb-5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
        >
          Add News
        </button>
      </div>

      {isOpenModal && (
        <Modal closeFunc={closeModal}>
          <h3 className="text-xl font-bold mb-4">
            {editedNews ? "Edit" : "Add"} News
          </h3>

          <form onSubmit={editedNews ? editNews : addNews}>
            <div className="w-full max-h-[70vh] overflow-x-hidden overflow-y-auto custom-scrollbar">
              {/******************** Start TITLES & DESCRIPTION IN English  *****************/}
              <div className="mb-2">
                <label htmlFor="title_en" className="block text-gray-700">
                  Title (EN)
                </label>
                <input
                  required
                  type="text"
                  name="title_en"
                  id="title_en"
                  placeholder="Enter News title in English"
                  defaultValue={editedNews?.title_en ?? ""}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description_en" className="block text-gray-700">
                  Description (EN)
                </label>
                <textarea
                  required
                  placeholder="Enter news description in English"
                  name="description_en"
                  id="description_en"
                  className="w-full p-2 border border-gray-300 rounded"
                  maxLength={500}
                  defaultValue={editedNews?.description_en ?? ""}
                />
              </div>
              {/******************** End TITLES & DESCRIPTION IN English  *****************/}

              {/******************** Start TITLES & DESCRIPTION IN Russian  *****************/}
              <div className="mb-3">
                <label htmlFor="title_ru" className="block text-gray-700">
                  Title (RU)
                </label>
                <input
                  required
                  type="text"
                  name="title_ru"
                  id="title_ru"
                  placeholder="Enter News title in Russian"
                  defaultValue={editedNews?.title_ru ?? ""}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description_ru" className="block text-gray-700">
                  Description (RU)
                </label>
                <textarea
                  required
                  placeholder="Enter news description in Russian"
                  name="description_ru"
                  id="description_ru"
                  className="w-full p-2 border border-gray-300 rounded"
                  maxLength={500}
                  defaultValue={editedNews?.description_ru ?? ""}
                />
              </div>
              {/******************** End TITLES & DESCRIPTION IN Russian  *****************/}

              {/******************** Start TITLES & DESCRIPTION IN German  *****************/}
              <div className="mb-2">
                <label htmlFor="title_de" className="block text-gray-700">
                  Title (DE)
                </label>
                <input
                  required
                  type="text"
                  name="title_de"
                  id="title_de"
                  placeholder="Enter News title in German"
                  defaultValue={editedNews?.title_de ?? ""}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description_de" className="block text-gray-700">
                  Description (EN)
                </label>
                <textarea
                  required
                  placeholder="Enter news description in German"
                  name="description_de"
                  id="description_de"
                  className="w-full p-2 border border-gray-300 rounded"
                  maxLength={500}
                  defaultValue={editedNews?.description_de ?? ""}
                />
              </div>
              {/******************** End TITLES & DESCRIPTION IN German  *****************/}

              {/******************** Start Upload File Input  *****************/}
              <div className="mb-3">
                <label htmlFor="file" className="block text-gray-700">
                  Upload Image
                </label>
                <input
                  required
                  accept="image/*"
                  type="file"
                  name="file"
                  id="file"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {/******************** End Upload File Input  *****************/}
            </div>

            <button
              disabled={isLoading}
              className="w-full mt-2 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading ? "Loading..." : editedNews ? "Edit News" : "Add News"}
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Modal for Deleted Size */}
      {isConfirmDeleted && (
        <ConfirmToDeleteModal
          type="news"
          isLoading={isLoading}
          closeModal={closeModal}
          deleteFunc={() => deleteNews(editedNews?.id)}
        >
          {editedNews?.title_en} | {editedNews?.description_en}
        </ConfirmToDeleteModal>
      )}

      {/* print Size data to table */}
      {isLoading ? (
        <Loader />
      ) : !news ? (
        <NoData /> // Internet server error
      ) : news.length === 0 ? (
        <NoData />
      ) : (
        <div className="relative max-h-[55vh] lg:max-h-[60vh] h-full overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 translate-x-[0.7px] -translate-y-[0.4px] w-full">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">№</th>
                <th className="border border-gray-300 p-2">Images</th>
                <th className="border border-gray-300 p-2">Title (EN)</th>
                <th className="border border-gray-300 p-2">Description (EN)</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="max-h-[200px] h-full">
              {news.map?.((news, i) => (
                <tr key={news.id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2 cursor-pointer w-30 h-22">
                    <img
                      className="w-24 h-18 object-cover mx-auto rounded-sm"
                      src={`https://testaoron.limsa.uz/${news.image}`}
                      alt={news.title_en}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    {news.title_en}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {news.description_en}
                  </td>
                  <td className="border border-gray-300 p-2 w-[200px]">
                    <button
                      onClick={() => {
                        setIsOpenModal(true);
                        setEditedNews({ ...news });
                      }}
                      className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsConfirmDeleted(true);
                        setEditedNews({ ...news });
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

export default News;
