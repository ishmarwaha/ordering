package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"

	util "ordering.com/api_gateway/internal/common"
	"ordering.com/api_gateway/internal/grpc_clients/product"
)

type ProductHandler struct {
	C product.ProductServiceClient
}

type CreateProductRequest struct {
	Name              string  `json:"name" validate:"required"`
	Description       string  `json:"description" validate:"required"`
	AvailableQuantity int32   `json:"availableQuantity" validate:"required"`
	Price             float32 `json:"price" validate:"required"`
}

type UpdateProductRequest struct {
	Name              string  `json:"name,omitempty"`
	Description       string  `json:"description,omitempty"`
	AvailableQuantity int32   `json:"availableQuantity,omitempty"`
	Price             float32 `json:"price,omitempty"`
}

var validate = validator.New()

func (h *ProductHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateProductRequest
	err := json.NewDecoder((r.Body)).Decode(&req)
	if err != nil {
		fmt.Printf("error: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = validate.Struct(req)
	if err != nil {
		fmt.Printf("error: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	grpcRequest := &product.CreateRequest{
		Name:              req.Name,
		Description:       req.Description,
		AvailableQuantity: req.AvailableQuantity,
		Price:             req.Price,
	}

	resp, err := h.C.Create(r.Context(), grpcRequest)
	if err != nil {
		fmt.Printf("error: %+v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func (h *ProductHandler) Get(w http.ResponseWriter, r *http.Request) {
	productId, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		fmt.Printf("error: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := h.C.Get(r.Context(), &product.GetRequest{Id: int32(productId)})
	if err != nil {
		fmt.Printf("error: %+v", err)
		util.MapRpcErrorToHttp(err, w)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func (h *ProductHandler) Update(w http.ResponseWriter, r *http.Request) {
	productId, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		fmt.Printf("error: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var req UpdateProductRequest
	err = json.NewDecoder((r.Body)).Decode(&req)
	if err != nil {
		fmt.Printf("error: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = validate.Struct(req)
	if err != nil {
		fmt.Printf("error: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	grpcRequest := &product.UpdateRequest{
		Product: &product.Product{
			Id:                int32(productId),
			Name:              req.Name,
			Description:       req.Description,
			AvailableQuantity: req.AvailableQuantity,
			Price:             req.Price,
		},
	}

	resp, err := h.C.Update(r.Context(), grpcRequest)
	if err != nil {
		fmt.Printf("error: %+v", err)
		util.MapRpcErrorToHttp(err, w)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func (h *ProductHandler) Delete(w http.ResponseWriter, r *http.Request) {
	productId, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		fmt.Printf("error: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := h.C.Delete(r.Context(), &product.DeleteRequest{Id: int32(productId)})
	if err != nil {
		fmt.Printf("error: %+v", err)
		util.MapRpcErrorToHttp(err, w)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}
