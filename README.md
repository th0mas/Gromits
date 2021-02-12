<div align="center">

# Ocean Gromits
Interactive video link between two Gromit sculptures.

`Team 40`

[![spe-uob](https://circleci.com/gh/spe-uob/GromitsRepo.svg?style=svg&circle-token=451ca0fc0197e06f78ba03eca6e11c1f39ba0e45)](https://circleci.com/gh/spe-uob/GromitsRepo.svg)

</div>

----

## Background

As part of the ‘Gromit Unleashed 2’ sculpture trail, the University created
four interactive sculptures. Two of these - ‘Oceans 1: Deep Blue’ and 
‘Oceans 2: Yellow Sub’ - used a video link, which allowed visitors to We the
Curious and MShed to view each other across the harbour. The University 
reacquired these sculptures at the close of the trail, and wishes to place 
one in MVB, and the other at the new Temple Quarter precinct. 

The sculptures should show the feed from the others camera. 
This should be done in the most robust, and lowest maintenance way possible. 

----

## Firmware

Our firmware is a local web server based on the Java Spring framework.
This will host a JavaScript application that will display the video feed from
other Gromits and broadcast a video feed from the Gromits own webcam.

### Dependencies

* JDK 11+
* Node 14.x (Only required for frontend development)
* Yarn (Only for frontend)

#### Getting started

Clone the repository
```
git clone https://github.com/spe-uob/GromitsRepo
```

Pull dependencies and build
**(This will take a long time, but should only have to be done once)**
```
./gradlew build (macOS/Linux/Anything really)
gradlew.bat build (Windows)
```

To build the frontend (If you're doing frontend development)
```
cd frontend
yarn install
```

Make sure IntelliJ is set to use JDK 11 otherwise you'll get some nasty errors. Building outside of IntelliJ for the first time is usually quicker.

Production builds can then be ran by running
```
java -jar build/libs/<exe name>.jar
```

##### Development

To run in development mode with hot reloading and everything nice:

```
./gradlew bootRun # Run the spring server

# In a seperate terminal:
cd frontend && yarn start # Run the frontend development
```

The frontend can then be accessed under `localhost:3000`

--- 

### Building for production

When building for production, several variables need to be set to allow the Gromits to securely access
each other. 

```shell
export REACT_APP_SIGNAL_URL=10.10.10.10 // Remote gromit ip
export REACT_APP_USERNAME="gromit" // Username for signalling server
export REACT_APP_PASSWORD="hunter2" // Password for the signalling server
./gradlew build // Build and compile the firmware into a single .jar file
```