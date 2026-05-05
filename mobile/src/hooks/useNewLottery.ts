import { REACT_APP_API_URL } from '@env';
import { useMutation } from '@tanstack/react-query';

export const useNewLottery = () => {
  return useMutation({
    mutationFn: ({ name, prize }: { name: string; prize: string }) =>
      fetch(`${REACT_APP_API_URL}/lotteries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'simple',
          name,
          prize,
        }),
      }),
  });
};
