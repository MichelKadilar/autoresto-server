import { Injectable } from '@nestjs/common';
import { Product } from '../product/product';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ProductDTO } from './productDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly cacheService: CacheService,
  ) {
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
    const productDTOs: ProductDTO[] = products.map((product) => this.convertProductToProductDTO(product));
    const productEntities = productDTOs.map((dto) => this.convertProductDtoToProductEntity(dto));
    const savedProductEntities = await this.productRepository.save(productEntities);

    for (let i = 0; i < savedProductEntities.length; i++) {
      productDTOs[i].id = savedProductEntities[i].id;
    }
    await this.cacheService.cacheProducts(productDTOs);

    return productDTOs;
  }

  async getProductById(id: string): Promise<ProductDTO> {
    const cachedProduct: ProductDTO[] = await this.cacheService.getCachedProducts();
    if (cachedProduct) {
      return cachedProduct.find((product) => product.id === id);
    }

    const product: Product = await this.fetchDataById(id);
    const productDto = this.convertProductToProductDTO(product);
    await this.cacheService.cacheProduct(productDto);
    return productDto;
  }

  async updateProduct(id: string, productDto: ProductDTO): Promise<ProductDTO | null> {
    const product: Product = this.convertProductDtoToProduct(productDto);
    const updatedProduct = await this.putProduct(id, product);
    if (updatedProduct._id === product._id) {
      const updatedDto = this.convertProductToProductDTO(updatedProduct);
      await this.cacheService.cacheProduct(updatedDto);
      await this.productRepository.save(
        this.convertProductDtoToProductEntity(updatedDto),
      );
      return updatedDto;
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
      backendId: product._id,
    };

    return this.updateProduct(id, productDto);
  }

  private convertProductToProductDTO(product: Product): ProductDTO {
    if (!product.fullName) {
      throw new Error(`Invalid fullName format for product with ID: ${product._id}`);
    }

    const [name, subcategory] = product.fullName.split('_');

    return {
      id: null,
      fullName: name || product.fullName,
      subcategory: subcategory || 'none',
      shortName: product.shortName,
      price: product.price,
      category: product.category,
      image: product.image,
      backendId: product._id,
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

  private convertProductDtoToProductEntity(productDto: ProductDTO): ProductEntity {
    const productEntity = new ProductEntity();
    productEntity.id = productDto.id;
    productEntity.fullName = productDto.fullName;
    productEntity.shortName = productDto.shortName;
    productEntity.price = productDto.price;
    productEntity.category = productDto.category;
    productEntity.subcategory = productDto.subcategory;
    productEntity.image = productDto.image;
    productEntity.backendProductId = productDto.backendId;
    return productEntity;
  }
}
