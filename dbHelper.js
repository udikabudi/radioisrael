var mongoose = require('mongoose');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloMongoose';

var connectToDb = mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

/**
 *  define the schemas and modules of db
 * ******************************************
 * ******************************************
 * ******************************************
 **/
 
 //songs schema
 
 var songsSchema = mongoose.Schema ({
   // userId: {type: Number, required: true }, //check if unique
    link: {type:String, require:true},
    name: {type: String, required: true},
    genre: {type: String, required: true},
    imgUrl: {type: String, requird: true},
    artist: {type: mongoose.Schema.Types.ObjectId, ref:'artists'},
    //more info TODO
    //like
    like: {type: Number},
    //unlike
    unlike: {type: Number}
});

var songs  = mongoose.model('songs', songsSchema);

var artistsSchema = mongoose.Schema({
    name: {type:String, required: true},
    imageUrl: {type:String, required:true},
     //like
    like: {type: Number},
    //unlike
    unlike: {type: Number},
    songs: [{type: mongoose.Schema.Types.ObjectId, ref:'songs'}]
});

var artists = mongoose.model('artists', artistsSchema);

//station schema
var stationSchema = mongoose.Schema({
    name: {type:String, required: true},
    imageUrl: {type:String, required:true},
     //like
    like: {type: Number},
    //unlike
    unlike: {type: Number},
    artist: {type: mongoose.Schema.Types.ObjectId, ref:'artists'},
    songs: [{type: mongoose.Schema.Types.ObjectId, ref:'songs'}]
});

var stations = mongoose.model('stations', stationSchema);

exports.getSongsByGenre = function (_genre, callback){
    songs.find({'genre':_genre}, function (err, songs){
       if (err){
          callback(err, -1) ;
       }
       else{
           callback(err, songs);
       }
    });
};
    
exports.getSongsOfArtist = function(artist, callback){
    var query = artists.findOne({'name' : artist} ).populate('songs');
    query.exec(function(err, artist){
    if (err){
        callback(err, -1);
    }
    else{
        callback(err, artist.songs);
    }
});
    
};

var songsNotSavedFlag;

exports.saveListOfSongs = function(songs, callback)
{
    console.log("save songs list db");
     songsNotSavedFlag = 0;
     for (var i = 0; i < songs.length; ++i) {
         console.log("dbHelper", "array object " + songs[i].name);
         //find the artist
        saveNewSong(songs[i].link, songs[i].name, songs[i].genre, songs[i].artist, songs[i].imgUrl, songs[i].like, callbackToAddSongArray);
    }
    
    if (songsNotSavedFlag !== 0)
    {
        callback(songsNotSavedFlag, true); //error accurd
    }
    else 
    {
        callback(songsNotSavedFlag, false);
    }
     
};

var callbackToAddSongArray = function  (err, song){
            if (err)
            {
                console.log("totoDbHelper", "question couldn't save to db " + err + song);
                songsNotSavedFlag++;
            }
};
 

var saveNewSong = function(link, name, genre, artist, imgUrl,likes, callback)
{
    console.log("save new song db");
    //find the artist id
    artists.findOne({'name': artist}).exec(function(err, artist){
       if (err)
       {
           console.log("artist not found saveNewSong");
           callback(err, -1);
            
       }
       else
       {
           console.log("artist found saveNewSong");
           //save the song
           //user = new users({userName:name, userEmail:email, userPass:pass, tournaments:tournamentsIds, isVerify:false } );
           var song = new songs({link: link, name: name, genre: genre, artist: artist._id, imgUrl: imgUrl, like: likes});
           song.save(function (err, song){
               if (err){
                   console.log("song couldnt saved saveNewSong");
                   callback(err, -1);
               }
               else
               {
                    console.log("song saved ,saveNewSong db");
                    //update the artist's song list
                    artists.update({name: artist}, {$addToSet:{songs: song._id}}, {upsert:true},function(err, artist){
                        if (err){
                            callback(err, -1);
                        }
                        else{
                            callback(err, song);
                        }
                    });
               }
           });
       }
    });
};

