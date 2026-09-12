import { toast } from 'react-toastify';

const baseOptions = {
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: false,
};

export const notify = {
  success: (message) => toast.success(message, baseOptions),
  error: (message) => toast.error(message, baseOptions),
  info: (message) => toast.info(message, baseOptions),
};
