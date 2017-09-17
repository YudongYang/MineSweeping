/**
 * Created by YuDong on 17-9-15.
 * VUE 页面和逻辑交流的信使
 * 类似 MVC 中的 controller
 */

// 默认的雷数和时间
var mines = 9
var times = 120
var name = ''

// 尝试从 cookie 中读取设置，如果有，则用 cookie 中的设置
var cookie = Cookie()
var cookieMines = cookie.get('mines')
var cookieTimes = cookie.get('times')
var cookieName = cookie.get('name')

if (cookieMines) {
    mines = cookieMines
}
if (cookieTimes) {
    times = cookieTimes
}
if (cookieName) {
    name = cookieName
}

// 买个 MineGame 回来先
var mineGame = MineGame()
// 马上插机初始化，这样游戏区域就可以马上显示了
mineGame.init(Number(mines), Number(times))
// 各个 VUE 之间交流的 BUS 总线
var bus = new Vue()

// 保存按钮点击时间
bus.$on('saveSetting', function(mines, times) {
    oprVUE.saveSetting(mines, times)
    playVUE.saveSetting(mines, times)
})

// 开始按钮点击
bus.$on('clickBegin', function(buttonToBegin) {
    settingVUE.clickBegin(buttonToBegin)
})

// 右键点击标记雷
bus.$on('markMines', function() {
    oprVUE.markMines()
})

// 踩雷了
bus.$on('clickTheMine', function() {
    oprVUE.stop()
})

// 赢了
bus.$on('winTheGame', function() {
    oprVUE.stop()
})

// 游戏时间到了
bus.$on('timesOut', function() {
    playVUE.timesOut()
})

// 游戏开始
bus.$on('go', function() {
    playVUE.go()
})

// 游戏面板需要重新布局
bus.$on('clearView', function() {
    playVUE.clearView()
})

// 设置面板的那个 VUE
var settingVUE = new Vue({
    el: '#setting',
    data: {
        mines: mines,
        times: times,
        name: names,
        minesShow: mines,
        timesShow: times,
        nameShow: names,
        settingButton: true
    },
    methods: {
        // 保存按钮
        settingOnClick: function() {
            this.minesShow = this.mines
            this.timesShow = this.times
            this.nameShow = this.name
            mines = this.mines
            times = this.times
            name = this.name
            // 写 cookie
            cookie.set('mines', mines)
            cookie.set('times', times)
            cookie.set('name', name)
            // 向总线开炮！！
            bus.$emit('saveSetting', mines, times)
            // 初始化游戏
            mineGame.init(Number(mines), Number(times))
        },
        // 开始按钮点了之后，设置按钮应该隐藏
        clickBegin: function(buttonToBegin) {
            this.settingButton = buttonToBegin
        }
    }
})

// 游戏进度 VUE
var oprVUE = new Vue({
    el: '#opr',
    data: {
        buttonToBegin: true,
        mines: mines,
        minesShow: mines - mineGame.markMines,
        times: times,
        timesRemember: times,
        timeCounter: {}
    },
    computed: {
        // 计算属性，格式化显示时间
        formatTime: function() {
            let formatTime = Number(this.times).toFixed(2)
            return formatTime > 0 ? formatTime : '0.00'
        }
    },
    methods: {
        // 游戏开始按钮
        oprButtonOnClick: function() {
            this.buttonToBegin = !this.buttonToBegin
            bus.$emit('clickBegin', this.buttonToBegin)
            // 判断是应该点了 begin 还是 end
            if (!this.buttonToBegin) {
                // 如果没有初始化就再初始化一次，主要应用是在上一次游戏结束之后马上点击开始按钮的时候可以马上进入游戏
                if (!mineGame.isInit) {
                    mineGame.init(Number(mines), Number(times))
                }
                bus.$emit('clearView')
                // ES6
                // 箭头函数，可以在函数内部用 this 指向父函数，要求 ES6 以上，没办法这样比较简单达到目的
                // 页面的计时器，主要用于倒计时和时间到了之后向 JS 逻辑请求，询问游戏结果
                timeCounter = setInterval(() => {
                    if (this.times > 0) {
                        this.times -= 0.01
                    } else {
                        clearInterval(timeCounter)
                        bus.$emit('timesOut')
                        this.stop()
                    }
                }, 10)
                // 开启上帝视角，在 console 中打印雷区图
                mineGame.printMap(mineGame.mineMap)
                // GOOOOOOOO!!
                mineGame.go()
                bus.$emit('go')
            } else {
                // 如果是点了 end ，则还原游戏状态，重新开始
                this.times = this.timesRemember
                this.minesShow = this.mines
                clearInterval(timeCounter)
            }
        },
        // 点了保存按钮之后，这个 VUE 也要相应作出改变
        saveSetting: function(mines, times) {
            this.mines = mines
            this.times = times
            this.minesShow = mines
            this.timesRemember = times
        },
        // playVUE 中标记了雷，这里也要作出相应操作，重新向 JS 逻辑询问已经标记了多少的雷
        markMines: function() {
            this.minesShow = mines - mineGame.markMines
        },
        // 游戏时间到，这里也要清理一下下现场
        stop: function() {
            this.times = this.timesRemember
            this.minesShow = this.mines
            clearInterval(timeCounter)
            this.buttonToBegin = !this.buttonToBegin
            bus.$emit('clickBegin', this.buttonToBegin)
        }
    }
})

// 和游戏息息相关的那个 VUE
var playVUE = new Vue({
    el: '#play',
    data: {
        viewMap: mineGame.viewMap, // 和页面的格子绑定的变量
        mines: mineGame.mines,
        win: mineGame.isWin,
        score: mineGame.score,
        isPlaying: mineGame.isPlaying,
        gameMsgCouldShow: false
    },
    computed: {},
    methods: {
        // 游戏格子被点击了
        blockOnClick: function(x, y, event) {
            // 告诉 JS 逻辑，页面中的 x , y 格子被 event 键点击了
            let clickResult = mineGame.mouseClick(event, x, y)
            bus.$emit('markMines')
            // 在 VUE 里面 array[index] = newValue 这样的更改不会更新页面，有三种办法可以在更新数组的时候更新页面
            // 然而记不起来，这里用的是比较简单粗暴的将 this 变量指向清空了再重新指向的方法
            this.viewMap = {}
            this.viewMap = mineGame.viewMap
            // 点击时间的 result
            if (clickResult === 0 || clickResult === 2) {
                this.win = mineGame.isWin
                this.score = mineGame.score
                this.isPlaying = mineGame.isPlaying
            }
            // 踩雷
            if (clickResult === 0) {
                bus.$emit('clickTheMine')
            }
            // 赢了
            if (clickResult === 2) {
                this.score = mineGame.score
                bus.$emit('winTheGame')
            }
        },
        // 清空，重新布局
        clearView: function() {
            this.viewMap = {}
            this.viewMap = mineGame.viewMap
        },
        // GOOOOO!!!
        go: function() {
            this.gameMsgCouldShow = true
            this.isPlaying = mineGame.isPlaying
        },
        // 保存按钮
        saveSetting: function(mines, times) {
            this.mines = mines
        },
        // 时间已经到了
        timesOut: function() {
            setTimeout(() => {
                this.win = mineGame.isWin
                this.score = mineGame.score
                this.isPlaying = mineGame.isPlaying
            }, 500)
        }
    }
})

var uploadScore = function () {

}