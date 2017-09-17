/**
 * Created by YuDong on 17-9-17.
 */
var redisConnector = require('./redisOps')

var redisOps = redisConnector.ops

// Score_[level]_[name]_[timestamp]
var SCORE_KEY = 'Score_'
// Rank_[level]_[name]_[timestamp]
var RANK_KEY = 'Rank_'
// 能够上榜的最低分数
var RANK_TAIL = 'Rank_tail_'

/*
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
    console.log(typeof(data))mineOpr
    console.log(data)
})
    */

// 自定义的 timestamp fullyear + (month + 1) + date + hours + minutes + seconds + milliseconds
var getTimeStamp = function () {
    var result = ''
    var date = new Date()
    result += date.getFullYear()
    result += date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    result += date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
    result += date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
    result += date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
    result += date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds()
    result += date.getMilliseconds()
    return result
}

var getRankKey = function (level, name) {
    return RANK_KEY + level + '_' + name
}

var getScoreKey = function (level, name) {
    return SCORE_KEY + level + '_' + name
}

var getList = function (level, callback) {
    var rankList = []
    redisOps.keys(getRankKey(level, '*'), function(rankListKeys) {
        if (rankListKeys && rankListKeys.length > 0) {
            for (hkeysIndex in rankListKeys) {
                // 一种解决循环中遇到这样的回调函数的方法吧
                (function() {
                        hkeys = rankListKeys[hkeysIndex]
                        var rankObj = {}
                        rankObj.key = hkeys
                        redisOps.hmget(rankObj.key, 'name' , function (data) {
                            rankObj.name = data

                            redisOps.hmget(rankObj.key, 'score' , function (data) {
                                rankObj.score = data

                                redisOps.hmget(rankObj.key, 'time' , function (data) {
                                    rankObj.time = data

                                    rankList.push(rankObj)
                                    if (rankList.length === rankListKeys.length) {

                                        rankList.sort(function (i, j) {
                                            if (i.score == j.score) {
                                                return j.time - i.time
                                            } else {
                                                return i.score - j.score
                                            }
                                        })
                                        callback ? callback(rankList) : null
                                    }
                                })
                            })
                        })
                })(hkeysIndex)
            }
        } else {
            callback(rankList)
        }
    })
}

var addRankList = function (level, name, score, callback) {
    redisOps.get(RANK_TAIL + level, function (data) {
        if (data) {
            var rankTailScore = Number(data)
            console.info(Number(score))
            console.info(Number(score))
            if (Number(score) < Number(data)) {
                getList(level, function (rankList) {
                    if (rankList.length >= 20) {
                        redisOps.del(rankList[19].key, function(success) {
                            if (success) {
                                saveRankObj(RANK_KEY, level, name, score, function (success) {
                                    getList(level, function(rankList){
                                        var tailRankObj = rankList[rankList.length - 1]
                                        redisOps.set(RANK_TAIL, tailRankObj.score, function () {
                                            callback(true)
                                        })
                                    })
                                })
                            } else {
                                callback(false)
                            }
                        })
                    } else {
                        saveRankObj(RANK_KEY, level, name, score, function (success) {
                            getList(level, function(rankList){
                                console.log(rankList)
                                var tailRankObj = rankList[rankList.length - 1]
                                redisOps.set(RANK_TAIL + level, tailRankObj.score, function () {
                                    callback(true)
                                })
                            })
                        })
                    }
                })
            } else {
                callback(false)
            }
        }
    })
}

var saveRankObj = function ( key, level,name, score, callback) {
    var time = getTimeStamp()
    let hkey = key + level + '_' + name + '_' + time
    redisOps.hmset(hkey, 'name', name, function(success) {
        redisOps.hmset(hkey, 'score', score, function () {
            redisOps.hmset(hkey, 'time', time, function () {
                callback(true)
            })
        })
    })
}

var obj = {}
obj.getRankList = getList
obj.addRankList = addRankList
exports.mine = obj

// console.log(getTimeStamp())

// getList('9', function (rankList) {
//     console.log(rankList)
// })

// saveRankObj(RANK_KEY, '9', 'don', '15')