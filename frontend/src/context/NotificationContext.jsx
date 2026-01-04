import React, { createContext, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const showSuccess = (message) => toast.success(message);
  const showError = (message) => toast.error(message);
  const showLoading = (message) => toast.loading(message);
  const dismiss = (toastId) => toast.dismiss(toastId);

  const showConfirmation = (message, onConfirm, onCancel) => {
    toast((t) => (
      <div className="notification-confirm-wrapper">
        <p className="notification-confirm-message">{message}</p>
        <div className="notification-confirm-buttons">
          <button
            className="notification-confirm-button notification-confirm-button-confirm"
            onClick={() => {
              onConfirm();
              toast.dismiss(t.id);
            }}
          >
            Confirm
          </button>
          <button
            className="notification-confirm-button notification-confirm-button-cancel"
            onClick={() => {
              onCancel();
              toast.dismiss(t.id);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, // Keep open until dismissed
    });
  };


  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showLoading, dismiss, showConfirmation }}>
      {children}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: '',
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 3000,
            theme: {
              primary: 'red',
              secondary: 'white',
            },
          },
        }}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};