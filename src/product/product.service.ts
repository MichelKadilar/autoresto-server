import { Injectable } from '@nestjs/common';
import { Product } from '../product/product';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ProductDTO } from './productDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CacheService } from '../cache/cache.service';
import { ProductUtilService } from './product-util.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly cacheService: CacheService,
    private readonly productUtilService: ProductUtilService,
  ) {
  }

  private async fetchData(): Promise<Product[]> {
    const response$ = this.httpService.get(`http://localhost:3000/menus`);
    const response = await lastValueFrom(response$);
    return response.data;
  }

  private async fetchDataById(id: number): Promise<Product> {
    const response$ = this.httpService.get(`http://localhost:3000/menus/${id}`);
    const response = await lastValueFrom(response$);
    return response.data;
  }

  private async putProduct(id: number, product: Product): Promise<Product> {
    const response$ = this.httpService.put(`http://localhost:3000/menus/${id}`, product);
    const response = await lastValueFrom(response$);
    return response.data;
  }

  async getAllProducts(): Promise<ProductDTO[]> {
    const products: Product[] = await this.fetchData();
    const productDTOs: ProductDTO[] = products.map((product) => this.productUtilService.convertProductToProductDTO(product));
    const productEntities = productDTOs.map((dto) => this.productUtilService.convertProductDtoToProductEntity(dto));
    const savedProductEntities = await this.productRepository.save(productEntities);

    for (let i = 0; i < savedProductEntities.length; i++) {
      productDTOs[i].id = savedProductEntities[i].id;
    }
    await this.cacheService.cacheProducts(productDTOs);

    return productDTOs;
  }

  async getProductById(id: number): Promise<ProductDTO> {
    const cachedProduct: ProductDTO[] = await this.cacheService.getCachedProducts();
    if (cachedProduct) {
      return cachedProduct.find((product) => product.id === id);
    }

    const product: Product = await this.fetchDataById(id);
    const productDto = this.productUtilService.convertProductToProductDTO(product);
    await this.cacheService.cacheProduct(productDto);
    return productDto;
  }

  async updateProduct(id: number, productDto: ProductDTO): Promise<ProductDTO | null> {
    const product: Product = this.productUtilService.convertProductDtoToProduct(productDto);
    const updatedProduct = await this.putProduct(id, product);
    if (updatedProduct._id === product._id) {
      const updatedDto = this.productUtilService.convertProductToProductDTO(updatedProduct);
      await this.cacheService.cacheProduct(updatedDto);
      await this.productRepository.save(
        this.productUtilService.convertProductDtoToProductEntity(updatedDto),
      );
      return updatedDto;
    }
    return null;
  }

  async updateProductNameWithSubCategory(id: number, newSubcategory: string): Promise<ProductDTO> {
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
      backendId: product._id,
    };

    return this.updateProduct(id, productDto);
  }
}
