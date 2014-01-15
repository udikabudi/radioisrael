var ADD_NEW_ARTIST = "addArtist";
var ADD_NEW_SONG = "addSong";
var GET_SONG_LIST_B_GENRE = "getSongList";
var GET_ARTIST_SONGS = "getArtistsSongs";
var ADD_ARTIST_LIST = "saveAList";
var ADD_SONG_LIST = "saveSongList";
var GET_ARTISTS_WELCOME_PAGE = "getTopArtists";
var GET_SONGS_WELCOME_PAGE = "getTopSongs";
var LIKE_SONG = "likeSong";
var LIKE_ARTIST = "likeArtist";
var SEARCH_ARTISTS = "searchArtists";


var dbHelper = require("./dbHelper");
var parse = function (method, data, callback)
{
    if (method == "get")
    {
         console.log("data is " + data);
           //convert string to json
          //var dataJson = JSON.parse(data);
          var requestHeader = data.header;
          console.log("header is " + requestHeader);
          var jsonResponseData = {};
          switch (requestHeader)
          {
              case GET_SONG_LIST_B_GENRE:
                  jsonResponseData.header = "getSongList";
                     dbHelper.getSongsByGenre(data.genre, function(err, songs){
                         if (err){
                             jsonResponseData.ok = "0";
                         }
                         else
                         {
                              jsonResponseData.ok = "1";
                              jsonResponseData.songs = songs;
                         }
                         callback(jsonResponseData);
                       
                     }) ;
                       break;
                       
              case GET_ARTIST_SONGS:
                   jsonResponseData.header = GET_ARTIST_SONGS;
                   dbHelper.getSongsOfArtist(data.artist, function(err, songs){
                       if (err){
                           jsonResponseData.ok = "0";
                       }
                       else {
                           jsonResponseData.ok = "1";
                           jsonResponseData.songs = songs;
                       }
                        callback(jsonResponseData);
                   });
                   break;
                   
            
                           
              default:
                jsonResponseData.ok = "0";
                callback(jsonResponseData);
                break;
                       
                  
          }
    }
    else { //POST
        console.log("data is " + data);
           //convert string to json
          //var dataJson = JSON.parse(data);
          var requestHeaderPost = data.header;
          console.log("header is " + requestHeaderPost);
          var jsonResponseDataPost = {};
          switch (requestHeaderPost){
              case ADD_NEW_SONG:
                  jsonResponseDataPost.header = ADD_NEW_SONG;
                  dbHelper.saveNewSong(data.name, data.genre, data.artist, data.imgUrl, data.likeNum, function(err, song){
                      if (err){
                          jsonResponseDataPost.ok = "0";
                      }
                      else {
                          jsonResponseDataPost.ok = "1";
                          jsonResponseDataPost.song = song;
                      }
                      callback(jsonResponseDataPost);
                  });
                  break;
              case ADD_NEW_ARTIST:
                   jsonResponseDataPost.header = ADD_NEW_ARTIST;
                   dbHelper.saveNewArtist(data.name, data.imgUrl,data.likeNum, function(err, artist){
                       if (err){
                           jsonResponseDataPost.ok = "0";
                       }
                       else {
                           jsonResponseDataPost.ok = "1";
                           jsonResponseDataPost.artist = artist;
                       }
                       callback(jsonResponseDataPost);
                   });
                   break;
                   
              case ADD_ARTIST_LIST:
                  jsonResponseDataPost.header = ADD_ARTIST_LIST;
                  var ArtistArray =  JSON.parse(data.artists);
                  dbHelper.saveListOfArtists(ArtistArray, function(numOfArtistsNotSaved, err){
                      if (err){
                            jsonResponseDataPost.ok = "0";
                            jsonResponseDataPost.artistsNotSaved = numOfArtistsNotSaved;
                            callback(jsonResponseDataPost);
                      }
                      else {
                           jsonResponseDataPost.ok = "1";
                           callback(jsonResponseDataPost);
                      }
                  });
                   break;
                   
             case ADD_SONG_LIST:
                 console.log("add song list parser");
                  jsonResponseDataPost.header = ADD_SONG_LIST;
                  var songArray =  JSON.parse(data.songs);
                  dbHelper.saveListOfSongs(songArray, function(numOfSongsNotSaved, err){
                      if (err){
                            jsonResponseDataPost.ok = "0";
                            jsonResponseDataPost.songsNotSaved = numOfSongsNotSaved;
                            callback(jsonResponseDataPost);
                      }
                      else {
                           jsonResponseDataPost.ok = "1";
                           callback(jsonResponseDataPost);
                      }
                  });
                  break;
                  
                    case GET_ARTISTS_WELCOME_PAGE:
                  jsonResponseDataPost.header = "getTopArtists";
                   console.log("parser, getTopArtists");   
                 dbHelper.getTopArtists(function(err, artists){
                    if (err) 
                    {
                        jsonResponseDataPost.ok = "0";
                    }
                    else 
                    {
                        jsonResponseDataPost.ok = "1";
                        jsonResponseDataPost.artists = artists;
                    }
                     callback(jsonResponseDataPost);
                 });
                   break;
              
              case GET_SONGS_WELCOME_PAGE:
                 jsonResponseDataPost.header = "getTopSongs";
                 dbHelper.getTopSongs(function(err, songs){
                    if (err) 
                    {
                        jsonResponseDataPost.ok = "0";
                    }
                    else 
                    {
                        jsonResponseDataPost.ok = "1";
                        jsonResponseDataPost.songs = songs;
                    }
                     callback(jsonResponseDataPost);
                 });
                 break;
                 
                 case LIKE_SONG:
                       jsonResponseDataPost.header = LIKE_SONG;
                       dbHelper.likeSong(data.name, function(err, rawsNum){
                          if (err) {
                              jsonResponseDataPost.ok="0";
                          }
                          else {
                              jsonResponseDataPost.ok="1";
                          }
                          callback(jsonResponseDataPost);
                       });
                     break;
                     
               case LIKE_ARTIST:
                       jsonResponseDataPost.header = LIKE_ARTIST;
                       dbHelper.likeArtist(data.name, function(err, rawsNum){
                          if (err) {
                              jsonResponseDataPost.ok="0";
                          }
                          else {
                              jsonResponseDataPost.ok="1";
                          }
                          callback(jsonResponseDataPost);
                       });
                     break;
                     
                     case GET_SONG_LIST_B_GENRE:
                  jsonResponseDataPost.header = "getSongList";
                     dbHelper.getSongsByGenre(data.genre, function(err, songs){
                         if (err){
                             jsonResponseDataPost.ok = "0";
                         }
                         else
                         {
                              jsonResponseDataPost.ok = "1";
                              jsonResponseDataPost.songs = songs;
                         }
                         callback(jsonResponseDataPost);
                       
                     }) ;
                       break;
                       
              case GET_ARTIST_SONGS:
                   jsonResponseDataPost.header = GET_ARTIST_SONGS;
                   dbHelper.getSongsOfArtist(data.artist, function(err, songs){
                       if (err){
                           jsonResponseDataPost.ok = "0";
                       }
                       else {
                           jsonResponseDataPost.ok = "1";
                           jsonResponseDataPost.songs = songs;
                       }
                        callback(jsonResponseDataPost);
                   });
                   break;
                   case SEARCH_ARTISTS:
                       jsonResponseDataPost.header = SEARCH_ARTISTS;
                       dbHelper.searchArtist(data.searchQuery, function (err, artistsNames){
                          if (err || artistsNames == -1) {
                              jsonResponseDataPost.ok="0";
                              jsonResponseDataPost.names="-1";
                          }
                          else{
                               jsonResponseDataPost.ok = "1";
                              jsonResponseDataPost.names = artistsNames ;
                          }
                            callback(jsonResponseDataPost);
                       });
                       break;
            default:
                jsonResponseDataPost.ok = "0";
                callback(jsonResponseDataPost);
                break;
          }
        
    }
    
};

module.exports.parse = parse;
   
  