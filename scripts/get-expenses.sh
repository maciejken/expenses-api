URL=http://localhost:$HTTP_PORT/api/expenses
echo GET $URL
curl -s -w "\n%{http_code}" $URL | {
  read body
  read code
  echo $body
  echo "Status: $code"
}