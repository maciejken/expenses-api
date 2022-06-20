curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" \
  --data "{\"title\": \"$1\", \"amount\": $2}" \
  "http://localhost:$HTTP_PORT/api/expenses" | {
    read body
    read code
    echo $body | jq
    echo "\nStatus: $code"
  }