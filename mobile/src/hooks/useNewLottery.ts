import { REACT_APP_API_URL } from '@env';
import { useMutation } from '@tanstack/react-query';
import { NotificationModule } from 'nitro-notification';

export const useNewLottery = () => {
  return useMutation({
    mutationFn: async ({ name, prize }: { name: string; prize: string }) => {
      const response = await fetch(`${REACT_APP_API_URL}/lotteries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'simple',
          name,
          prize,
        }),
      });

      NotificationModule.showNotification(
        'Lottery Created',
        'Your new lottery has been added successfully!',
      );

      return response;
    },
  });
};
