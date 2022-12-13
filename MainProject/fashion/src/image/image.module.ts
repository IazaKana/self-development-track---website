import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageMapper } from './image.mapper';

@Module({
  providers: [ImageService, ImageMapper],
  exports: [ImageService, ImageMapper],
})
export class ImageModule {}
