![alt tag](./img/trunk-seattle-logo.png)
# trunks-of-seattle
A server that CRUDs Seattle street tree data stored in a MongoDB

Mid course project week (week 5)- Annika, Jamie, Sawako

## data source
Tree data is from the City of Seattle's [Open Data Portal](https://data.seattle.gov)

* Species and addresses are from [SDOT Trees in the Public Right-of-Way](https://data.seattle.gov/Transportation/SDOT-Trees-in-the-Public-Right-of-Way/tiq5-syif)
* Latitudes and longitudes are from [Trees](https://data.seattle.gov/dataset/Trees/xg4t-j322)

## requests
Requests can be made to the server to read and modify tree data in the MongoDB.


### authorization
Access to authorized routes requires a token of a registered user. To become a registered user and get a token, make a POST request to /signup.
```
POST /signup {username:'tad', password:'plz'}
```
To get a token as a registered user, make a POST reqeust to /login
```
POST /login {username:'tad', password:'plz'}
```

A successful user sign up or log in will respond with JSON of the form below
```
{
  message: 'User Created' // a brief descript of the transaction
  token: 'xxxxxxxxxx' // the user token, include in authorization header of all authorized requests
  data: {createdUser} // the user that was created
}
```



## responses
Requests to the API return JSON with the following fields
```
{
  message: 'got species by id 555' // a brief description of the transaction
  data: '{genus:"cedrus", species:"deodara", commonName:"deodar cedar"}' // the requested data
  err: 'null'  // error if encountered
  token: 'xxxxxxxxxx' // user token if applicable
}
```


## resources

### species
```
species: {
 genus: String
 species: String
 commonName: String
}
```
auth | method | path | body | action
--- | --- | --- | --- | ---
 | GET | /api/species | | get all species
 | GET | /api/species/:species | | get species by id
* | POST | /api/species  | {newSpecies}  | create a species
* | PUT | /api/species/:species | {updatedSpecies} | update a species by id
* | DELETE | /api/species/:species | | remove a species by id

### trees
```
tree: {
 species: Species_id
 cityID: String
 commonName: String
 lat: Number
 lng: Number
 plotType: String
}
```
auth | method | path | body | action
--- | --- | --- | --- | ---
 | GET | /api/trees | | get all trees
 | GET | /api/trees/:tree | | get trees by id
 | GET | /api/trees/count | | get total count for all trees
 | GET | /api/trees/species/count | | get total count for each species
 | GET | /api/trees/species/:species/count | | get total count for species by id
* | POST | /api/trees  | {newTree}  | create a tree
* | PUT | /api/trees/:tree | {updatedTree} | update a tree by id
* | DELETE | /api/trees/:tree | | remove a tree by id


### photos
Photos are stored publicly on Trunks of Seattle's [Flickr account](https://www.flickr.com/photos/141429933@N06/). Photo CRUDs use [node flickrapi](https://www.npmjs.com/package/flickrapi).
```
photo:{
  flickrID: String
  tree: Tree_id
  user: User_id
}
```

auth | method | path | body | action
--- | --- | --- | --- | ---
 | GET | /api/photos | | get all photos
 | GET | /api/photos/:photo | | get photo by id
 | GET | /api/photos/trees/:tree | | get all photos of tree by id
 | GET | /api/photos/users/:user | | get all photos by user by id
 * | POST | /api/photos | {filepath, tree} | post photo of tree

### users
```
user:{
  username: String
  password: String
}
```

auth | method | path | body | action
--- | --- | --- | --- | ---
* | GET | /api/users | | get all users
* | GET | /api/users/:user | | get user by id
  | POST | /api/users  | {newUser}  | create a user
* | PUT | /api/users/:user | {updatedUser} | update a user by id
* | DELETE | /api/users/:user | | remove a user by id

## testing
To run mocha tests set timeout flag to 100000
```
mocha -t 100000
```
