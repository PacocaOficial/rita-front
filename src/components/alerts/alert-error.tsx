import React, { useEffect } from 'react';

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
  show: boolean;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose, show }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (show) {
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="absolute top-4  right-4 z-50 w-full max-w-sm bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
      <strong className="font-bold">Erro: </strong>
      <span className="block sm:inline">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        aria-label="Fechar"
      >
        <svg
          className="fill-current h-6 w-6 text-red-700"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Fechar</title>
          <path d="M14.348 5.652a.5.5 0 10-.707-.707L10 8.586 6.36 4.945a.5.5 0 10-.707.707L9.293 10l-3.64 3.641a.5.5 0 10.707.707L10 11.414l3.641 3.641a.5.5 0 00.707-.707L10.707 10l3.641-3.641z" />
        </svg>
      </button>
    </div>
  );
};

export default ErrorAlert;
