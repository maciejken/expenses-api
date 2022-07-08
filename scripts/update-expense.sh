curl -s -w "\n%{http_code}" -X PATCH -H "Content-Type: application/json" \
  --data "{\"title\": \"$2\", \"amount\": $3, \"category\": \"$4\", \"date\": \"$5\"}" \
  http://localhost:$HTTP_PORT/api/expenses/$1 | {
    read body
    read code
    echo $body | jq
    echo "Status: $code"
  }