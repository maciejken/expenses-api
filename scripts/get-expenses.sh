curl -s -w "\n%{http_code}" "http://localhost:$HTTP_PORT/api/expenses" | {
  read body
  read code
  echo $body | jq
  echo "\nStatus: $code"
}