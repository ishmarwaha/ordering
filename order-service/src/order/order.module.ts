import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PRODUCT_PACKAGE_NAME } from 'src/generated-protos/product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/db/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ClientsModule.register([
      {
        name: PRODUCT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: PRODUCT_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../protos/product.proto'),
          url: 'product:50051',
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
