# wikey

```
git clone https://github.com/YanivOr/wikey-web.git
```

## server
The role of the server is for the WebSocket communication only

```
cd server
npm install
npm start
```

## client
A simple web page for operators and testings.
You can serve the pages by using Nginx or Apache, for example.

You can also use one of the simple web servers, for example: local-web-server.
Install it this way:

```
npm i local-web-server -g
```

Then:
```
cd client
npm install
npm run dev
  or
npm run build
ws -p 8000
```

open the browser at:
http://127.0.0.1:8000/