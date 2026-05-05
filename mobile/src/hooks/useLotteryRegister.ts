import { REACT_APP_API_URL } from '@env';
import { useMutation } from '@tanstack/react-query';

export const useLotteryRegister = () =>
  useMutation({
    mutationFn: ({ name, lotteries }: { name: string; lotteries: string[] }) =>
      Promise.all(
        lotteries.map((lotteryId) =>
          fetch(`${REACT_APP_API_URL}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, lotteryId }),
          })
        )
      ),
  });
