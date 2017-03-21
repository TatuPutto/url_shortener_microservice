const mongo = require('mongodb').MongoClient;

// fetch original url address from database
function getOriginalUrl(id) {
    return new Promise((resolve, reject) => {
        mongo.connect('mongodb://localhost:27017/test', (err, db) => {
            if(err) reject(err);
            const collection = db.collection('shortened_urls');

            collection.find({_id: id}, {original_url: 1, _id: 0})
                .toArray((err, results) => {
                    if(err) return reject(err);
                    if(results.length > 0) {
                        resolve(results[0].original_url);
                    } else {
                        reject();
                    }
                });
            db.close();
       });
   })
}

// insert new entity into database {id, original_url, short_url}
function insertNewShortenedUrl(urlId, originalUrl) {
    mongo.connect('mongodb://localhost:27017/test', (err, db) => {
        if(err) throw new Error(err);
        const collection = db.collection('shortened_urls');

        collection.insert({
            _id: urlId,
            original_url: originalUrl,
            short_url: 'localhost:8080/' + urlId
        }, (err) => {
            if(err) throw new Error(err)
        });
        db.close();
   });
}


module.exports.getOriginalUrl = getOriginalUrl;
module.exports.insertNewShortenedUrl = insertNewShortenedUrl;
