const API_URL = "http://localhost:3000";

import type { Beer } from '@/types/Beer';

export const fetchBeers = async (): Promise<Beer[]> => {
  try {
    const response = await fetch(`${API_URL}/beers`);
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
    const response = await fetch(`${API_URL}/beers/${id}`);
    if (!response.ok) {
      throw new Error (`Erreur: ${response.status}`);
    }
    const data: Beer = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la bière avec l'ID ${id} :`, error);
    throw error;
  }
};
