export interface Product {
  _id: string;
  fullName: string;
  shortName: string;
  price: number;
  category: 'STARTER' | 'MAIN' | 'DESSERT' | 'BEVERAGE';
  image: string;
}