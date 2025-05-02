import React from "react";

const Modal = ({ children, closeFunc }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 overflow-y-auto">
      <div
        onClick={closeFunc}
        className="absolute inset-0 -z-1 bg-black/60 cursor-pointer"
      ></div>
      <div
        className={`relative bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-x-hidden overflow-y-auto custom-scrollbar`}
      >
        {children}
        <button
          onClick={closeFunc}
          className="absolute block w-8 h-8 top-2 right-2 flex justify-center items-center text-white bg-red-500 cursor-pointer rounded-full"
        >
          <span className="self-baseline text-xl font-semibold">x</span>
        </button>
      </div>
    </div>
  );
};

export default Modal;
