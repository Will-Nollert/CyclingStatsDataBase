
# World Tour Cycling API 

The main focus of this project is a Node.js and Express-based API that queries  a database of cycle races, scraped from procyclingstats.com. It allows users to retrieve information about individual races, as well as information about specific riders and their race history. The API is intended for cycling enthusiasts and those interested in historical race data. While the current dataset only includes the Classics from 1950 to 2023, I have plans for future development to add Grand Tours as well as individual rider statistics to the dataset.

Playground URL: https://cycling-databse.herokuapp.com/

## Example Routes 
 Ammend this URL with one of the endpoint below to demo the API
<br>
 base url: https://cycling-databse.herokuapp.com/api
<br>
 example request:  https://cycling-databse.herokuapp.com/api/bicycle-racers/wout-van-aert/info
<br>

| HTTP Method | URL                                                                         | description                                                            |
| ----------- |:---------------------------------------------------------------------------:| ----------------------------------------------------------------------:|
| Get         | /races/{raceName}/{startYear]/{endYear}                                     | Get EVERY race with a specified name, within a time frame              |
| Get         | /races/{raceName}{year}                                                     | Get ONE race by name and year                                          |
| Get         | /races/{Race_ID}/finishers                                                  | Get ALL finishers for a specific race by Race_ID                       |
| Get         | /races/{raceName}/from/{startYear}/to/{endYear}/ranked-by/startlist-quality | Rank all races by start-list quality score from start year to end year |
| Get         | /bicycle-racers/{riderName}/info                                            | get all info for ONE rider by name                                     |
| Get         | bicycle-racers/{riderName}/rankedHistory                                    | Rank ONE riders history by position                                    |

## Demo 

![Screenshot 2023-04-24 204927](https://user-images.githubusercontent.com/90637390/234154958-5a1d0d19-ab41-416c-923b-9705eec7350d.jpg)

<hr>

![Screenshot 2023-04-24 205029](https://user-images.githubusercontent.com/90637390/234155014-64da618c-3325-44b3-be92-fb227ac0beb9.jpg)



## Tech Stack
Javascript, Express, NodeJS, Mongoose, MongoDB Atlas
## Future development 
Short term: Add all routes to API playground. 


longer term: Add information to racer model and more stage races




