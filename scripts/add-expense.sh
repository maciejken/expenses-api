URL=http://$HOSTNAME:$HTTP_PORT/api/expenses
echo POST $URL

curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" \
  --data "{\"title\": \"$1\", \"amount\": $2}" \
  $URL | {
    read body
    read code
    echo $body | jq
    echo "Status: $code"
  }