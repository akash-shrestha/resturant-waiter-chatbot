import { useCallback, useState } from 'react';
import { getOrder } from '../services/chat';

export function useOrder() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [orderConfirmationMessage, setOrderConfirmationMessage] = useState('');
  const [orderConfirmationType, setOrderConfirmationType] = useState('');

  const fetchOrderDetails = useCallback(async () => {
    setIsOrderLoading(true);
    setOrderError('');
    setOrderConfirmationMessage('');
    setOrderConfirmationType('');
    try {
      const response = await getOrder();
      setOrderDetails(response);
    } catch (error) {
      console.error(error);
      setOrderDetails(null);
      setOrderError('Could not load order details. Please try again later.');
    } finally {
      setIsOrderLoading(false);
    }
  }, []);

  const openOrderModal = useCallback(async () => {
    setIsOrderModalOpen(true);
    await fetchOrderDetails();
  }, [fetchOrderDetails]);

  const closeOrderModal = useCallback(() => {
    setIsOrderModalOpen(false);
  }, []);

  const finalizeOrderConfirmation = useCallback(async () => {
    if (isConfirmingOrder) return;
    setIsConfirmingOrder(true);
    setOrderConfirmationMessage('');
    setOrderConfirmationType('');
    try {
      const response = await getOrder();
      setOrderDetails(response);
      if (response.status === 'ready_for_confirmation') {
        setOrderConfirmationMessage('Order confirmed!');
        setOrderConfirmationType('success');
      } else {
        setOrderConfirmationMessage(
          'Please provide the required details for order completion and proceed.'
        );
        setOrderConfirmationType('warning');
      }
    } catch (error) {
      console.error(error);
      setOrderConfirmationMessage('Could not confirm order. Please try again later.');
      setOrderConfirmationType('error');
    } finally {
      setIsConfirmingOrder(false);
    }
  }, [isConfirmingOrder]);

  return {
    isOrderModalOpen,
    isOrderLoading,
    isConfirmingOrder,
    orderDetails,
    orderError,
    orderConfirmationMessage,
    orderConfirmationType,
    openOrderModal,
    closeOrderModal,
    finalizeOrderConfirmation,
  };
}
