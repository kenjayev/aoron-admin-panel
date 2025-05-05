import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmToDeleteModal from "../components/ConfirmToDeleteModal";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";

const Sizes = () => {
  const [size, setSize] = useState(null);
  const [editedSize, setEditedSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmDeleted, setIsConfirmDeleted] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedSize(null);
    setIsConfirmDeleted(false);
  };

  // getSize
  const getSize = () => {
    setIsLoading(true);
    fetch("https://back.ifly.com.uz/api/sizes")
      .then((data) => data.json())
      .then((data) => {
        data.success ? setSize(data.data) : toast.error("Something want Error");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Something want ERror");
        toast.error(err);
        setIsLoading(false);
      });
  };
  useEffect(getSize, []);

  // Add New Size
  const addSize = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("https://back.ifly.com.uz/api/sizes", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ size: e.target.size.value }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Size Added successfuly");
          closeModal();
          getSize();
        } else {
          toast.error("SomeThing Want Error");
          toast.error(res.message.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error("SomeThing Want Error");
        toast.error(err.message);
        toast.error(err);
        setIsLoading(false);
      });
  };

  // Edit Size
  const editSize = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`https://back.ifly.com.uz/api/sizes/${editedSize?.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ size: e.target.size.value }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Size Edited Successfuly");
          closeModal();
          getSize();
        } else {
          toast.error("SomeThing Want Error");
          toast.error(data.message.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error("SomeThing want Error");
        toast.error(err.message);
        toast.error(err);
        setIsLoading(false);
      });
  };

  // Delete Size Func
  const deleteSize = (id) => {
    setIsLoading(true);
    fetch(`https://back.ifly.com.uz/api/sizes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((req) => req.json())
      .then((req) => {
        if (req.success) {
          toast.success("Deleted Discount Successfuly");
          getSize();
        } else {
          req.message.includes(
            'update or delete on table "discount" violates foreign key constraint'
          )
            ? toast.error(
                "This Discount is linked to the product. You don't delete this discount"
              )
            : toast.success(req.message.message);
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
        <h2 className="text-2xl mb-6">Size</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="mb-5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
        >
          Add Size
        </button>
      </div>

      {isOpenModal && (
        <Modal closeFunc={closeModal}>
          <h3 className="text-xl font-bold mb-4">
            {editedSize ? "Edit" : "Add"} Size
          </h3>

          <form onSubmit={editedSize ? editSize : addSize}>
            <div className="mb-3">
              <label htmlFor="size" className="block mb-1 text-sm font-medium">
                Size Name:
              </label>
              <input
                required
                type="text"
                name="size"
                id="size"
                placeholder="Size name"
                defaultValue={editedSize?.size ?? ""}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              disabled={isLoading}
              className="w-full mt-4 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading
                ? "Loading..."
                : editedSize
                ? "Edit Category"
                : "Add Category"}
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Modal for Deleted Size */}
      {isConfirmDeleted && (
        <ConfirmToDeleteModal
          type="size"
          isLoading={isLoading}
          closeModal={closeModal}
          deleteFunc={() => deleteSize(editedSize?.id)}
        >
          {editedSize?.size}
        </ConfirmToDeleteModal>
      )}

      {/* print Size data to table */}
      {isLoading ? (
        <Loader />
      ) : !size ? (
        <NoData /> // Internet server error
      ) : size.length === 0 ? (
        <NoData />
      ) : (
        <div className="relative max-h-[55vh] lg:max-h-[60vh] h-full overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 translate-x-[0.7px] -translate-y-[0.4px] w-full">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">№</th>
                <th className="border border-gray-300 p-2">Size</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="max-h-[200px] h-full">
              {size.map?.(({ id, size }, i) => (
                <tr key={id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2">{size}</td>
                  <td className="border border-gray-300 p-2 w-[200px]">
                    <button
                      onClick={() => {
                        setIsOpenModal(true);
                        setEditedSize({ id, size });
                      }}
                      className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsConfirmDeleted(true);
                        setEditedSize({ id, size });
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

export default Sizes;
