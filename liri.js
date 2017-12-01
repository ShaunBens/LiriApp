//set variables requiring npm packages etc

var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require('inquirer');
var fs = require('fs');

//set variables for inquirer prompt functions

var twitterPrompt = inquirer.createPromptModule();
var spotifyPrompt = inquirer.createPromptModule();
var moviePrompt = inquirer.createPromptModule();

//Reach in keys.js file to grab needed keys for spotify and twitter(I tried but it kept throwing an error saying it couldnt grab it?)
// var twitter = new Twitter({
//     keyId: keys.twitterKeys.consumer_key,
//     secretID: keys.twitterKeys.consumer_secret,
//     tokenKey: keys.twitterKeys.access_token_key,
//     tokenSecret: keys.twitterKeys.access_token_secret
// });

// var spotify = new Spotify({
//     id: keys.spotifyKeys.consumer_key,
//     secret: keys.spotifyKeys.consumer_secret
// });

var twitter = new Twitter({
    consumer_key: 'BIXq1kEcyjykwe2faHASN48ei',
    consumer_secret: 'pMZq3JXPLFlGcrtQzCUiybPBoeoNQjMRSQ9OBXPzyBTI33wRIK',
    access_token_key: '935268806246719489-q56KOrVDCIcSXg5d5R8WfEQmtilzngI',
    access_token_secret: 'v7kp2BbNwOxzK5B4h7CVbrfbO9MVwiVzi3t7lX9szVERT',
});

var spotify = new Spotify({
    id: 'b0f3c2ed1c294e84b3ee797a31cb31f1',
    secret: '839ee69bff184eae9d444b0ddfc47377',
});


//Use inquirer for selection of commands

inquirer.prompt([{
        type: "list",
        message: "What command would you like to run?",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "commands"
    }

]).then(function(user) {
    console.log(JSON.stringify(user, null, 2));

    //==========================================Twitter===============================================



    if (user.commands === "my-tweets") {


        //prompt user to confirm if they reallllly want to read my awesome Tweets

        twitterPrompt([{
                type: "confirm",
                message: "Are you sure you want to view my past posts?",
                name: "confirm",
                default: true
            }

        ]).then(function(user) {

            //If user confirms yes and there is no error, my last 20 Tweets will be listed

            if (user.confirm === true) {
                //console.log("test");

                var params = {
                    screen_name: "TestManJumper",
                    count: 20
                };

                //console.log(params.screen_name);

                twitter.get("statuses/user_timeline", params, function(error, response) {
                    if (!error) {
                        for (var i = 0; i < response.length; i++) {
                            var time = response[i].created_at;
                            var tweets = response[i].text;
                            var user = params.screen_name;
                            console.log("============================================");
                            console.log("----------------" + time + "--------------------------" +
                                "\n@" + user + " tweeted: " +
                                "\n" +
                                tweets);
                        }
                        //console.log(tweets);
                    }
                    else {
                        console.log(error);
                    }
                });

                //if user decides to not view my Tweets, console log response

            }
            else {
                console.log("============================================");
                console.log("Probably a wise choice! Try looking up a movie or song!");
            }
        });

        //=======================================Spotify===============================================

        //I cant get my spotify to grab my search with inquirer. Everything looks to be set up correctly :(

    }
    else if (user.commands === "spotify-this-song") {


        //prompt user to type in song to lookup - 'The Sign' by Ace of Base set as default
        spotifyPrompt([{
                type: "input",
                message: "What song should I look up?",
                name: "song",
                default: "The Sign Ace of Base"
            }

            //set up Spotify search for Track based on "song" input by user


        ]).then(function(name) {

            spotify.search({
                type: 'track',
                query: name.song,
                limit: 1
            }, function(err, data) {
                if (err) {
                    console.log('Error occurred: ' + err);
                    return;

                    //set up base path for finding information through Spotify API

                }
                else {
                    var trackName = data.tracks.items;

                    //for loop through results to pick out desired information

                    for (var i = 0; i < 1; i++) {

                        var trackData = trackName[i];

                        var artists = trackData.artists[0].name;
                        var song = trackData.name;
                        var preview = trackData.preview_url;
                        var album = trackData.album.name;

                        //console log out the information found on the track provided by user

                        console.log("============================================");
                        console.log("Artist: " + artists + "\nSong Title: " + song + "\nAlbum: " +
                            album + "\nSong Preview: " + preview);
                    }
                }
            });
        });


        //===========================================OMDB================================================

    }
    else if (user.commands === "movie-this") {

        moviePrompt([{
                type: "input",
                message: "What movie should I look up?",
                name: "movie",
                default: "Mr. Nobody"
            }

        ]).then(function(response) {

            //run a request to the OMDB API with the movie specified by user

            request("http://www.omdbapi.com/?apikey=40e9cece&t=" + response.movie + "&y=&plot=short&r=json", function(error, response, body) {

                // If there is no error, and the request is successful (i.e. if the response status code is 200)

                if (!error && response.statusCode === 200) {
                    var movieName = JSON.parse(body);

                    // Parse the body of the site and recover the info needed

                    console.log("======================================" + "\n");
                    console.log("Title: " + movieName.Title + "\nRelease Date: " + movieName.Year +
                        "\nIMDB Rating is: " + movieName.imdbRating + "\nRotten Tomatoes Rating: " + movieName.Ratings + //*Cant Get Rotten Tomatoes for some reason*//
                        "\nProduced in (country): " + movieName.Country +
                        "\nMain Language: " + movieName.Language + "\nPlot: " + movieName.Plot +
                        "\nActor's include: " + movieName.Actors + "\n");
                    console.log("======================================");
                }
            });
        });

        //===============================================FS============================================

    }
    else if (user.commands === "do-what-it-says") {
        // This block of code will read from the "random.txt" file.
        // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
        // The code will store the contents of the reading inside the variable "data"
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                console.log(error);
            }
            else {
                //  var dataArr = data.split(",");

                //  console.log(dataArr);

                spotify.search({
                    type: 'track',
                    query: data,
                    limit: 1
                }, function(err, data) {
                    if (err) {
                        console.log('Error occurred: ' + err);
                        return;

                        //set up base path for finding information through Spotify API

                    }
                    else {
                        var trackName = data.tracks.items;

                        //for loop through results to pick out desired information

                        for (var i = 0; i < 1; i++) {

                            var trackData = trackName[i];

                            var artists = trackData.artists[0].name;
                            var song = trackData.name;
                            var preview = trackData.preview_url;
                            var album = trackData.album.name;

                            //console log out the information found on the track provided by user

                            console.log("============================================");
                            console.log("Artist: " + artists + "\nSong Title: " + song + "\nAlbum: " +
                                album + "\nSong Preview: " + preview);
                        }
                    }
                });
            }
        });
    }
});
