import { REACT_APP_API_URL } from '@env';

import type { Lottery } from '../types';

const API_URL = REACT_APP_API_URL;

console.log(API_URL);

export const createNewLottery = async ({
  name,
  prize,
}: {
  name: string;
  prize: string;
}): Promise<Lottery> => {
  try {
    const response = await fetch(`${API_URL}/lotteries`, {
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

    const body = (await response.json()) as Lottery;

    return body;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const getLotteries = async () => {
  try {
    const response = await fetch(`${API_URL}/lotteries`);

    const body = (await response.json()) as Array<Lottery>;

    return body;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const registerToLottery = async ({
  name,
  lotteryId,
}: {
  name: string;
  lotteryId: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, lotteryId }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error(error);

    throw error;
  }
};
