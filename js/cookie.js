var Cookie = function() {

	var obj = {}

    var setCookie = function(c_name, value, expiredays) {　　　　
        var exdate = new Date();　　　　
        exdate.setDate(exdate.getDate() + expiredays);　　　　
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());　　
    }

    //读取cookies
    var getCookie = function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return (arr[2]);
        } else {
            return null;
        }
    }

    //删除cookies
    var delCookie = function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }

    obj.set = setCookie
    obj.get = getCookie
    obj.del = delCookie
    return obj
}
