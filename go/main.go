package main 

import (
	"io"
	"io/ioutil"
	"bufio"
	"encoding/json"
	"fmt"
	"os/exec"
	"net/http"
	"encoding/base64"
	"github.com/gorilla/mux"
)

type JsonRequest struct {
	Language string `json:"language"`
	Source string `json:"source"`
}

func ElmEvalHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	vars := mux.Vars(r)
	fmt.Printf("%+v\n", vars)
	fmt.Printf("%+v\n", r.FormValue("source"))
	if encBytes, err := base64.StdEncoding.DecodeString(vars["src"]); err == nil {
		var data JsonRequest
		if err := json.Unmarshal(encBytes, &data); err == nil {
			cmd := exec.Command("elm", "repl", "--no-colors")
			in, err := cmd.StdinPipe()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Failed to get standard input")
				return
			}
			defer in.Close()
			out, err := cmd.StdoutPipe()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Failed to get standard output")
				return
			}
			defer out.Close()
			errOut, err := cmd.StderrPipe()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Failed to get standard error")
				return
			}

			bufOut := bufio.NewReader(out)
			bufErr := bufio.NewReader(errOut)
			if err = cmd.Start(); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Failed to get standard output")
				return
			}
			_, _, _ = bufOut.ReadLine()
			_, _, _ = bufOut.ReadLine()
			_, _, _ = bufOut.ReadLine()
			in.Write([]byte(data.Source + "\n"))
			in.Write([]byte(":exit\n"))
			w.WriteHeader(http.StatusOK)
			result, err := ioutil.ReadAll(io.MultiReader(bufOut, bufErr))
			fmt.Printf("%s", string(result))
			fmt.Fprintf(w,"%s", string(result))
		} else {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, "Bad JSON format")
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Invalid base64 string")
	}
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/eval", ElmEvalHandler)
	http.Handle("/", r)
	fmt.Printf("running on port :9000\n")
	http.ListenAndServe(":9000", nil)
}
