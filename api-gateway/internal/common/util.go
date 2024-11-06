package util

import (
	"net/http"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func MapRpcErrorToHttp(err error, w http.ResponseWriter) {
	if e, ok := status.FromError(err); ok {
		switch e.Code() {
		case codes.NotFound:
			w.WriteHeader(http.StatusNotFound)
		case codes.Internal:
		case codes.Unknown:
			w.WriteHeader(http.StatusInternalServerError)
		default:
			w.WriteHeader(http.StatusInternalServerError)
		}
	} else {
		w.WriteHeader(http.StatusInternalServerError)
	}
}
