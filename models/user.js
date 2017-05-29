var mongodb = require('./db');
var crypto = require('crypto');

function User(user){
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback){
	var md5 = crypto.createHash('md5'),
		email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
		head = 'http://www.gravatar.com/avatar/'+ email_MD5 + "?s=48";
	var user = {
		name : this.name,
		password : this.password,
		email: this.email,
		head: head
	};
	// open mongodb
	mongodb.open(function(err, db){
		if(err){
			// mongodb.close() 这里是我自己加行去的，感觉不加某种情况导致数据库异常
			mongodb.close(); 
			return callback(err);
		}
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.insert(user, {
				safe: true
			}, function(err, user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, user[0]);
			});
		});
	});
};


User.get = function(name, callback){
	// open mongodb
	mongodb.open(function(err, db){
		if(err){
			// mongodb.close() 这里是我自己加行去的，感觉不加某种情况导致数据库异常
			mongodb.close(); 
			return callback(err);
		}
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.findOne({
				name: name
			}, function(err, user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, user);
			});
		});

	});
};














