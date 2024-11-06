package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"ordering.com/api_gateway/internal/auth"
	"ordering.com/api_gateway/internal/grpc_clients/order"
	"ordering.com/api_gateway/internal/grpc_clients/product"
	"ordering.com/api_gateway/internal/handlers"
)

func main() {
	router := mux.NewRouter()

	authHandlers := handlers.Auth{}
	router.HandleFunc("/login", authHandlers.Login).Methods(http.MethodPost)

	orderConnection, err := grpc.NewClient(os.Getenv("ORDER_SERVICE_URL"), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("not able to connect to order service: %v", err)
	}
	defer orderConnection.Close()

	orderServiceClient := order.NewOrderServiceClient(orderConnection)
	orderHandlers := handlers.Order{
		C: orderServiceClient,
	}

	productConnection, err := grpc.NewClient(os.Getenv("PRODUCT_SERVICE_URL"), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("not able to connect to product service: %v", err)
	}
	defer orderConnection.Close()

	productServiceClient := product.NewProductServiceClient(productConnection)
	productHandlers := handlers.ProductHandler{
		C: productServiceClient,
	}

	protectedRouter := router.PathPrefix("/").Subrouter()
	protectedRouter.Use(auth.Middleware)

	orderRouter := protectedRouter.PathPrefix("/orders").Subrouter()
	orderRouter.HandleFunc("/", orderHandlers.GetAll).Methods(http.MethodGet)
	orderRouter.HandleFunc("/", orderHandlers.Create).Methods(http.MethodPost)

	productRouter := protectedRouter.PathPrefix("/products").Subrouter()
	productRouter.HandleFunc("/{id}", productHandlers.Get).Methods(http.MethodGet)
	productRouter.HandleFunc("/", productHandlers.Create).Methods(http.MethodPost)
	productRouter.HandleFunc("/{id}", productHandlers.Update).Methods(http.MethodPatch)
	productRouter.HandleFunc("/{id}", productHandlers.Delete).Methods(http.MethodDelete)
	http.ListenAndServe(":8080", router)
}