module.exports.saveNewSong = saveNewSong;
module.exports.connectToDb = connectToDb;

var artistNotSavedFlag;

exports.saveListOfArtists = function (artists, callback)
{
     artistNotSavedFlag = 0;
     for (var i = 0; i < artists.length; ++i) {
         console.log("dbHelper", "array object " + artists[i].name);
        saveNewArtist(artists[i].name, artists[i].imgUrl, artists[i].like, callbackToAddArtistArray);
    }
    
    if (artistNotSavedFlag !== 0)
    {
        callback(artistNotSavedFlag, true); //error accurd
    }
    else 
    {
        callback(artistNotSavedFlag, false);
    }
     
     
};

var callbackToAddArtistArray = function  (err, question){
            if (err)
            {
                //console.log("totoDbHelper", "question couldn't save to db " + err + question);
                artistNotSavedFlag++;
            }
};
 

var saveNewArtist = function(_name, _imgUrl, likeNum, callback)
{
    var artist = new artists({name: _name, imageUrl: _imgUrl, like: likeNum});
    artist.save(function(err, artist){
        if (err){
            callback(err,-1);
        }
        else {
            callback(err,artist);
        }
    });
};

exports.getTopSongs = function (callback)
{
    songs.find().sort({like: -1}).limit(4).exec( 
    function(err, songs) {
        if (err)
        {
             console.log("dbHelper, getTopSongs - error getting top songs");
             callback(err, -1);
        }
        else {
            console.log("dbHelper, getTopSongs, top songs are - " + songs);     
            callback(err, songs);
        }
       
    }
);
};

exports.getTopArtists = function (callback)
{
    artists.find().sort({like: -1}).limit(4).exec (
        function(err,artists){
           if (err){
               console.log("dbHelper, getTopArtists - error getting top artists");
               callback(err, -1);
           } 
           else {
               console.log("dbHelper, getTopArtists, top artists are - " + artists);     
               callback(err, artists);
           }
        });
};
 
exports.likeSong = function (songName, callback)
{
    
//     var query = { name: 'borne' };
// Model.findOneAndUpdate(query, { name: 'jason borne' }, options, callback)

  songs.findOne({'name': songName}).exec(function(err, song){
      if (err){
          callback(err,-1);
      }
      else {
          var likes = song.like;
          likes++;
          //    artists.update({name: artist}, {$addToSet:{songs: song._id}}, {upsert:true},function(err, artist){
          songs.update({name:songName},{like:likes},function(err, numberAffected, raw){
              if (err){
                  console.log("dbHelper, likeSong, Error updating song " + err);
                  callback(err, -1);
              }
              else {
                  console.log("dbHelper, likeSong, succeeded updating song");
                  callback(err,numberAffected);
              }
          });
      }
      });
};


exports.likeArtist = function (artistName, callback)
{
    
//     var query = { name: 'borne' };
// Model.findOneAndUpdate(query, { name: 'jason borne' }, options, callback)

  artists.findOne({'name': artistName}).exec(function(err, artist){
      if (err){
          callback(err,-1);
      }
      else {
          var likes = artist.like;
          likes++;
          //    artists.update({name: artist}, {$addToSet:{songs: song._id}}, {upsert:true},function(err, artist){
          artists.update({name:artistName},{like:likes},function(err, numberAffected, raw){
              if (err){
                  console.log("dbHelper, likeSong, Error updating song " + err);
                  callback(err, -1);
              }
              else {
                  console.log("dbHelper, likeSong, succeeded updating song");
                  callback(err,numberAffected);
              }
          });
      }
      });
};

exports.searchArtist = function(searchQuery, callback){
    artists.find({'name' : new RegExp(searchQuery)},name, function(err, artistsNames){
    if (err){
        console.log("dbHelper, searchArtist, error has accurd while searching artists - " + err);
        callback(err, -1);
    }
    else {
        console.log("deHelperm serachArtists, search succeeded. Artists are - " + artistsNames);
        callback(err,artistsNames);
    }
});
};

 
 
 
 
 