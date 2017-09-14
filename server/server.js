/**
 * Created by YuDong on 17-9-13.
 * Use https://github.com/NodeRedis/node_redis
 */
var redisConnector = require('./redisOps')

var redisOps = redisConnector.ops

console.log(redisOps)
console.log(redisOps.get)
redisOps.set('server-test', 'test', function(success) {
    if (success) {
        console.log('We success')
    }
})
redisOps.get('word', function(data){
    console.log(data)
})
redisOps.hmset('Hkey1', 'key1', 'value->Hkey1->key1->value', function(success){
    console.log(success)
})
redisOps.hmget('Hkey1', 'key1', function(data){
    console.log(typeof(data))
    console.log(data)
})