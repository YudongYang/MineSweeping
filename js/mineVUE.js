/**
 * Created by YuDong on 17-9-15.
 */

var mines = 9
var times = 120

var cookie = Cookie()
var cookieMines = cookie.get("mines")
var cookieTimes = cookie.get("times")

if (cookieMines) {
    mines = cookieMines
}
if (cookieTimes) {
    times = cookieTimes
}

var mineGame = MineGame()
mineGame.init()

var bus = new Vue()

bus.$on('saveSetting', function(mines, times) {
    oprVUE.saveSetting(mines, times)
    playVUE.saveSetting(mines, times)
})

bus.$on('clickBegin', function(buttonToBegin) {
    settingVUE.clickBegin(buttonToBegin)
})

bus.$on('markMines', function() {
    oprVUE.markMines()
})

bus.$on('clickTheMine', function() {
    oprVUE.stop()
})

bus.$on('winTheGame', function() {
    oprVUE.stop()
})

bus.$on('timesOut', function() {
    playVUE.timesOut()
})

bus.$on('go', function() {
    playVUE.go()
})

bus.$on('clearView', function() {
    playVUE.clearView()
})

var settingVUE = new Vue({
    el: '#setting',
    data: {
        mines: mines,
        times: times,
        minesShow: mines,
        timesShow: times,
        settingButton: true
    },
    methods: {
        settingOnClick: function() {
            this.minesShow = this.mines
            this.timesShow = this.times
            mines = this.mines
            times = this.times
            cookie.set('mines', mines)
            cookie.set('times', times)
            bus.$emit('saveSetting', mines, times)
            mineGame.init(Number(mines), Number(times))
        },
        clickBegin: function(buttonToBegin) {
            this.settingButton = buttonToBegin
        }
    }
})

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
        formatTime: function() {
            let formatTime = Number(this.times).toFixed(2)
            return formatTime > 0 ? formatTime : '0.00'
        }
    },
    methods: {
        oprButtonOnClick: function() {
            this.buttonToBegin = !this.buttonToBegin
            bus.$emit('clickBegin', this.buttonToBegin)
            if (!this.buttonToBegin) {
                if (!mineGame.isInit) {
                    mineGame.init(Number(mines), Number(times))
                }
                bus.$emit('clearView')
                // ES6
                timeCounter = setInterval(() => {
                    if (this.times > 0) {
                        this.times -= 0.01
                    } else {
                        clearInterval(timeCounter)
                        bus.$emit('timesOut')
                        this.stop()
                    }
                }, 10)
                mineGame.printMap(mineGame.mineMap)
                mineGame.go()
                bus.$emit('go')
            } else {
                this.times = this.timesRemember
                this.minesShow = this.mines
                clearInterval(timeCounter)
            }
        },
        saveSetting: function(mines, times) {
            this.mines = mines
            this.times = times
            this.minesShow = mines
            this.timesRemember = times
        },
        markMines: function() {
            this.minesShow = mines - mineGame.markMines
        },
        stop: function() {
            this.times = this.timesRemember
            this.minesShow = this.mines
            clearInterval(timeCounter)
            this.buttonToBegin = !this.buttonToBegin
            bus.$emit('clickBegin', this.buttonToBegin)
        }
    }
})

var playVUE = new Vue({
    el: '#play',
    data: {
        viewMap: mineGame.viewMap,
        mines: mineGame.mines,
        win: mineGame.isWin,
        score: mineGame.score,
        isPlaying: mineGame.isPlaying,
        gameMsgCouldShow: false
    },
    computed: {},
    methods: {
        blockOnClick: function(x, y, event) {
            let clickResult = mineGame.mouseClick(event, x, y)
            bus.$emit('markMines')
            this.viewMap = {}
            this.viewMap = mineGame.viewMap
            if (clickResult === 0 || clickResult === 2) {
                this.win = mineGame.isWin
                this.score = mineGame.score
                this.isPlaying = mineGame.isPlaying
            }
            if (clickResult === 0) {
                bus.$emit('clickTheMine')
            }
            if (clickResult === 2) {
                this.score = mineGame.score
                bus.$emit('winTheGame')
            }
        },
        clearView: function() {
            this.viewMap = {}
            this.viewMap = mineGame.viewMap
        },
        go: function() {
            this.gameMsgCouldShow = true
            this.isPlaying = mineGame.isPlaying
        },
        saveSetting: function(mines, times) {
            this.mines = mines
        },
        timesOut: function() {
            setTimeout(() => {
                this.win = mineGame.isWin
                this.score = mineGame.score
                this.isPlaying = mineGame.isPlaying
            }, 500)
        }
    }
})