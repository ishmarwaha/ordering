import { Catch, ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
// import { status, ServiceError } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: RpcException, _host: ArgumentsHost): Observable<any> {
    return throwError(() => exception);
  }
}
