/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var api = require('api-ai');
//var pg = require('pg');
//app.set('port', process.env.PORT || 3000);
//------------------------------------------------
//var SELECT_BY_PRODUCT_NAME_QUERY
var SELECT_ALL_DETAIL_QUERY = "Select a.name,a.price,a.description,\n\
a.imagelink,a.FoodType,b.name,a.id,a.product_type_id from ( select a.*,\n\
b.name as FoodType,b.product_type_id from tbl_product a INNER \n\
JOIN tbl_DetailProductType b ON a.Type_id=b.id ) a INNER JOIN \n\
tbl_ProductType b ON a.product_type_id=b.id";
        var SELECT_BY_PRICE_QUERY = "select b.name as Product,a.name,\n\
a.Type_Name as type,a.price from tbl_producttype b, ( select \n\
a.name,a.price,b.name as Type_Name,b.product_type_id from tbl_product \n\
a inner join tbl_detailproducttype b  ON a.type_id=b.id where a.price=$1 )\n\
 a where a.product_type_id=b.id ";
        var SELECT_RECEIPT_BY_ID_QUERY = "Select b.id as Receipt_ID,a.name,a.price,\n\
c.amount,b.date,b.time from tbl_Product a ,tbl_Receipt b,tbl_ReceiptProduct c\n\
 where c.ReceiptID=b.ID and c.productID=a.ID and c.ReceiptID=$1";
        var SELECT_PRODUCT_TYPE_QUERY = "Select * From tbl_ProductType";
        var SELECT_DETAIL_PRODUCT_TYPE_QUERY = "Select name From tbl_DetailProductType";
//-----------------------------------------------------------------------------
        var http = require('http');
        var url = require('url');
        var sQuerry = require('querystring');
        var express = require('express');
        var bodyParser = require('body-parser');
        var option = {
        disconnect: function (client, dc) {
        var cp = client.connectionParameters;
                console.log("Disconnecting from database ", cp.database);
        }
        };
        var pgPromise = require('pg-promise')(option);
        var app = express();
//-------------Connection Config For OnlineDB------------------------
        var conConfig = {
        host: 'ec2-54-221-212-48.compute-1.amazonaws.com',
                port: 5432,
                database: 'd2rqhf4m32ahvq',
                user: 'dxyktuemezuqst',
                password: '386c0dd6f8ecae8f0c07da179000368ad5797e91a929c978edbd7b308b6963a4',
                ssl: true,
                poolSize: 25
        };
        var db = pgPromise(conConfig);
//-------------Connection Config For Offline DB------------------------
//var conString = "postgres://postgres:tu3816329@localhost:5432" + "/CoffeeShop";
//var db = pgPromise(conString);
//------------------------------------------------------------------
        module.exports = db;
        module.exports = pgPromise;
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
//------------------SupportFunction-----------------------------------------
        function getCurrentDate() {
        var date = new Date();
                console.log("DATE:" + date.getMonth() + "/" + date.getDate() +
                        "/" + date.getFullYear());
                return date.getMonth() + "/" + date.getDate + "/" + date.getFullYear();
        }
