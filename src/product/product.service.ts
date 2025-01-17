import { Injectable } from '@nestjs/common';
import { Product } from '../product/product';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ProductDTO } from './productDto';

@Injectable()
export class ProductService {

  constructor(private readonly httpService: HttpService) {
  }

  private async fetchData(): Promise<any> {

    const response$ = this.httpService.get(`http://localhost:3000/menus`);

    const response = await lastValueFrom(response$);
    return response.data;
  }

  private async fetchDataById(id: string): Promise<any> {

    const response$ = this.httpService.get(`http://localhost:3000/menus/${id}`);

    const response = await lastValueFrom(response$);
    return response.data;
  }

  private async putProduct(id: string, product: ProductDTO): Promise<any> {

    const response$ =
      this.httpService.put(`http://localhost:3000/menus/${id}`, product);

    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.fetchData();
  }

  async getProductById(id: string): Promise<Product> {
    return await this.fetchDataById(id);
  }

  async updateProduct(id: string, product: ProductDTO): Promise<Product> {
    return await this.putProduct(id, product);
  }

  async updateProductNameWithSubCategory(id: string, newSubcategory: string): Promise<Product> {
    const product: Product = await this.getProductById(id);

    const productName = product.fullName.split('_')[0];
    product.fullName = productName.concat('_' + newSubcategory);

    return this.updateProduct(id, product);
  }

}
