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

exports.saveNewSong = function(name, genre, artist, imgUrl, callback)
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
           var song = new songs({name: name, genre: genre, artist: artist._id, imgUrl: imgUrl});
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

exports.saveNewArtist = function(_name, _imgUrl, callback)
{
    var artist = new artists({name: _name, imgUrl: _imgUrl});
    artist.save(function(err, artist){
        if (err){
            callback(err,-1);
        }
        else {
            callback(err,artist);
        }
    });
};
 
 
 
 
 
 