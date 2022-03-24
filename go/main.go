package main 

import (
	"time"
	"context"
	"strings"
	"regexp"
	"log"
	"io/ioutil"
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"math/rand"
	"os/exec"
	"net/http"
	"github.com/rs/cors"
	"github.com/gorilla/mux"
)

type JsonRequest struct {
	Language   string `json:"language"`
	Source     string `json:"source"`
	Expression string `json:"expression"`
}

type JsonResponse struct {
	Evaluated string `json:"evaluated"`
	Error     string `json:"error"` 
}

func chompString(s string) string {
	re := regexp.MustCompile("^(> )*") 
	return re.ReplaceAllString(s, "")
}

func getModuleName(r JsonRequest) (string, error) {
	lines := strings.Split(r.Source, "\n")
	moduleLine := lines[0]
	re := regexp.MustCompile("^module .* exposing \\(((.*)(,.*)*|\\.\\.)\\)$")
	if !re.Match([]byte(moduleLine)) {
		return "", fmt.Errorf("invalid module specifier")
	} else {
		components := strings.Split(moduleLine, " ")
		return components[1], nil
	}
}

func isExpr(s string) bool {
	if s[0:1] == "> " {
		return true
	}
	return false
}

func dropCR(data []byte) []byte {
	if len(data) > 0 && data[len(data)-1] == '\r' {
		return data[0 : len(data) - 1]
	}
	return data
}

func ElmEvalHandler(w http.ResponseWriter, r *http.Request) {
	body, _ := ioutil.ReadAll(r.Body)
	var data JsonRequest
	if err := json.Unmarshal(body, &data); err == nil {
		module, err := getModuleName(data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Invalid module header")
			return
		}
		s1 := rand.NewSource(time.Now().UnixNano())
		r1 := rand.New(s1);
		filename := fmt.Sprintf("%s_%d", module, r1.Intn(100000))
		data.Source = strings.Replace(data.Source, module, filename, -1)
		if file, err := os.Create(filename + ".elm"); err == nil {
			defer file.Close()
			if _, err = file.WriteString(data.Source); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintf(w, "Failed to write preamble")
				return
			}
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Failed to write preamble")
			return
		}
		
		ctx, cancel := context.WithTimeout(context.Background(), 12*time.Second)
		defer cancel()
		cmd := exec.CommandContext(ctx, "elm", "repl", "--no-colors")
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
		//defer out.Close()
		errOut, err := cmd.StderrPipe()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Failed to get standard error")
			return
		}

		bufOut := bufio.NewReader(out)
		_ = bufio.NewReader(errOut)
		if err = cmd.Start(); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Failed to get output stream")
			return
		}
		defer cmd.Process.Kill()

		bufOut.ReadLine()
		bufOut.ReadLine()
		bufOut.ReadLine()

		// Close REPL on terminate
		
		// Write Preamble
		in.Write([]byte("import " + filename + " exposing (..)\n"))
		in.Write([]byte(data.Expression + "\n"))
		in.Write([]byte(":exit\n"))
		
		result, _ := ioutil.ReadAll(bufOut)
		
		if err := cmd.Wait(); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(w, "timeout error")
			fmt.Printf("timeout!")
			return
		}
		

		var resp JsonResponse
		re := regexp.MustCompile("^((::)?[_a-zA-Z.0-9 ]*)+$")
		if !re.Match([]byte(data.Expression)) {
			resp = JsonResponse {
				Error: "Invalid expression; we suspect you meant either a type or to run a REPL command",
			}
		} else	if errMsg, err := ioutil.ReadAll(errOut); err == nil && string(errMsg) != "" {
			resp = JsonResponse{
				Error: string(errMsg),
			}
		} else {
			res := strings.Split(string(result), "\n")
			if len(res) >= 2 { 
				resp = JsonResponse {
					Evaluated: chompString(res[len(res)-2]),	
			
				}
			} else {
				resp = JsonResponse {
					Evaluated: "",	
				}
			}
		} 
		os.Remove(filename + ".elm")
		respBody, _ := json.Marshal(resp)
		fmt.Fprintf(w, "%s", string(respBody))
	} else {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Bad JSON format")
	}
}

func StatusHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Ok")
}

func main() {

	r := mux.NewRouter()
	r.HandleFunc("/", StatusHandler)
	r.HandleFunc("/eval", ElmEvalHandler).Methods("POST")
	http.Handle("/", r)
	
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowCredentials: true,
		AllowedHeaders: []string{"X-Requested-With", "content-type"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"},
	})

	handler := c.Handler(r)

	fmt.Printf("running on port :9000\n")
	log.Fatal(http.ListenAndServe(":9000", handler))
	defer fmt.Printf("Shutting down...\n")
}
