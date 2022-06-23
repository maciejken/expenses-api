URL=http://$HOSTNAME:$HTTP_PORT/api/expenses/$1
echo GET $URL
curl -s -w "\n%{http_code}" $URL | {
  read body
  read code
  echo $body
  echo "Status: $code"
}