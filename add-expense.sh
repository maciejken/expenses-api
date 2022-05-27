echo $(curl \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"$1\", \"amount\": $2}" \
   http://localhost:${HTTP_PORT}/api/expenses)