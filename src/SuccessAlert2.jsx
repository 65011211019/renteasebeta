import React from "react";

const SuccessAlert2 = ({ message }) => {
  return (
    <div className="py-10 bg-gradient-to-r from-green-100 via-green-50 to-green-100 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="flex w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg border-l-4 border-green-500 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-center w-16 bg-green-500">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0.5C5.649 0.5 0.5 5.649 0.5 12C0.5 18.351 5.649 23.5 12 23.5C18.351 23.5 23.5 18.351 23.5 12C23.5 5.649 18.351 0.5 12 0.5ZM12 21.75C6.487 21.75 2.25 17.513 2.25 12C2.25 6.487 6.487 2.25 12 2.25C17.513 2.25 21.75 6.487 21.75 12C21.75 17.513 17.513 21.75 12 21.75Z"
                fill="white"
              />
              <path
                d="M16.278 8.28C15.958 7.96 15.428 7.96 15.108 8.28L10.5 12.888L8.892 11.28C8.572 10.96 8.042 10.96 7.722 11.28C7.402 11.6 7.402 12.13 7.722 12.45L10.028 14.756C10.188 14.916 10.392 15 10.596 15C10.8 15 11.004 14.916 11.164 14.756L16.278 9.642C16.598 9.322 16.598 8.792 16.278 8.28Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="flex-1 p-5">
            <h5 className="mb-2 text-xl font-bold text-green-700 dark:text-green-300">
              Success!
            </h5>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {message || "You have successfully completed the action!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert2;
