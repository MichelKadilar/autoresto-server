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
  getProductById(@Param('id') id: number): Promise<ProductDTO> {
    return this.productService.getProductById(id);
  }

  @Put()
  updateProduct(@Body() product: ProductDTO): Promise<ProductDTO> {
    return this.productService.updateProduct(product);
  }

  @Put(':id/subcategory')
  updateProductSubcategory(@Param('id') id: number,
                           @Body('newSubcategory') newSubcategory: string): Promise<ProductDTO> {
    return this.productService.updateProductNameWithSubCategory(id, newSubcategory);
  }

}
