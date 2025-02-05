import type { Beer } from '@/types/Beer';
import { useAuth0 } from '@auth0/auth0-vue';
const API_URL = `${import.meta.env.VUE_APP_API_URL}/api`;

export const fetchBeers = async (): Promise<Beer[]> => {
  try {
    const { getAccessTokenSilently } = useAuth0();
    const token = await getAccessTokenSilently();

    const response = await fetch(`${API_URL}/beers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    const data: Beer[] = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des bières : ", error);
    throw error;
  }
};

export const fetchBeerById = async (id: number): Promise<Beer> => {
  try {
    const { getAccessTokenSilently } = useAuth0();
    const token = await getAccessTokenSilently();

    const response = await fetch(`${API_URL}/beers/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    const data: Beer = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des bières : ", error);
    throw error;
  }
};
