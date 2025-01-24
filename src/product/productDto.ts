export interface ProductDTO {
  id: number;
  fullName: string;
  shortName: string;
  price: number;
  category: 'STARTER' | 'MAIN' | 'DESSERT' | 'BEVERAGE';
  subcategory: string;
  image: string;
  backendId: string;
}