function getCurrentTime() {
var date = new Date();
        var hour = date.getHours();
        var hours = (hour < 12 ? hour : (hour - 12));
        var minute = date.getMinutes();
        var minutes = (minute < 10 ? ("0" + minute) : minute);
        var seconds = date.getSeconds();
        console.log(hours + ":" + minute + ":" + seconds + (date.getHours() <= 12 ? " AM" : " PM"));
        return hours + ":" + minute + ":" + seconds + (date.getHours() <= 12 ? " AM" : " PM");
}
//------------------Handle Post Request--------------------------------------
app.post('/webhook', function (request, response) {
//    console.log(request.body);
var jsBody = request.body;
        response.writeHeader(200, {'Content-type': "Application/json"});
        var content = "";
        //----------------------Handle Show Menu Request-------------------------
        if (jsBody.result.action.toString().toUpperCase() === "show_menu".toString().toUpperCase()) {
if (jsBody.result.parameters.Type !== "") {
db.one(SELECT_PRODUCT_TYPE_QUERY + " where name LIKE ${name}", {name: jsBody.result.parameters.Type}).then(function (data) {
var id = data.id;
        if (id !== null) {
db.many(SELECT_DETAIL_PRODUCT_TYPE_QUERY + " where product_type_id=${id} ", {id: id}).then(function (row) {

console.log("row:" + row);
        var display = "";
        var speech = "We have \\n";
        for (var i = 0; i < row.length; i++) {
if (i == (row[i].length - 1)) {
speech += "And " + row.name + " \\n";
        } else {
speech += row[i].name + " \\n";
        }
}
speech += "What kind of " + jsBody.result.parameters.Type.toString().toLowerCase() + " want?";
        var text = speech;
//                        speech = "Here's your menu.";
        var content = {'speech': speech,
                'displayText': text,
                'data': row,
                'contextOut': [
                {'name': "menuWatched", 'lifespan': 1
                }
                ], 'source': "Thien Tu", 'followupEvent': {
        }
        };
        response.write(JSON.stringify(content));
        console.log("Send response: " + JSON.stringify(content));
        response.end();
        }).catch(function (error) {
if (error)throw error;
        }); } else {
}
});
        }
}
if (jsBody.result.action.toString().toUpperCase() === "finish".toString().toUpperCase()) {
db.many(SELECT_ALL_DETAIL_QUERY).then(function (row) {
for (var product in row) {
if (product.name.toString().include()) {

}
}
});
        }
if (jsBody.result.action.toString().toUpperCase() === "order".toString().toUpperCase()) {

}
});
//---------------------Handle get request --------------------------
        app.get('/', function (request, response) {

        console.log("Connecting to DB.........");
                /*
                 db.tx(function(t){
                 var queries = [t.none("Insert into tbl_Receipt(date,time) VALUES ('2/28/2017','3:50:10 PM')"),
                 t.none("Insert into tbl_Receipt(date,time) VALUES ('2/27/2017','12:50:10 AM');"),
                 t.none("Insert into tbl_ReceiptProduct VALUES(1,2,3)"),
                 t.none("Insert into tbl_ReceiptProduct VALUES(1,1,3)"),
                 t.none("Insert into tbl_ReceiptProduct VALUES(1,6,10);")
                 ];
                 return t.batch(queries);
                 }).then(function(data){console.log(data)}).catch(function(error){
                 console.log(error);
                 });
                 */
//                /*
                 db.many(SELECT_RECEIPT_BY_ID_QUERY, 1).then(function (rows){
                 response.writeHeader(200, {'Content-type': "text/html"});
                 response.write("<h1>Receipt No." + rows[0].receipt_id + "</h1>");
                 response.write("<h2>" + rows[0].time + "_" + rows[0].date + "</h1>");
                 response.write("<table>");
                 response.write("<tr>");
                 response.write("<th>Name</th>");
                 response.write("<th>Amount</th>");
                 response.write("<th>Price</th>");
                 response.write("</tr>");
                 var total = 0;
                 for (var row in rows){
                 response.write("<tr>");
                 response.write("<td>" + row.name + "</td>");
                 response.write("<td>" + row.amount + "</td>");
                 response.write("<td>" + row.price + "</td>");
                 response.write("</tr>");
                 total += row.amount * row.price;
                 }
                 response.write("<h2>Total" + total + "</h1>");
                 response.write("</table>");
                 }).catch(function (error){
                 console.log(error);
                 });
//                 */
                /*
                 db.many("SELECT table_schema,table_name FROM information_schema.tables ORDER BY table_schema,table_name").then(function (data){
                 for (var row in data){
                 console.log(row.table_name); }
                 }).catch(function (error){
                 console.log(error);
                 });
//                 */
                /*
                 //                 ---------------Create Table
                 var content = "";
                 db.tx(function (t) {
                 var queries = [
                 t.none('Drop Table IF EXISTS tbl_Receipt'),
                 t.none('Drop sequence IF EXISTs tbl_Receipt_id_seq'),
                 t.none('Create sequence tbl_Receipt_id_seq'),
                 t.none("create table tbl_Receipt(ID integer NOT NULL DEFAULT nextval('tbl_Receipt_id_seq'::regclass),date date NOT NULL,time time NOT NULL,PRIMARY KEY(ID))"),
                 t.none('ALTER TABLE public.tbl_Receipt OWNER TO dxyktuemezuqst; GRANT ALL ON TABLE public.tbl_Receipt TO public; GRANT ALL ON TABLE public.tbl_Receipt TO dxyktuemezuqst;'),
                 t.none("drop table IF EXISTs tbl_ReceiptProduct"),
                 t.none("create table tbl_ReceiptProduct(receiptID integer NOT NULL ,productID integer NOT NULL,amount integer not null)"),
                 ];
                 return t.batch(queries);
                 }).then(function(data){console.log(data)}).catch(function(error){
                 console.log(error);
                 });
                 */
//    db.many(SELECT_ALL_DETAIL_QUERY).then(function (row) {
//        var productType = [];
//        for (var i = 0; i < row.length; i++) {
//            productType.push({"name": row[i].name.toString()});
//        }
//        for (var j = 0; j < productType.length; j++) {
//            content += productType[j].name + '\n';
//        }
//        response.writeHeader(200, {'Content-type': "text/html"});
//        response.write("Result: \n" + content);
//        response.end();
//    }).catch(function (error) {
//        if (error)
//            throw error;
//    });
        });
//----------------------Post Server----------------------------------
        var server = app.listen(process.env.PORT || 8080, function () {
        console.log('listening on ' + server.address().port);
        });
//------------------PG code---------------------------------------------
        /*
         var client = pg.Client(conString);
         pg.defaults.ssl = true;
         pg.defaults.poolSize = 25;
         pg.connect(conString, function (error, client) {
         if (error)
         throw error;
         var query = client.query('Select * From tbl_Drinks;');
         query.on('row', function (row) {
         content += JSON.stringify(row).toLocaleString() + "/n";
         console.log(JSON.stringify(row));
         });
         query.on('end', function () {
         console.log("Client was disconnected.");
         client.end();
         });
         });
         app.get('/', function (request, response) {
         console.log("GET");
         response.writeHeader(200, {'Content-Type': 'Text/Html'});
         var content = "";
         var ul = url.parse(request.url, true).query;
         content += "<h1>Your name is " + ul.name + "</h1>";
         response.write(content);
         response.end();
         });
         var server = http.createServer(function (request, response) {
         if (request.method === "GET") {
         console.log("GET");
         response.writeHeader(200, {'Content-Type': 'Text/Html'});
         var content = "";
         var ul = url.parse(request.url, true).query;
         content += "<h1>Your name is " + ul.name + "</h1>";
         response.write(content);
         response.end();
         } else if (request.method === "POST") {
         response.writeHeader(200, {'Content-type': "Application/json"});      
         var content = {'speech': 'Please wait a moment for your order.', 'displayText': 'Please wait a moment for your order.We are making it!', 'data': {}, 'contextOut': [], 'source': "Thien Tu"};
         response.write(JSON.stringify(content));
         console.log("Send response: " + JSON.stringify(content));
         response.end();
         console.log("POST");
         }
         }).listen(process.env.PORT || 8080, function () {
         console.log('listening on ' + server.address().port);
         });
         
         */

