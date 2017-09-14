/**
 * Created by YuDong on 17-9-15.
 */

var mines = 9
var times = 120

var bus = new Vue()

bus.$on('saveSetting', function (mines, times) {
    oprVUE.saveSetting(mines, times)
})

bus.$on('clickBegin', function (buttonToBegin) {
    settingVUE.clickBegin(buttonToBegin)
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
        settingOnClick: function () {
            this.minesShow = this.mines
            this.timesShow = this.times
            mines = this.mines
            times = this.times
            bus.$emit('saveSetting', mines, times)
        },
        clickBegin: function (buttonToBegin) {
            this.settingButton = buttonToBegin
        }
    }
})

var oprVUE = new Vue({
    el: '#opr',
    data: {
        buttonToBegin: true,
        mines: mines,
        times: times,
        timeCounter: {}
    },
    computed: {
            formatTime: function () {
            return Number(this.times).toFixed(2)
        }
    },
    methods: {
        oprButtonOnClick: function () {
            this.buttonToBegin = !this.buttonToBegin
            bus.$emit('clickBegin', this.buttonToBegin)
            if (!this.buttonToBegin) {
                // ES6
                timeCounter = setInterval(() => {
                    this.times -= 0.01
                    if (this.times <= 0) {
                        clearInterval(timeCounter)
                    }
                }, 10)
            } else {
                clearInterval(timeCounter)
            }
        },
        saveSetting: function (mines, times) {
            this.mines = mines
            this.times = times
        }
    }
})