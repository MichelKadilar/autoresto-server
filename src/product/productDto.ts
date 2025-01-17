export interface ProductDTO {
  fullName: string;
  shortName: string;
  price: number;
  category: 'STARTER' | 'MAIN' | 'DESSERT' | 'BEVERAGE';
  image: string;
}