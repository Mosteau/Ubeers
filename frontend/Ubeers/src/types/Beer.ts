export interface Beer {
  id: number;
  label: string;
  brewery: string;
  type: string;
  alcoholPercent: number;
  price: number;
  stockQuantity: number;
  description: string;
  imageUrl: string;
  lastUpdate?: string | { data: { user: string } };
}
