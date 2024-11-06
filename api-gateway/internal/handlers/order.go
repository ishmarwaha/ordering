package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	log "github.com/sirupsen/logrus"
	util "ordering.com/api_gateway/internal/common"
	"ordering.com/api_gateway/internal/grpc_clients/order"
)

type Order struct {
	C order.OrderServiceClient
}

func (h *Order) GetAll(w http.ResponseWriter, r *http.Request) {
	log.Debug("order.GetAll function triggered")
	resp, err := h.C.ListAll(context.Background(), &order.Empty{})
	if err != nil {
		log.Debugf("order.GetAll error: %+v", err)
		util.MapRpcErrorToHttp(err, w)
		return
	}
	json.NewEncoder(w).Encode(resp)
}

func (h *Order) Create(w http.ResponseWriter, r *http.Request) {
	log.Debug("order.Create function triggered")
	var req order.CreateOrderRequest
	err := json.NewDecoder((r.Body)).Decode(&req)
	if err != nil {
		log.Errorf("order.Create error: %+v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	resp, err := h.C.CreateOrder(context.Background(), &req)
	if err != nil {
		log.Errorf("order.Create error: %+v", err)
		util.MapRpcErrorToHttp(err, w)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}
