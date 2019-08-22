# Thing-app-server

### Install & running Instructions

1. **Clone this repository in a folder**

  ` git clone https://github.com/npgr/thing-app-server.git `

  Or you can use your favorite Git Gui Client

  This will clone the server and client repositories

2. **Install dependencies**

2.1. **Server dependencies:** on root path

  ` npm install `

2.2. **Client dependencies:** inside thing-app folder

  ` npm install `

3. **Running Application:** on root path

  ` npm run dev `

  this will start the server and the client and will open on your default browser:

  ` http://localhost:8080 `
  
  The server is running on port 5000, you can query GraphQL on URL
  
  ` http://localhost:5000/graphql `
  
  For example you can run the query:
  
  `{ 
    validToken,
    popular { id, name },
    newest { id, name },
    featured { id, name }
  }`


### oAuth Authentication

  1. The home page (/) is the explore page where you can list things, this page at the begining check if exist a valid access token on server. If not, it redirects to /auth page
  
  2. The /auth page notify to user is needed to sign in on page Thingiverse and authorize the page, for this exists a button that redirects
  
  3. After sign in and authorize this application, thingiverse will redirect again to /auth page with the access_code
  
  4. The /auth page will send the code to server and wait for confirmation of receiving the access token
  
  5. When the access token is received by the server, this notify to /auth page which redirect to main page (explore)
  
  6. On explore page you can select a thing and the page of /detail will be open with more information of Thing
  
  
 **Note:** was not possible at this time to get authorizacion of Thingiverse for the oAuth process (is on process), instead of this, the application uses the App Token. All the Flow for oAuth Authentication is implemented in code, with some disabled lines (commented)
 
 Any doubt do not hesitate in ask
 
 # Enjoy the Application !!! #
