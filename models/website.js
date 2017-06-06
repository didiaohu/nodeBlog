var mongodb = require('./db');

function Website(name, description, website){
	this.name = name;
	this.description = description;
	this.website = website;
}

module.exports = Website;

Website.prototype.save = function(callback){
	var website = {
		name: this.name,
		description: this.description,
		website: this.website
	};

	mongodb.open(function(err, db){
		if(err){
			// mongodb.close() 这里是我自己加行去的，感觉不加某种情况导致数据库异常
			mongodb.close(); 
			return callback(err);
		}
		db.collection('website', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.insert(website,{
				safe: true
			}, function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}


Website.getAll = function(name, callback){
	mongodb.open(function(err, db){
		if(err){
			// mongodb.close() 这里是我自己加行去的，感觉不加某种情况导致数据库异常
			mongodb.close(); 
			return callback(err);
		}

		db.collection('website', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			
			var query = {};
			if(name){
				query.name = name;
			}

			collection.find(query).sort({
				time: -1
			}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);
			});
		});
	});
};