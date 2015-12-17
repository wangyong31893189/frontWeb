var Settings = require('./settings');
var mongodb=require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;
var db = new Db(Settings.DB, 
	new Server(Settings.HOST, Settings.PORT,
		 {auto_reconnect:true, native_parser: true}),
	{safe: false});

module.exports = db;

