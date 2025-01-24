import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { CacheManagerModule } from '../cache/cache.module';
import { ProductUtilService } from './product-util.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([ProductEntity]),
    CacheManagerModule
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductUtilService],
})
export class ProductModule {
}
