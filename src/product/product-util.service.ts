import { Injectable } from '@nestjs/common';
import { Product } from './product';
import { ProductDTO } from './productDto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductUtilService {

  convertProductToProductDTO(product: Product): ProductDTO {
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

  convertProductDtoToProduct(productDto: ProductDTO): Product {
    const fullName = productDto.subcategory && productDto.subcategory !== 'none'
      ? `${productDto.fullName}_${productDto.subcategory}`
      : productDto.fullName;

    return {
      _id: productDto.backendId,
      fullName: fullName,
      shortName: productDto.shortName,
      price: productDto.price,
      category: productDto.category,
      image: productDto.image,
    };
  }

  convertProductDtoToProductEntity(productDto: ProductDTO): ProductEntity {
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

  convertProductEntityToProductDTO(productEntity: ProductEntity): ProductDTO {
    return {
      id: productEntity.id,
      fullName: productEntity.fullName,
      shortName: productEntity.shortName,
      price: productEntity.price,
      category: productEntity.category,
      subcategory: productEntity.subcategory,
      image: productEntity.image,
      backendId: productEntity.backendProductId,
    };
  }

}