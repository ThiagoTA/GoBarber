import React, { useEffect } from 'react';
import {
  FiAlertCircle, FiXCircle, FiCheckCircle, FiInfo,
} from 'react-icons/fi';

import { ToastMessage, useToast } from '../../../hooks/ToastContext';

import { Container } from './styles';

interface ToastProps {
    message: ToastMessage
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiXCircle size={24} />,
  sucess: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);

  return (
    <Container type={message.type} hasDescription={!!message.description}>
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>
      <button onClick={() => removeToast(message.id)} type="button">
        <FiAlertCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
