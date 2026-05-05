import { REACT_APP_API_URL } from '@env';
import { useQuery } from '@tanstack/react-query';

import type { Lottery } from '../types.ts';

export const useLotteries = () =>
  useQuery<Lottery[]>({
    queryKey: ['lotteries'],
    queryFn: async () => {
      const response = await fetch(`${REACT_APP_API_URL}/lotteries`);

      const body = (await response.json()) as Array<Lottery>;

      return body;
    },
  });
