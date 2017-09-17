/**
 * Created by YuDong on 17-9-13.
 */
var express = require('express')
var  bodyParser = require("body-parser")
var mineOpr = require('./mineOps')
var app = express()

// 请求体处理  
app.use(bodyParser.json({  extended:  false  }));
var mine = mineOpr.mine

app.post('/add', function(req, res) {
    var data = {}
    var reqBody = req.body
    var name = reqBody.name
    var level = reqBody.level
    var score = reqBody.score

    if (!name || !level || !score) {
        data.status = 403
        data.msg = 'Add Fail'
        res.end(JSON.stringify(data))
    } else {
        mine.addRankList(level, name, score, function (success) {
            console.log(success)
            if (success) {
                data.status = 200
                data.msg = 'Add Success'
                res.end(JSON.stringify(data))
            } else {
                data.status = 403
                data.msg = 'Add Fail'
                res.end(JSON.stringify(data))
            }
        })
    }
})

app.get('/list', function(req, res) {
    var data = {}
    var level = req.query.level
    mine.getRankList(level, function (success) {
        console.log('SUCCESS LIST ： ')
        console.log(success)
        if (success) {
            data.status = 200
            data.data = success
            data.msg = 'List Success'
            res.end(JSON.stringify(data))
        } else {
            data.status = 403
            data.msg = 'List Fail'
            res.end(JSON.stringify(data))
        }
    })
})

var server = app.listen(8080, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})