import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  ListAllResponse,
  OrderServiceController,
  OrderServiceControllerMethods,
} from 'src/generated-protos/order';

@Controller()
@OrderServiceControllerMethods()
export class OrderController implements OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    const order = await this.orderService.createOrder(data.products);
    return order;
  }

  async listAll(): Promise<ListAllResponse> {
    const orders = await this.orderService.listAll();
    return { orders };
  }
}
