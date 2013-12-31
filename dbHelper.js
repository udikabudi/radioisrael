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
    //user tournaments
    artist: {type: mongoose.Schema.Types.ObjectId, ref:'artists'},
});

var songs  = mongoose.model('songs', songsSchema);

var artistsSchema = mongoose.Schema({
    name: {type:String, required: true},
    imageUrl: {type:String, required:true},
    songs: [{type: mongoose.Schema.Types.ObjectId, ref:'songs'}]
});

var artists = mongoose.model('artists', artistsSchema);


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
     songsNotSavedFlag = 0;
     for (var i = 0; i < songs.length; ++i) {
         console.log("dbHelper", "array object " + artists[i].name);
         //find the artist
        saveNewSong(songs[i].link, songs[i].name, songs[i].genre, songs[i].artist, songs[i].imgUrl, callbackToAddSongArray);
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

var callbackToAddSongArray = function  (question, err){
            if (err)
            {
                console.log("totoDbHelper", "question couldn't save to db " + err + question);
                songsNotSavedFlag++;
            }
};
 

var saveNewSong = function(link, name, genre, artist, imgUrl, callback)
{
    //find the artist id
    artists.findOne({'name': artist}).exec(function(err, artist){
       if (err)
       {
           callback(err, -1);
       }
       else
       {
           //save the song
           //user = new users({userName:name, userEmail:email, userPass:pass, tournaments:tournamentsIds, isVerify:false } );
           var song = new songs({link: link, name: name, genre: genre, artist: artist._id, imgUrl: imgUrl});
           song.save(function (err, song){
               if (err){
                   callback(err, -1);
               }
               else
               {
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
        saveNewArtist(artists[i].name, artists[i].imgUrl, callbackToAddArtistArray);
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

var callbackToAddArtistArray = function  (question, err){
            if (err)
            {
                console.log("totoDbHelper", "question couldn't save to db " + err + question);
                artistNotSavedFlag++;
            }
};
 

var saveNewArtist = function(_name, _imgUrl, callback)
{
    var artist = new artists({name: _name, imageUrl: _imgUrl});
    artist.save(function(err, artist){
        if (err){
            callback(err,-1);
        }
        else {
            callback(err,artist);
        }
    });
};
 
 
 
 
 
 