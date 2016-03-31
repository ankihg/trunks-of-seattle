# trunks-of-seattle
A server that CRUDs Seattle street tree data stored in a MongoDB

Mid course project week (week 5)- Annika, Jamie, Sawako

## data source
Tree data is from the City of Seattle's [Open Data Portal](https://data.seattle.gov)

* Species and addresses are from [SDOT Trees in the Public Right-of-Way](https://data.seattle.gov/Transportation/SDOT-Trees-in-the-Public-Right-of-Way/tiq5-syif)

* Latitudes and longitudes are from [Trees](https://data.seattle.gov/dataset/Trees/xg4t-j322)

## testing
To run mocha tests set timeout flag to 100000
```
mocha -t 100000
```

## requests
Requests can be made to the server to access and modify 

### authorization




## responses
responses are of the form
```
{
  message: 'got species by id 555', // a brief description of the transaction
  data: '{genus:"cedrus", species:"deodara", commonName:"deodar cedar"}', // the requested data
  err: 'null',  // error if encountered
  token: 'xxxxxxxxxx' // user token if applicable
}
```


## routes
### species

### trees

### photos

### users
