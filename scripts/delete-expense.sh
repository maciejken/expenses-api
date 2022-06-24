curl -s -w "\n%{http_code}" -X DELETE -H "Content-Type: application/json" \
  "http://localhost:$HTTP_PORT/api/expenses/$1" | {
    read body
    read code
    echo $body
    echo "Status: $code"
  }