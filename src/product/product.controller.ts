import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { Product } from '../product/product';
import { ProductService } from './product.service';
import { ProductDTO } from './productDto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Get()
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(":id")
  getProductById(@Param('id') id): Promise<Product> {
    return this.productService.getProductById(id);
  }

 @Put(":id")
  updateProduct(@Param('id') id, @Body() product: ProductDTO): Promise<Product> {
    return this.productService.updateProduct(id, product);
  }

  @Put(":id/subcategory")
  updateProductSubcategory(@Param('id') id,
                           @Body('newSubcategory') newSubcategory: string): Promise<Product> {
    return this.productService.updateProductNameWithSubCategory(id, newSubcategory);
  }

}
