import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { PRODUCT_PACKAGE_NAME } from './generated-protos/product';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: PRODUCT_PACKAGE_NAME,
        protoPath: join(__dirname, '../../protos/product.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
  console.log('product gRPC server is running...');
}
bootstrap();
