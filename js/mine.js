/**
 * Class For Playing MineGame
 * Created by YuDong on 17-9-11.
 */
var MineGame = function() {
    // 返回的对象
    var obj = {}
    // 默认参数，以免出事
    // 是否正在游戏中
    obj.isPlaying = false
    obj.isInit = false
    // 游戏时间
    obj.gameTime = 120
    // 宽度
    obj.width = 9
    // 高度
    obj.high = 9
    // 雷数
    obj.mines = 9

    // 啊，伟大的先知地图啊，也就是初始随机生成的雷图，实际上下面会初化为二维数组的
    // 0 -> none ; 1 -> mine
    obj.map = []

    // 说得文雅一点吧，行动轨迹图，就是记录哪些有点击过
    // 0 -> not click ; 1 -> mouse_left ; 2 -> mouse_right
    obj.clickMap = []
    // 就是那张记录了左键点击应该显示什么数字的数组
    // -1 -> mine ; 0 -> blank ; 1 - 9 -> number of mine
    obj.mineMap = []
    // 用来给页面显示的数组
    // -3-> mine ; -2 -> blank ; -1 -> flag ; 0 -> init ; 1 - 9 -> number
    obj.viewMap = []

    // 剩余未点击的格子的数量，加速
    obj.unClickCounter = 0

    // 已经插旗的数量，记录一下，防止作弊
    obj.markMines = 0

    // 计时器 clearInterval 的接收者
    obj.timeCounter = {}

    // 赢了吗？赢了吗？
    obj.isWin = false

    // 得分
    obj.score = 0

    // 游戏经过的时间
    obj.flowTime = 0

    // 初始化
    obj.init = function(size, gameTime) {
        // 游戏参数
        obj.width = size ? size : obj.width
        obj.high = size ? size : obj.high
        obj.mines = size ? size : obj.mines
        obj.gameTime = gameTime ? gameTime : obj.gameTime
        // 游戏处于非游戏中
        obj.isPlaying = false
        // 重置计时器
        clearInterval(obj.timeCounter)
        obj.timeCounter = {}
        // 当然还没有赢啦
        obj.isWin = false
        // 没赢的成绩都是 0
        obj.score = 0
        // 经过的时间
        obj.flowTime = 0
        // 制作空白地图
        obj.map = []
        obj.clickMap = []
        obj.mineMap = []
        obj.viewMap = []
        for (var i = 0; i < obj.width; i++) {
            obj.map[i] = []
            obj.clickMap[i] = []
            obj.mineMap[i] = []
            obj.viewMap[i] = []
            for (var j = 0; j < obj.high; j++) {
                obj.map[i][j] = 0
                obj.clickMap[i][j] = 0
                obj.mineMap[i][j] = 0
                obj.viewMap[i][j] = 0
            }
        }
        // 全部格子未点击
        obj.unClickCounter = obj.width * obj.high
        // 插旗记录
        obj.markMines = 0
        // 自动配置
        if (!obj.settingMine()) {
            return false
        }
        // 用预设地图
        // obj.map = obj.testMap
        obj.calculateMap()
        obj.isInit = true
    }

    obj.go = function(callback) {
        if (!obj.isInit) {
            return false
        }
        // 游戏已经开始就不能不经过初始化就再次开始
        obj.isInit = false
        // 开始玩
        obj.isPlaying = true
        var maxTime = obj.gameTime * 1000
        // 时间增量为 10 ms
        obj.timeCounter = setInterval(function() {
            obj.flowTime += 10
            // 超时就停止，并调用回掉函数
            if (obj.flowTime >= maxTime) {
                obj.stop()
                if (typeof(callback) === 'function') {
                    callback()
                }
            }
        }, 10);
    }

    // 停止游戏需要做的操作
    obj.stop = function() {
        // 一定要清掉计时器先，要不 timeCounter 一旦初始化就找啊不找到这个计时器了
        clearInterval(obj.timeCounter)
        // 不玩了
        obj.isPlaying = false
        // 是否赢了
        if (obj.unClickCounter === 0) {
            obj.isWin = true
            // 时间即得分
            obj.score = Number(obj.flowTime / 1000.00).toFixed(2)
        } else {
            obj.isWin = false
            obj.score = 0
        }
    }

    // 干坏事，布雷
    // 单独测试通过
    obj.settingMine = function() {
        // 统计已经埋下的地雷数量
        var mineCounter = 0
        for (var i = 0; i < obj.width; i++) {
            for (var j = 0; j < obj.high; j++) {
                // 随便选一个数做为随机书参考，这里的参考数字为 1
                var randomResult = randomNumber(obj.mines)
                if (mineCounter < obj.mines && randomResult === 1) {
                    mineCounter++
                    obj.map[i][j] = 1
                }
                // 如果已经到了最后一行还没有布完的雷强行塞在最后，为了正确以及效率，粗暴点，概率很低的
                if (i === (obj.width - 1) && (obj.high - j) === (obj.mines - mineCounter)) {
                    mineCounter++
                    obj.map[i][j] = 1
                }
            }
        }
        // 布雷数量好像有点不对的时候就返回 false
        if (mineCounter !== obj.mines) {
            //
            console.log('In fact there are  : ' + mineCounter + ' mines.')
            console.log('But we want : ' + obj.mines + ' mines.')
            return false
        } else {
            return true
        }
    }

    // 计算地雷数量的地图，没有采用原来的逐个计算的思路，先遍历 map 先知地图，如果有雷了，就将该格子周围的数字加一，提高一个数量级的速度
    // 单独测试通过
    obj.calculateMap = function() {
        for (var i = 0; i < obj.width; i++) {
            for (var j = 0; j < obj.high; j++) {
                if (obj.map[i][j] === 1) {
                    obj.mineMap[i][j] = -1
                    for (var x = i - 1; x <= i + 1; x++) {
                        for (var y = j - 1; y <= j + 1; y++) {
                            if (x >= 0 && x < obj.width && y >= 0 && y < obj.high) {
                                if (obj.map[x][y] === 0) {
                                    obj.mineMap[x][y]++
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
    // 返回 -2 -> 未能识别的键位或者不在游戏中 -1 -> 不允许进行该键位点击了（插旗数量超了是一种可能） 0 -> 踩雷了 1-> 正常点击并做了相应处理 2 -> 达到胜利条件，赢了
    obj.mouseClick = function(direction, x, y) {
        if (!obj.isPlaying) {
            return -2
        }
        var result = 1
        if (direction === 1 || direction === 'left' || direction === 'L') {
            result = obj.mouseClickLeft(x, y)
        } else if (direction === 2 || direction === 'right' || direction === 'R') {
            result = obj.mouseClickRight(x, y)
        } else {
            return -2
        }
        if (result === 1 && obj.unClickCounter === 0) {
            obj.stop()
            return 2
        }
        if (result === 0) {
            obj.stop()
        }
        return result
    }

    obj.mouseClickLeft = function(x, y) {
        // 左键只能点击未点击过的地方，只有 clickMap === 0 才可以做左键点击操作
        if (obj.clickMap[x][y] !== 0) {
            return -1
        }
        // 如果大哥告诉你这里有雷，那么游戏就结束了，因为是用左键点的
        if (obj.map[x][y] === 1) {
            // 左键点击
            obj.clickMap[x][y] = 1
            // 未点击的格子数减少 1
            obj.unClickCounter -= 1
            // 给前端显示的 viewMap 变成 mineMap 中的数字，也就是这里有多少个雷
            obj.viewMap[x][y] = -3
            return 0
        }
        if (obj.mineMap[x][y] !== 0) {
            // 左键点击
            obj.clickMap[x][y] = 1
            // 未点击的格子数减少 1
            obj.unClickCounter -= 1
            // 给前端显示的 viewMap 变成 mineMap 中的数字，也就是这里有多少个雷
            obj.viewMap[x][y] = obj.mineMap[x][y]
            return 1
        }
        // 点击检索，开空白
        if (obj.mineMap[x][y] === 0) {
            // console.log('Ready to dfs')
            obj.dfsSeach(x, y)
            return 1
        }
    }

    // 开空白
    // 深度优先搜索， dfs 用递归好写好理解
    obj.dfsSeach = function(x, y) {
        // console.log('Position : ')
        // console.log('( ' + x + ' , ' + y + ' )')
        // 如果搜索游标超出了边界，则返回
        if (x < 0 || x >= obj.width || y < 0 || y >= obj.high) {
            return
        }
        // 如果遇到了雷，则返回
        if (obj.map[x][y] === 1) {
            return
        }
        // 如果已经被点击过，则返回
        if (obj.clickMap[x][y] !== 0) {
            return
        }
        // 如果遇到了 mineMap 中有 1 - 9 ，即周围是有雷的格子，则点击它然后返回
        if (obj.mineMap[x][y] !== 0) {
            // 左键点击
            obj.clickMap[x][y] = 1
            // 未点击的格子数减少 1
            obj.unClickCounter -= 1
            // 给前端显示的 viewMap 变成 mineMap 中的数字，也就是这里有多少个雷
            obj.viewMap[x][y] = obj.mineMap[x][y]
            return
        }
        // 如果遇到了 mineMap 中是 0 ， 即空白，则进行点击操作，然后进行 左 上 右 下 四个方向的 dfs
        if (obj.mineMap[x][y] === 0) {
            // 左键点击
            obj.clickMap[x][y] = 1
            // 未点击的格子数减少 1
            obj.unClickCounter -= 1
            // 给前端显示的 viewMap 变成 -2 ，即开出来的空白的样子
            obj.viewMap[x][y] = -2
            // 左 上 右 下 四个反向的 dfs
            obj.dfsSeach(x - 1, y)
            obj.dfsSeach(x, y - 1)
            obj.dfsSeach(x + 1, y)
            obj.dfsSeach(x, y + 1)
        }
    }

    // 鼠标右键点击
    // 返回 -1 -> 该键位不允许进行点击 1 -> 正常点击右键并做了相应处理
    obj.mouseClickRight = function(x, y) {
        // 如果 clickMap === 0 ，即没有点击过，直接做右键点击操作
        if (obj.clickMap[x][y] === 0) {
            // 已经插旗的数量不能超过地雷的数量，要不怎么玩，哈哈
            if (obj.markMines >= obj.mines) {
                return -1
            }
            // 右键点击
            obj.clickMap[x][y] = 2
            // 未点击的格子数减少 1 
            obj.unClickCounter -= 1
            // 给前端显示的 viewMap 变成 -1 ， 显示旗子
            obj.viewMap[x][y] = -1
            // 插旗
            obj.markMines += 1
            return 1
        }
        // 只有那些左键点击过的不允许右键点击
        if (obj.clickMap[x][y] === 1) {
            return -1
        }
        // 如果 clickMap === 2 ，即该位置已经被右键点击过，则把这个格子置为初始化
        if (obj.clickMap[x][y] === 2) {
            // clickMap 置为没有点击过的状态 0
            obj.clickMap[x][y] = 0
            // 没有点击的格子数加上 1
            obj.unClickCounter += 1
            // 给前端显示的 viewMap 变成 0 ， 显示初始化的样子
            obj.viewMap[x][y] = 0
            // 拔旗
            obj.markMines -= 1
            return 1
        }
    }

    // 大哥，这里有地雷吗
    // 单独测试通过，不验证 x y ，如果超出范围肯定是上面程序有问题或者有人搞事
    // 弃用
    var isThisAMine = function(x, y) {
        return obj.map[x][y] === 1 ? true : false
    }

    // 估计废弃了这个方法
    // 周围地雷的数量
    var numberOfMinesNearby = function(x, y) {
        var minesCount = 0
        for (var i = x - 1; i <= x + 1; i++) {
            for (var j = y - 1; j <= y + 1; j++) {
                if (i >= 0 && i < obj.width && j >= 0 && j < obj.high) {
                    if (obj.map[i][j] === 1) {
                        minesCount++
                    }
                }
            }
        }
        return minesCount
    }

    // 返回 0 ~ range - 1 的随机整数
    // 单独测试通过
    var randomNumber = function(range) {
        return Math.floor(Math.random() * range)
    }

    // 打印地图
    // 单独测试通过，console.log 得很好看了
    obj.printMap = function(waittingPrintMap) {
        //console.log(waittingPrintMap)
        console.log('-----------------------------')
        for (var i = 0; i < obj.width; i++) {
            var line = 'line ' + i + ' :| ';
            for (var j = 0; j < obj.high; j++) {
                var aPos = String(waittingPrintMap[i][j])
                if (waittingPrintMap[i][j] === -1) {
                    aPos = '-'
                }
                if (waittingPrintMap[i][j] === -2) {
                    aPos = '='
                }
                line += aPos;
                if (j < (obj.high - 1)) {
                    line += ' ';
                }
            }
            line += ' |';
            console.log(line)
        }
        console.log('-----------------------------')
    }

    // -----------------------------
    // line 0 :| 0 0 0 0 0 0 0 0 0 |
    // line 1 :| 0 0 0 0 0 0 0 0 0 |
    // line 2 :| 2 3 2 1 0 0 0 0 0 |
    // line 3 :| - - - 2 2 1 1 0 0 |
    // line 4 :| 3 - 4 - 3 - 1 0 0 |
    // line 5 :| 1 1 2 2 - 2 1 0 0 |
    // line 6 :| 0 0 0 1 1 1 0 0 0 |
    // line 7 :| 0 0 0 1 1 1 0 1 1 |
    // line 8 :| 0 0 0 1 - 1 0 1 - |
    // -----------------------------
    obj.testMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1]
    ]
    // 返回 obj
    return obj;
}

/*
测试用
先在后台分别对每个方法进行单元测试，这样我写页面的时候就不用考虑后台了
测试前先把代码中的 map 改成用 testMap
var mineGame = MineGame()
mineGame.init(9, 120)
mineGame.printMap(mineGame.map)
mineGame.printMap(mineGame.mineMap)
mineGame.printMap(mineGame.clickMap)
mineGame.printMap(mineGame.viewMap)
mineGame.go()

console.log('左键点击 ： ' + ' (3, 8)')
console.log(mineGame.mouseClick(1, 3, 8))
mineGame.printMap(mineGame.clickMap)
mineGame.printMap(mineGame.viewMap)
console.log('isWin?')
console.log(mineGame.isPlaying)
console.log(mineGame.isWin)

console.log('左键点击 ： ' + ' (4, 0)')
console.log(mineGame.mouseClick(1, 4, 0))
mineGame.printMap(mineGame.clickMap)
mineGame.printMap(mineGame.viewMap)
console.log('isWin?')
console.log(mineGame.isPlaying)
console.log(mineGame.isWin)

console.log('右键键点击 ： ' + ' (3, 0)')
console.log(mineGame.mouseClick(2, 3, 0))
mineGame.printMap(mineGame.clickMap)
mineGame.printMap(mineGame.viewMap)
console.log('isWin?')
console.log(mineGame.isPlaying)
console.log(mineGame.isWin)

console.log('开启上帝视角，把雷都插旗了')
console.log('右键键点击 ： ' + ' (3, 1)')
console.log(mineGame.mouseClick(2, 3, 1))
console.log('右键键点击 ： ' + ' (3, 2)')
console.log(mineGame.mouseClick(2, 3, 2))
console.log('右键键点击 ： ' + ' (4, 1)')
console.log(mineGame.mouseClick(2, 4, 1))
console.log('右键键点击 ： ' + ' (4, 3)')
console.log(mineGame.mouseClick(2, 4, 3))
console.log('右键键点击 ： ' + ' (4, 5)')
console.log(mineGame.mouseClick(2, 4, 5))
console.log('右键键点击 ： ' + ' (5, 4)')
console.log(mineGame.mouseClick(2, 5, 4))
console.log('右键键点击 ： ' + ' (8, 4)')
console.log(mineGame.mouseClick(2, 8, 4))
console.log('右键键点击 ： ' + ' (8, 8)')
console.log(mineGame.mouseClick(2, 8, 8))
mineGame.printMap(mineGame.clickMap)
mineGame.printMap(mineGame.viewMap)

console.log('盲目快速遍历点击左键')

for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
        console.log('左键点击 ： ' + ' (' + i + ', ' + j + ')')
        console.log(mineGame.mouseClick(1, i, j))
    }
}

mineGame.printMap(mineGame.clickMap)
mineGame.printMap(mineGame.viewMap)

console.log(mineGame.unClickCounter)
console.log(mineGame.isWin)
*/