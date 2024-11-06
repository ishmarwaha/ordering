package handlers

import (
	"encoding/json"
	"net/http"

	"ordering.com/api_gateway/internal/auth"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Auth struct{}

func (h *Auth) Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var u User
	err := json.NewDecoder((r.Body)).Decode(&u)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if u.Username == "admin" && u.Password == "password" {
		token, err := auth.CreateToken(u.Username)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"token": token,
		})
	} else {
		w.WriteHeader(http.StatusUnauthorized)
	}
}
