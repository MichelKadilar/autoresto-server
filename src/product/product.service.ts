import { Injectable } from '@nestjs/common';
import { Product } from '../product/product';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ProductDTO } from './productDto';

@Injectable()
export class ProductService {

  constructor(private readonly httpService: HttpService) {
  }

  private async fetchData(): Promise<Product[]> {
    const response$ = this.httpService.get(`http://localhost:3000/menus`);
    const response = await lastValueFrom(response$);
    return response.data;
  }

  private async fetchDataById(id: string): Promise<Product> {
    const response$ = this.httpService.get(`http://localhost:3000/menus/${id}`);
    const response = await lastValueFrom(response$);
    return response.data;
  }

  private async putProduct(id: string, product: Product): Promise<Product> {
    const response$ = this.httpService.put(`http://localhost:3000/menus/${id}`, product);
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getAllProducts(): Promise<ProductDTO[]> {
    const products: Product[] = await this.fetchData();
    return products.map((product) => this.convertProductToProductDTO(product));
  }

  async getProductById(id: string): Promise<ProductDTO> {
    const product: Product = await this.fetchDataById(id);
    return this.convertProductToProductDTO(product);
  }

  async updateProduct(id: string, productDto: ProductDTO): Promise<ProductDTO | null> {
    const product: Product = this.convertProductDtoToProduct(productDto);
    const updatedProduct = await this.putProduct(id, product);
    if (updatedProduct.fullName === product.fullName) {
      return this.convertProductToProductDTO(updatedProduct);
    }
    return null;
  }

  async updateProductNameWithSubCategory(id: string, newSubcategory: string): Promise<ProductDTO> {
    const product: Product = await this.fetchDataById(id);

    const [name] = product.fullName.includes('_')
      ? product.fullName.split('_')
      : [product.fullName];

    const productDto: ProductDTO = {
      id: id,
      fullName: name,
      shortName: product.shortName,
      subcategory: newSubcategory,
      price: product.price,
      category: product.category,
      image: product.image,
    };

    return this.updateProduct(id, productDto);
  }


  private convertProductToProductDTO(product: Product): ProductDTO {
    if (!product.fullName) {
      throw new Error(`Invalid fullName format for product with ID: ${product._id}`);
    }

    const [name, subcategory] = product.fullName.split('_');

    return {
      id: product._id,
      fullName: name || product.fullName,
      subcategory: subcategory || 'none',
      shortName: product.shortName,
      price: product.price,
      category: product.category,
      image: product.image,
    };
  }


  private convertProductDtoToProduct(productDto: ProductDTO): Product {
    const fullName = productDto.subcategory && productDto.subcategory !== 'none'
      ? `${productDto.fullName}_${productDto.subcategory}`
      : productDto.fullName;

    return {
      _id: productDto.id,
      fullName: fullName,
      shortName: productDto.shortName,
      price: productDto.price,
      category: productDto.category,
      image: productDto.image,
    };
  }
}