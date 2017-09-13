/**
 * Class For Playing MineGame
 * Created by YuDong on 17-9-11.
 */
var MineGame = function () {
    // 返回的对象
    var obj = {};
    // 默认参数，以免出事
    // 是否正在游戏中
    var isPlaying = false
    // 游戏时间
    var gameTime = 120
    // 宽度
    var width = 9
    // 高度
    var high = 9
    // 雷数
    var mines = 9

    // 啊，伟大的先知地图啊，也就是初始随机生成的雷图，实际上下面会初化为二维数组的
    // 0 -> none ; 1 -> mine
    var map = []

    // 说得文雅一点吧，行动轨迹图，就是记录哪些有点击过
    // 0 -> not click ; 1 -> mouse_left ; 2 -> mouse_right
    var clickMap = []
    // 就是那张记录了左键点击应该显示什么数字的数组
    // -1 -> mine ; 0 -> blank ; 1 - 9 -> number of mine
    var mineMap = []
    // 用来给页面显示的数组
    // -1 -> flag ; 0 -> init ; 1 - 9 -> number
    var viewMap = []

    // 剩余未点击的格子的数量，加速
    var unClickCounter = 0

    // 初始化
    var init = function (size, gameTime) {
        // 游戏参数
        this.width = size ? size : this.width
        this.high = size ? size : this.high
        this.mines = size ? size : this.mines
        this.gameTime = gameTime ? gameTime : this.gameTime
        // 游戏处于非游戏中
        this.isPlaying = false
        // 制作空白地图
        this.map = []
        this.clickMap = []
        this.mineMap = []
        this.viewMap = []
        for (var i = 0 ; i< this.width ; i++) {
            this.map[i] = []
            this.clickMap[i] = []
            this.mineMap[i] = []
            this.viewMap[i] = []
            for (var j = 0 ; j < this.high ; j++) {
                this.map[i][j] = 0
                this.clickMap[i][j] = 0
                this.mineMap[i][j] = 0
                this.viewMap[i][j] = 0
            }
        }
        // 全部格子未点击
        unClickCounter = this.width * this.high
    }

    // 干坏事，布雷
    var settingMine = function () {
        // 统计已经买下的地雷数量
        var mineCounter = 0
        for (var i = 0 ; i < this.width ; i++) {
            for (var j = 0 ; j < this.high ; j++) {
                // 随便选一个数做为随机书参考，这里的参考数字为 1
                var randomResult = randomNumber(this.mines)
                if (mineCounter <= this.mines && randomResult === 1) {
                    mineCounter++
                    this.map[i][j] = 1
                }
                // 如果已经到了最后一行还没有布完的雷强行塞在最后，为了正确以及效率，粗暴点，概率很低的
                if (i === (this.width - 1) && (this.high - j) === (this.mines - mineCounter)) {
                    mineCounter++
                    this.map[i][j] = 1
                }
            }
        }
        // 布雷数量好像有点不对的时候就返回 false
        if (mineCounter !== this.mines) {
            //
            console.log('In fact there are  : ' + mineCounter + ' mines.')
            console.log('But we want : ' + this.mines + ' mines.')
            printMap()
            return false
        } else {
            return true
        }
    }

    // 计算地雷数量的地图，没有采用原来的逐个计算的思路，先遍历 map 先知地图，如果有雷了，就将该格子周围的数字加一，提高一个数量级的速度
    var calculateMap = function () {
        for (var i = 0 ; i< this.width ; i++) {
            for (var j = 0 ; j < this.high ; j++) {
                if (this.map[i][j] === 1) {
                    this.mineMap[i][j] = -1
                    for (var x = i - 1 ; x < i + 1 ; x++) {
                        for (var y = j - 1 ; y < j + 1 ; y++) {
                            if (x >= 0 && x < this.width && y >= 0 && y < this.high) {
                                if (this.map[x][y] === 0) {
                                    this.mineMap[x][y] ++
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 鼠标点击
    // direction 的值为 1 || 'left' || 'L' 和 2 || 'right' || 'R' ， x 和 y 为坐标
    var mouseClick = function (direction, x, y) {}

    var mouseClickLeft = function (x, y) {}

    var mouseClickRight = function (x, y) {}

    // 大哥，这里有地雷吗
    var isThisAMine  = function (x, y) {
        return this.map[x][y] === 1 ? true : false
    }

    // 估计废弃了这个方法
    // 周围地雷的数量
    var numberOfMinesNearby = function (x, y) {
        var minesCount = 0
        for (var i = x - 1 ; i <= x + 1 ; i++) {
            for (var j = y - 1 ; j <= y + 1 ; j++) {
                if (i >= 0 && i < this.width && j >=0 && j < this.high) {
                    if (this.map[i][j] === 1) {
                        minesCount++
                    }
                }
            }
        }
        return minesCount
    }

    // 返回 0 ~ range - 1 的随机整数
    var randomNumber = function (range) {
        return Math.floor(Math.random() * range)
    }

    // 打印地图
    var printMap = function (waittingPrintMap) {
        console.log(waittingPrintMap)
        for (var i = 0 ; i < this.width ; i++) {
            var line = '';
            for (var j = 0 ; j < this.high ; j ++) {
                line += String(waittingPrintMap[i][j]);
                if (j < (this.high - 1)) {
                    line += '+';
                }
            }
            console.log(line)
        }
    }

    // 对外公开的方法
    obj.init = init

    obj.settingMine = settingMine

    obj.printMap = printMap

    obj.isThisAMine = isThisAMine

    // 返回 obj
    return obj;
}