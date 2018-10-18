/*===================| """ INCLUDES """ |=================== */ 
var express = require("express");
var app     = express();
var bodyParser = require('body-parser');
var path    = require("path");
var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
const crypto_extra = require('crypto-extra');

/*===================| CONFIGS |=================== */ 
// var port = 8000; // Teste
var port = 1337; // Production
var url = "mongodb://localhost:27017/police_db";

/*===================| ROTAS DO FRONT |=================== */ 

app.use(express.static(path.join(__dirname+'/public')));
app.use(express.static(path.join(__dirname+'/views')));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/home',function(req,res){
    res.sendFile(path.join(__dirname+'/views/home.html'));
});

app.get('/register',function(req,res){
    res.sendFile(path.join(__dirname+'/views/register.html'));
});

app.get('/aproved', function(req, res){
    res.sendFile(path.join(__dirname+"/views/aproved.html"));
});

app.get('/notaproved', function(req, res){
    res.sendFile(path.join(__dirname+"/views/not_aproved.html"));
});

/*===================| WEB SERVICE |=================== */ 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');    
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Receive a JSON: { username: "", password=""}
app.post('/api/auth/', function (req, res) {
    var json_to_send = "";

    console.log(JSON.stringify(req.body));
	var __body = JSON.stringify(req.body);
    var parsed = JSON.parse(__body);

    var username = parsed["username"];
    var password = parsed["password"];

    var auth_validate = false;

    var query = { username: username, password: crypto_extra.createHash('sha256').update(password).digest("hex") };

	MongoClient.connect(url, { useNewUrlParser: true },function (err, db) {
        console.log("> Mongo connecting...");
		if (err) console.log( err );

		var dbo = db.db('police_db');
		
        console.log("> Query: "+query);

        try {
            dbo.collection("users").findOne(query, function(err, result){
                if (err) return console.log(err) ;
                console.log("> Executing Query...");

                if (result) {
                    console.log("> Results:"+JSON.stringify(result));
                    console.log("> Individualy: "+result["username"], result["password"], result["privileges"]);
                    auth_validate = true;
                    console.log(result["privileges"]);
                    privileges = result["privileges"];
                    json_to_send = JSON.stringify( { 
                        result: auth_validate,
                        privileges: result["privileges"]
                    });
                    console.log("> Json_to_send: "+json_to_send);
                }
    
                db.close();

                console.log("> Response to Client: "+json_to_send);
                res.send(json_to_send);
            });           
        } catch (error) {
            console.log(error);
        }    
	});
});

//Receive a JSON = { registration: "", occurence_type: "", occurence_local: "", occurence_date: "", approved: false}
app.post('/api/register/', function (req, res) {

	var registration = req.body.registration;
	var occurence_date = req.body.occurence_date;
	var occurence_type = req.body.occurence_type;
    var occurence_local = req.body.occurence_local;
    var approved = false;
    console.log("> Body: "+registration, occurence_date, occurence_type, occurence_local, approved);
	MongoClient.connect(url, { useNewUrlParser: true },function (err, db) {
        var result2send = false;
        if (err)
        {
            result2send = fasle;
            console.log(err);
        }

		var dbo = db.db('police_db');

		var myobj = { 
			registration: registration,
			occurence_type: occurence_type,
			occurence_local: occurence_local,
			occurence_date: occurence_date,
			approved: false 
		};
        try {
            dbo.collection("occurences").insertOne(myobj, function(err, result) {
                if (err)
                {
                    result2send = false;
                    console.log(err);   
                }
                else    result2send = true
                
                db.close();
                res.send(JSON.stringify({result: result}));
            });
        } catch (error) {
            console.log(error);
        }
		
	});

});

//Send a JSON with user  = { consult_type: "" }
app.post('/api/consult/', function (req, res) {

    var consult_type = req.body.consult_type;
    console.log("> Body: "+consult_type);
	var approved;
    var response = "";
	if ( consult_type == 'approved' )
		approved = true;
	else if(consult_type == 'notapproved')
		approved = false;
    else
    {
        response = JSON.stringify({ result: false, error: "Parametro invalido"});
    }
    
    MongoClient.connect(url, { useNewUrlParser: true },function (err, db) {

		if (err) throw err;

		var dbo = db.db('police_db');
		var query = { approved : approved };
		dbo.collection("occurences").find(query).toArray(function (err, result) {

            if(result)
            {
                console.log(JSON.stringify(result));
            }
            
            if(err) 
            {
                response = JSON.stringify({ result: false, error: err});
            }
            
			db.close();
			res.send(JSON.stringify(result));
		});
	});

});

//PUT a JSON = {"_id": "", consult_type: "", registration: "", occurence_type: "", occurence_local: "", occurence_date: "" }
app.put('/api/consult/changetype', function (req, res) {

    var id = new mongo.ObjectID(req.body.id);
    var approved = req.body.approved;
    
    console.log("> Body - id: ", id);
    console.log("> Body - approved: ", approved);

    approved = !Boolean(approved);
    console.log("> Toggle - approved: ", approved);

    MongoClient.connect(url, { useNewUrlParser: true },function (err, db) {

		if (err) res.send(JSON.stringify({result: false, error: err}));

            var dbo = db.db('police_db');
            
			var query = { _id: id };
			var newvalues = { $set: { approved: approved } };
			dbo.collection("occurences").updateOne(query, newvalues, function(err, result) {
				if (err) {
					db.close();
					res.send(JSON.stringify({result: false, error: err}));
				} else {
					db.close();
					console.log("> Element "+id+" updated!");
					res.send(JSON.stringify({result: true}));
				}   
			});
	});

});

/*===================| RUN SERVER |=================== */ 
app.listen(port);

console.log("Running at Port "+port);
