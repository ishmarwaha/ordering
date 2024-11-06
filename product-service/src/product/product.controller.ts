import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateRequest,
  CreateResponse,
  GetRequest,
  GetResponse,
  UpdateRequest,
  UpdateResponse,
  ProductServiceController,
  ProductServiceControllerMethods,
  DeleteRequest,
  DeleteResponse,
  DeductQuantityRequest,
  DeductQuantityResponse,
} from '../generated-protos/product';

@Controller('product')
@ProductServiceControllerMethods()
export class ProductController implements ProductServiceController {
  constructor(private readonly productService: ProductService) {}

  async create(request: CreateRequest): Promise<CreateResponse> {
    const product = await this.productService.create(request);
    return { product };
  }

  async get(request: GetRequest): Promise<GetResponse> {
    const product = await this.productService.getById(request.id);
    return { product };
  }

  async update(request: UpdateRequest): Promise<UpdateResponse> {
    const product = await this.productService.update(request.product);
    return { product };
  }

  async delete(request: DeleteRequest): Promise<DeleteResponse> {
    const isDeleted = await this.productService.deleteById(request.id);
    return { success: isDeleted };
  }

  async deductProductQuantity(
    request: DeductQuantityRequest,
  ): Promise<DeductQuantityResponse> {
    const success = await this.productService.deductProductQuantity(
      request.deductQuantities,
    );

    return { success: success };
  }
}
