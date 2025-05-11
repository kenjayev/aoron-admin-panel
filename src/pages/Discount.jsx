import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ConfirmToDeleteModal from "../components/ConfirmToDeleteModal";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";
import { fetchWithAuth } from "../services/fetchWithAuth";

const Discount = () => {
  const [discount, setDiscount] = useState([]);
  const [editedDiscount, setEditedDiscount] = useState(null);
  const [isConfirmDeleted, setIsConfirmDeleted] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  // close Modal
  const closeModal = () => {
    setIsOpenModal(false);
    setIsConfirmDeleted(false);
    setEditedDiscount(null);
  };
  // get discount
  const getDiscount = () => {
    setIsLoading(true);
    fetch("https://testaoron.limsa.uz/api/discount")
      .then((req) => req.json())
      .then((data) => {
        data.success
          ? setDiscount(data.data)
          : toast.error("Something want Error");
      })
      .catch((data) => toast.error(data))
      .finally(() => setIsLoading(false));
  };
  useEffect(getDiscount, []);

  // Add Discount
  const addDiscount = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const body = JSON.stringify({
      discount: +e.target.discount.value,
      started_at: e.target.started_at.value,
      finished_at: e.target.finished_at.value,
      status: e.target.status.checked,
    });
    fetchWithAuth("https://testaoron.limsa.uz/api/discount", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    })
      .then((req) => req.json())
      .then((res) => {
        if (res.success) {
          toast.success("Discount add successfuly");
          setIsOpenModal(false);
          getDiscount();
        } else {
          toast.error(res.message.message);
          toast.error(res.message.message[0]);
        }
      })
      .finally(() => setIsLoading(false));
  };

  // Edit Discount
  const editDiscount = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const discount = +e.target.discount.value;
    if (0 > discount || discount > 100) {
      return toast.error("Discount percentage must be between 0 and 100");
    }
    const body = JSON.stringify({
      discount,
      started_at: e.target.started_at.value,
      finished_at: e.target.finished_at.value,
      status: e.target.status.checked,
    });
    fetchWithAuth(
      `https://testaoron.limsa.uz/api/discount/${editedDiscount.id}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      }
    )
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Discount Edited Successfuly");
          setIsLoading(false);
          closeModal();
          getDiscount();
        } else {
          console.log(data);
          toast.error(data.message);
          toast.error(data.message?.message);
          toast.error("Something want Error");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        toast.error(err);
        toast.error("Something want Error");
        setIsLoading(false);
      });
  };

  // Delete Discount
  const deleteDiscount = (id) => {
    setIsLoading(true);
    fetchWithAuth(`https://testaoron.limsa.uz/api/discount/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((req) => req.json())
      .then((req) => {
        if (req.success) {
          toast.success("Deleted Discount Successfuly");
          getDiscount();
        } else {
          req.message.includes(
            'update or delete on table "discount" violates foreign key constraint'
          )
            ? toast.error(
                "This Discount is linked to the product. You don't delete this discount"
              )
            : toast.error(req.message.message);
        }
      })
      .catch((error) => toast.error(error.message))
      .finally(() => {
        setIsLoading(false);
        closeModal();
      });
  };
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-6">Discount</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 mb-5 rounded-lg transition cursor-pointer"
        >
          Add Discount
        </button>
      </div>
      {isOpenModal && (
        <Modal closeFunc={closeModal}>
          <h3 className="text-2xl font-bold mb-4">
            {editedDiscount ? "Edit" : "Add"} Discount
          </h3>
          <form onSubmit={editedDiscount ? editDiscount : addDiscount}>
            <input
              required
              type="number"
              step={1}
              min={0}
              max={100}
              placeholder="Discount (%)"
              defaultValue={editedDiscount?.discount ?? ""}
              name="discount"
              id="discount"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              required
              type="date"
              placeholder="Created Date"
              defaultValue={editedDiscount?.started_at ?? ""}
              name="started_at"
              id="started_at"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="date"
              placeholder="Finished Date"
              defaultValue={editedDiscount?.finished_at ?? ""}
              name="finished_at"
              id="finished_at"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                name="status"
                id="status"
                defaultChecked={editedDiscount?.status}
                className="w-4 h-4 border-2 border-gray-300 rounded-lg checked:bg-green-500  focus:bg-green-500 transition-all duration-200"
              />
              <span className="text-md text-gray-700 font-medium">Active</span>
            </label>
            <button
              disabled={isLoading}
              className="w-full text-center p-2 text-white bg-green-500 rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading
                ? "Loading..."
                : `${editedDiscount ? "Edit" : "Add"} Discount`}
            </button>
          </form>
        </Modal>
      )}
      {isConfirmDeleted && (
        <ConfirmToDeleteModal
          type="discount"
          isLoading={isLoading}
          closeModal={closeModal}
          deleteFunc={() => deleteDiscount(editedDiscount?.id)}
        >
          {editedDiscount.discount}% | {editedDiscount.started_at} |{" "}
          {editedDiscount.finished_at}
        </ConfirmToDeleteModal>
      )}
      {isLoading ? (
        <Loader />
      ) : discount && discount.length === 0 ? (
        <NoData />
      ) : (
        <div className="relative max-h-[55vh] lg:max-h-[60vh] h-full overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">№</th>
                <th className="border border-gray-300 p-2">Discount (%)</th>
                <th className="border border-gray-300 p-2">Created Date</th>
                <th className="border border-gray-300 p-2">Finished Date</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discount.map(
                ({ id, discount, started_at, finished_at, status }, i) => (
                  <tr key={id} className="text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{i + 1}</td>
                    <td className="border border-gray-300 p-2">{discount}%</td>
                    <td className="border border-gray-300 p-2">{started_at}</td>
                    <td className="border border-gray-300 p-2">
                      {finished_at}
                    </td>
                    <td
                      className={`border border-gray-300 p-2 ${
                        status ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {status ? "Active" : "Inactive"}
                    </td>
                    <td className="border border-gray-300 p-2 w-[200px]">
                      <button
                        onClick={() => {
                          setIsOpenModal(true);
                          setEditedDiscount({
                            id,
                            discount,
                            started_at,
                            finished_at,
                            status,
                          });
                        }}
                        className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setIsConfirmDeleted(true);
                          setEditedDiscount({
                            id,
                            discount,
                            started_at,
                            finished_at,
                          });
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Discount;
