/**
 * Created by YuDong on 17-9-13.
 * Use https://github.com/NodeRedis/node_redis
 */
var redis = require('redis')
// port
var RDS_PORT = 6379
// host
var RDS_HOST = '127.0.0.1'
// Setting Options, such as password : auth_pass:RDS_PWD
var RDS_OPTS = {}

var keys = function (key, callback) {
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS)
    client.keys(key, function(param, success){
        client.quit()
        callback ? callback(success) : null
    })
}

var del = function (key, callback) {
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS)
    client.keys(key, function(param, success){
        client.quit()
        callback ? callback(success === 'OK' ? true : false) : null
    })
}

var set = function (key, value, callback) {
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS)
    client.set(key, value, function(param, success){
        client.quit()
        callback ? callback(success === 'OK' ? true : false) : null
    })
}

var get = function (key, callback) {
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS)
    client.get(key, function(param, success){
        client.quit()
        callback ? callback(success) : null
    })
}

var hmset = function (hkey, key, value, callback) {
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS)
    client.hmset(hkey, key, value, function(param, success) {
        client.quit()
        callback ? callback(success === 'OK' ? true : false) : null
    })
}

var hmget = function (hkey, key, callback) {
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS)
    client.hmget(hkey, key, function(param, success) {
        client.quit()
        callback ? callback(success) : null
    })
}

var obj = {}

obj.keys = keys

obj.set = set

obj.get = get

obj.hmset = hmset

obj.hmget = hmget

exports.ops =  obj
/*
 var redis = require('redis')
 RDS_PORT = 6379,        //端口号
 RDS_HOST = '127.0.1.1',    //服务器IP
 RDS_OPTS = {},            //设置项
 client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

 client.on('ready',function(res){
 console.log('ready');
 });

 client.on('connect',function(){
 client.set('author', 'Wilson', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 client.get('author', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 console.log('connect');
 });

 client.on('connect',function(){
 client.lpush('alist', 'Wilson', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 client.lrange('alist', 0, 5, function(a, b, c){console.log(a);console.log(b);console.log(c)});
 console.log('connect');
 });

 client.on('connect',function(){
 client.hmset('hashkey1', 'key1', 'key1->value1', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 client.hmset('hashkey1', 'key2', 'key1->value2', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 client.hmset('hashkey2', 'key1', 'key2->value1', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 client.hmset('hashkey2', 'key2', 'key2->value2', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 client.hmget('hashkey1', 'key2', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 client.hmget('hashkey2', 'key2', function(a, b, c){console.log(a);console.log(b);console.log(c)});
 console.log('connect');
 });
 */

