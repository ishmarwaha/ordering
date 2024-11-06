import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { ORDER_PACKAGE_NAME } from './generated-protos/order';
import { GrpcExceptionFilter } from './exceptions/grpc.exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: ORDER_PACKAGE_NAME,
        protoPath: join(__dirname, '../../protos/order.proto'),
        url: '0.0.0.0:50052',
      },
    },
  );
  app.useGlobalFilters(new GrpcExceptionFilter());
  await app.listen();
  console.log('order gRPC server is running...');
}
bootstrap();
