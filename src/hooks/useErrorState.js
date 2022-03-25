/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useNotificationContext } from '../contexts';
import { STATUSES } from '../contexts/NotificationContext';

export const useErrorState = (initialState, showError) => {
  const { showNotification } = useNotificationContext();
  const [state, setState] = useState(initialState);

  const setValue = (value) => {
    if (value?.errorMessage || !value) {
      if (showError) {
        showNotification({ message: value.errorMessage, type: STATUSES.ERROR });
      }
      setState(initialState);
    } else {
      setState(value);
    }
  };
  return [state, setValue];
};
