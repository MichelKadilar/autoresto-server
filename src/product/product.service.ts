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

    const productDTOs: ProductDTO[] = products.map((product) =>
      this.productUtilService.convertProductToProductDTO(product),
    );

    const existingProducts = await this.productRepository.find({
      where: productDTOs.map((dto) => ({ backendProductId: dto.backendId })),
    });

    const existingBackendIdMap = new Map(
      existingProducts.map((product) => [product.backendProductId, product]),
    );

    for (const dto of productDTOs) {
      const existingProduct = existingBackendIdMap.get(dto.backendId);

      if (existingProduct) {
        dto.id = existingProduct.id;
        const productEntity = this.productUtilService.convertProductDtoToProductEntity(dto);
        await this.productRepository.update(productEntity.id, productEntity);
      } else {
        const productEntity = this.productUtilService.convertProductDtoToProductEntity(dto);
        const savedProductEntity = await this.productRepository.save(productEntity);
        dto.id = savedProductEntity.id;
      }
    }

    await this.cacheService.cacheProducts(productDTOs);

    return productDTOs;
  }

  async getProductById(id: number): Promise<ProductDTO> {
    const cachedProduct: ProductDTO = await this.cacheService.getCachedProduct(id);
    if (cachedProduct) {
      return cachedProduct;
    }
    return null;
  }

  async updateProduct(productDto: ProductDTO): Promise<ProductDTO | null> {
    const product: Product = this.productUtilService.convertProductDtoToProduct(productDto);
    const updatedProduct = await this.putProduct(product._id, product);
    if (updatedProduct._id === product._id) {
      const updatedDto = this.productUtilService.convertProductToProductDTO(updatedProduct);
      updatedDto.id = productDto.id;
      await this.cacheService.cacheProduct(updatedDto);
      await this.productRepository.update(productDto.id,
        this.productUtilService.convertProductDtoToProductEntity(updatedDto),
      );
      return updatedDto;
    }
    return null;
  }

  async updateProductNameWithSubCategory(id: number, newSubcategory: string): Promise<ProductDTO> {
    const cachedProduct: ProductDTO = await this.cacheService.getCachedProduct(id);
    if (cachedProduct) {
      const product: Product = await this.fetchDataById(cachedProduct.backendId);

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

      return this.updateProduct(productDto);
    }


  }
}
