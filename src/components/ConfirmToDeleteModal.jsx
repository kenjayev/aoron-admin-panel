import Modal from "../components/Modal";

const ConfirmToDeleteModal = ({
  closeModal,
  deleteFunc,
  type,
  isLoading,
  children,
}) => {
  return (
    <Modal closeFunc={closeModal}>
      <h3 className="text-2xl font-bold mb-3">
        <span className="capitalize">Delete {type}</span>{" "}
        <span className="bg-gray-300 text-base p-1 rounded-lg">{children}</span>
      </h3>
      <p className="">Are you sure you want to delete this {type}?</p>
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={closeModal}
          className="px-4 py-2 cursor-pointer bg-gray-500 text-white rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={deleteFunc}
          disabled={isLoading}
          className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg cursor-pointer disabled:cursor-progress disabled:bg-gray-400"
        >
          {isLoading ? "Loading..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmToDeleteModal;
