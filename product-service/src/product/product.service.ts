import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeductQuantity, Product } from 'src/generated-protos/product';
import { ProductEntity } from 'src/db/entities/product.entity';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Connection } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    private connection: Connection,
  ) {}

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const productEntity = await this.productsRepository.create(product);
    const savedEntity = await this.productsRepository.save(productEntity);
    return savedEntity;
  }

  async update(product: Product): Promise<Product> {
    const productEntity = await this.productsRepository.findOneBy({
      id: product.id,
    });

    if (!productEntity) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `product with ${product.id} does not exist`,
      });
    }

    const updatedProductEntity = this.productsRepository.save(
      Object.assign(productEntity, product),
    );

    return updatedProductEntity;
  }

  async getById(id: number): Promise<Product> {
    const productEntity = await this.productsRepository.findOneBy({ id });
    if (!productEntity) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `product with id: ${id} does not exist`,
      });
    }
    return productEntity;
  }

  async deleteById(id: number): Promise<boolean> {
    const result = await this.productsRepository.softDelete(id);
    const recordsDeleted = result.affected;
    return recordsDeleted === 1;
  }

  async deductProductQuantity(
    deductQuantities: DeductQuantity[],
  ): Promise<boolean> {
    for (let i = 0; i < deductQuantities.length; i++) {
      const { id, requestedQuantity } = deductQuantities.at(i);
      const productEntity = await this.productsRepository.findOneBy({ id });
      if (!productEntity) {
        return false;
      }

      const isRequestedQuantityAvailable =
        productEntity.availableQuantity >= requestedQuantity;

      if (!isRequestedQuantityAvailable) {
        return false;
      }

      productEntity.availableQuantity =
        productEntity.availableQuantity - requestedQuantity;
      await this.productsRepository.save(productEntity);
    }

    return true;
  }
}
