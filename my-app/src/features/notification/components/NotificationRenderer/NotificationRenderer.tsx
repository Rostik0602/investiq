import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { hideNotification } from '../../notificationSlice';
import { Notification } from '../../../../shared/ui/Notification/Notification';

export const NotificationRenderer = () => {
  const { message, type, visible } = useAppSelector((state) => state.notification);
  const dispatch = useAppDispatch();

  if (!visible || !message) return null;

  return (
    <Notification
      message={message}
      type={type}
      onClose={() => dispatch(hideNotification())}
    />
  );
};