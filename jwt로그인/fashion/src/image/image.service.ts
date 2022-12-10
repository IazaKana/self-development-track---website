import { Injectable } from '@nestjs/common';
import { ImageMapper, Image } from './image.mapper';

@Injectable()
export class ImageService {
  constructor(private readonly imageMapper: ImageMapper) {}

  async createImage(image: Image): Promise<void> {
    await this.imageMapper.insertImage(image);
  }

  async getImage(imageId: number): Promise<Image> {
    return this.imageMapper.findImage(imageId);
  }
}
