import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './productDto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Get()
  getAllProducts(): Promise<ProductDTO[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id): Promise<ProductDTO> {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  updateProduct(@Param('id') id, @Body() product: ProductDTO): Promise<ProductDTO> {
    return this.productService.updateProduct(id, product);
  }

  @Put(':id/subcategory')
  updateProductSubcategory(@Param('id') id,
                           @Body('newSubcategory') newSubcategory: string): Promise<ProductDTO> {
    return this.productService.updateProductNameWithSubCategory(id, newSubcategory);
  }

}
