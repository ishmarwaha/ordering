# Ordering
Ordering application with using grpc micro-services

### Components

1. **product-service**: nestJS gRPC microservice to manage Product details (name, description, etc.)
2. **ordering-service**: nestJS gRPC microservice to manage Order creation and completion
3. **api-gateway**: Golang service using gorilla mux to act as a gateway for `product-service` and `ordering-service`

These services are able to communicate with each other through RPC calls using the protobuf definitions defined in `protos` folder.

The gateway implements a layer of JWT authentication and requires the client to pass in an authorization token in header while trying to access any of the exposed endpoints.

Both `product-service` and `order-service` use Postgres as the datastore which is accessed using TypeORM.

### Setup
Run the following docker command to spin up all the required containers:
```
docker compose up -d
```

Add seed data to populate products in the `product-service`:
```
docker exec product npm run seed:run
```

### API reference
#### Authentication
- `POST /login` - returns auth access token (only supports `admin` and `password` as the login credentials for now)
### Products
- `GET /products/{id}` - returns product with given id
- `POST /products/` - creates a new product
- `PATCH /products/{id}` - updates the product with the given id
- `DELETE /products/{id}` - deleted the product with the given id

### Orders
- `GET /orders/` - returns all the orders
- `POST /orders/` - Creates a new order - returns status as `COMPLETE` if each product in the order has the required quantity available

#### Postman collection available in the repo `./Ordering.postman_collection.json`
