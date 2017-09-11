/**
 * Class For Playing MineGame
 * Created by YuDong on 17-9-11.
 */
var MineGame = function () {
    var obj = {};
    // 默认参数，以免出事
    var isPlaying = false
    var timeCounter = 120
    var width = 9
    var high = 9
    var mines = 9

    // 啊，伟大的先知地图啊，实际上下面会初始哈u为二维数组的
    var map = []

    // 初始化
    var init = function (size, timeCounter) {
        // 游戏参数
        this.width = size ? size : this.width
        this.high = size ? size : this.high
        this.mines = size ? size : this.mines
        this.timeCounter = timeCounter ? timeCounter : this.timeCounter
        // 游戏处于非游戏中
        this.isPlaying = false
        // 制作空白地图
        this.map = []
        for (var i = 0 ; i< width ; i++) {
            this.map[i] = []
            for (var j = 0 ; j < high ; j++) {
                this.map[i][j] = 0
            }
        }
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

    // 大哥，这里有地雷吗
    var isThisAMine  = function (x, y) {
        return this.map[x][y] === 1 ? true : false
    }

    // 周围地雷的数量
    var numberOfMinesNearby = function (x, y) {
        var minesCount = 0
        for (var i = x - 1 ; i <= x + 1 ; i++) {
            for (var j = y - 1 ; j <= y + 1 ; j++) {
                if (i >= 0 && i < this.width && y >=0 && y < this.high) {
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
    var printMap = function () {
        console.log(this.map)
        for (var i = 0 ; i < this.width ; i++) {
            var line = '';
            for (var j = 0 ; j < this.high ; j ++) {
                line += String(this.map[i][j]);
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

    obj.numberOfMinesNearby = numberOfMinesNearby

    // 返回 obj
    return obj;
}