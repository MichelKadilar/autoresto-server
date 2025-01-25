import { Module } from '@nestjs/common';
import { CacheManagerModule } from '../cache/cache.module';
import { CacheService } from '../cache/cache.service';


@Module({
  imports: [
    CacheManagerModule,
  ],
  providers: [CacheService],
})
export class SchedulerModule {
}
