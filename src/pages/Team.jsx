import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmToDeleteModal from "../components/ConfirmToDeleteModal";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import NoData from "../components/NoData";
import { fetchWithAuth } from "../services/fetchWithAuth";

const Team = () => {
  const [team, setTeam] = useState(null);
  const [editedTeam, setEditedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConfirmDeleted, setIsConfirmDeleted] = useState(false);
  const accessToken = localStorage.getItem("access_token");

  const closeModal = () => {
    setIsOpenModal(false);
    setEditedTeam(null);
    setIsConfirmDeleted(false);
  };

  // getSize
  const getTeam = () => {
    setIsLoading(true);
    fetch("https://testaoron.limsa.uz/api/team-section")
      .then((data) => data.json())
      .then((data) => {
        data.success ? setTeam(data.data) : toast.error("Something want Error");
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Something want ERror");
        toast.error(err);
        setIsLoading(false);
      });
  };
  useEffect(getTeam, []);

  /**************** return data from FORM *****************/
  const getDataForm = (e) => {
    const formData = new FormData();
    formData.append("full_name", e.target.full_name.value);
    formData.append("position_en", e.target.position_en.value);
    formData.append("position_ru", e.target.position_ru.value);
    formData.append("position_de", e.target.position_de.value);
    formData.append("file", e.target.file.files[0]);
    return formData;
  };
  /**************** return data from FORM *****************/

  // Add New Color
  const addTeam = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetchWithAuth("https://testaoron.limsa.uz/api/team-section", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: getDataForm(e),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Team added successfuly");
          closeModal();
          getTeam();
        } else {
          toast.error("Something want Error");
          toast.error(data.message.message);
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
  const editTeam = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetchWithAuth(
      `https://testaoron.limsa.uz/api/team-section/${editedTeam?.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: getDataForm(e),
      }
    )
      .then((data) => data.json())
      .then((data) => {
        if (data.success) {
          toast.success("Team edited Successfuly");
          closeModal();
          getTeam();
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
  const deleteTeam = (id) => {
    setIsLoading(true);
    fetchWithAuth(`https://testaoron.limsa.uz/api/team-section/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((req) => req.json())
      .then((req) => {
        if (req.success) {
          toast.success("Deleted Team successfuly");
          getTeam();
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
        <h2 className="text-2xl font-bold mb-6">Team Members</h2>
        <button
          onClick={() => setIsOpenModal(true)}
          className="mb-5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
        >
          Add Team Member
        </button>
      </div>

      {isOpenModal && (
        <Modal closeFunc={closeModal}>
          <h3 className="text-xl font-bold mb-4">
            {editedTeam ? "Edit" : "Add"} FAQ
          </h3>

          <form onSubmit={editedTeam ? editTeam : addTeam}>
            <div className="mb-2">
              <label htmlFor="full_name" className="block text-gray-700">
                Full Name
              </label>
              <input
                required
                type="text"
                placeholder="Enter full name"
                defaultValue={editedTeam?.full_name ?? ""}
                name="full_name"
                id="full_name"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="position_en" className="block text-gray-700">
                Position (EN)
              </label>
              <input
                required
                type="text"
                placeholder="Enter position in English"
                name="position_en"
                id="position_en"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength={200}
                defaultValue={editedTeam?.position_en ?? ""}
              />
            </div>

            <div className="mb-2">
              <label htmlFor="position_ru" className="block text-gray-700">
                Position (RU)
              </label>
              <input
                required
                type="text"
                placeholder="Enter position in Russian"
                name="position_ru"
                id="position_ru"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength={200}
                defaultValue={editedTeam?.position_ru ?? ""}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="position_de" className="block text-gray-700">
                Position (DE)
              </label>
              <input
                required
                type="text"
                placeholder="Enter position in German"
                name="position_de"
                id="position_de"
                className="w-full p-2 border border-gray-300 rounded"
                maxLength={200}
                defaultValue={editedTeam?.position_de ?? ""}
              />
            </div>
            <div className="mb-2">
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

            <button
              disabled={isLoading}
              className="w-full mt-2 text-white bg-green-500 p-2 text-center rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
            >
              {isLoading ? "Loading..." : editedTeam ? "Edit Team" : "Add Team"}
            </button>
          </form>
        </Modal>
      )}

      {/* Confirm Modal for Deleted Size */}
      {isConfirmDeleted && (
        <ConfirmToDeleteModal
          type="team"
          isLoading={isLoading}
          closeModal={closeModal}
          deleteFunc={() => deleteTeam(editedTeam?.id)}
        >
          {editedTeam?.full_name} | {editedTeam?.position_en}
        </ConfirmToDeleteModal>
      )}

      {/* print Size data to table */}
      {isLoading ? (
        <Loader />
      ) : !team ? (
        <NoData /> // Internet server error
      ) : team.length === 0 ? (
        <NoData />
      ) : (
        <div className="relative max-h-[55vh] lg:max-h-[60vh] h-full overflow-y-auto">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 translate-x-[0.7px] -translate-y-[0.4px] w-full">
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">№</th>
                <th className="border border-gray-300 p-2">Images</th>
                <th className="border border-gray-300 p-2">Full Name</th>
                <th className="border border-gray-300 p-2">Position (EN)</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="max-h-[200px] h-full">
              {team.map?.((team, i) => (
                <tr key={team.id} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2 cursor-pointer w-[150px] h-[100px]">
                    <img
                      className="w-full h-full rounded-sm"
                      src={`https://testaoron.limsa.uz/${team.image}`}
                      alt={team.full_name}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    {team.full_name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {team.position_en}
                  </td>
                  <td className="border border-gray-300 p-2 w-[200px]">
                    <button
                      onClick={() => {
                        setIsOpenModal(true);
                        setEditedTeam({ ...team });
                      }}
                      className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setIsConfirmDeleted(true);
                        setEditedTeam({ ...team });
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

export default Team;
