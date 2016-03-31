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
POST /signup {username:'tad', password:'plz'}
```

A successful user sign up or log in will respond with json of the form below
```
{
  message: 'User Created', // a brief descript of the transaction
  token: 'xxxxxxxxxx', // the user token, include in authorization header of all authorized requests
  data: {createdUser} // the user that was created
}
```



## responses
Requests to the API return JSON with the following fields
```
{
  message: 'got species by id 555', // a brief description of the transaction
  data: '{genus:"cedrus", species:"deodara", commonName:"deodar cedar"}', // the requested data
  err: 'null',  // error if encountered
  token: 'xxxxxxxxxx' // user token if applicable
}
```


## resources

### species
auth | method | path | body | action
--- | --- | --- | --- | ---
 | GET | /api/species | | get all species
 | GET | /api/species/:species | | get species by id
* | POST | /api/species  | {newSpecies}  | create a species
* | PUT | /api/species/:species | {updatedSpecies} | update a species by id
* | DELETE | /api/species/:species | | remove a species by id

### trees
auth | method | path | body | action
--- | --- | --- | --- | ---
 | GET | /api/trees | | get all trees
 | GET | /api/trees/:tree | | get trees by id
* | POST | /api/trees  | {newTree}  | create a tree
* | PUT | /api/trees/:tree | {updatedTree} | update a tree by id
* | DELETE | /api/trees/:tree | | remove a tree by id


### photos

### users

## testing
To run mocha tests set timeout flag to 100000
```
mocha -t 100000
```
