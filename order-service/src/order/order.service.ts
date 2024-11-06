import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, OrderStatus } from 'src/db/entities/order.entity';
import { CreateOrderResponse } from 'src/generated-protos/order';
import { Order, RequestedProduct, Product } from 'src/generated-protos/order';
import {
  DeductQuantityRequest,
  Product as ProductProductService,
  PRODUCT_PACKAGE_NAME,
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from 'src/generated-protos/product';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService implements OnModuleInit {
  private productService: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_PACKAGE_NAME) private client: ClientGrpc,
    @InjectRepository(OrderEntity)
    private ordersRepository: Repository<OrderEntity>,
  ) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async createOrder(
    requestedProducts: RequestedProduct[],
  ): Promise<CreateOrderResponse> {
    let orderEntity = await this.ordersRepository.create({
      status: OrderStatus.CREATED,
      products: requestedProducts,
    });

    orderEntity = await this.ordersRepository.save(orderEntity);

    const deductQuantityRequest: DeductQuantityRequest = {
      deductQuantities: requestedProducts.map((p) => {
        return {
          id: p.id,
          requestedQuantity: p.requestedQuantity,
        };
      }),
    };

    const isDeductionSuccess = await this.productService
      .deductProductQuantity(deductQuantityRequest)
      .toPromise();

    if (isDeductionSuccess.success) {
      orderEntity.status = OrderStatus.COMPLETED;
    } else {
      orderEntity.status = OrderStatus.CANCELLED;
    }

    orderEntity = await this.ordersRepository.save(orderEntity);
    return {
      id: orderEntity.id,
      status: orderEntity.status,
    };
  }

  async listAll(): Promise<Order[]> {
    const orderEntities = await this.ordersRepository.find();
    const orders: Order[] = [];

    for (let i = 0; i < orderEntities.length; i++) {
      const orderEntity = orderEntities.at(i);
      const productIds = orderEntity.products.map((p) => p.id);
      const products: ProductProductService[] = [];
      for (let j = 0; j < productIds.length; j++) {
        const product = await this.productService
          .get({ id: productIds.at(j) })
          .toPromise();
        products.push(product.product);
      }

      const orderProducts: Product[] = [];
      for (let j = 0; j < productIds.length; j++) {
        const orderProduct: Product = {
          id: productIds.at(j),
          name: products.at(j).name,
          description: products.at(j).description,
          price: products.at(j).price,
          requestedQuantity: orderEntity.products.at(j).requestedQuantity,
        };

        orderProducts.push(orderProduct);
      }
      const order: Order = {
        id: orderEntity.id,
        status: orderEntity.status,
        products: orderProducts,
      };

      orders.push(order);
    }
    return orders;
  }
}
