//封装的入口函数
function myReady(fn) {
    //对于现代浏览器，对DOMContentLoaded事件的处理采用标准的事件绑定方式
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn, false);
    } else {
        IEContentLoaded(fn);
    }
    //IE模拟DOMContentLoaded
    function IEContentLoaded (fn) {
        var d = window.document;
        var done = false;

        //只执行一次用户的回调函数init()
        var init = function () {
            if (!done) {
                done = true;
                fn();
            }
        };

        (function () {
            try {
                //DOM树未创建完之前调用doScroll会抛出错误
                d.documentElement.doScroll('left');
            } catch (e) {
                //延迟再试一次
                setTimeout(arguments.callee, 50);
                return;
            }
            //没有错误就表示DOM数创建完毕，然后立马执行用户回调
            init();
        })();

        //监听document的加载状态
        d.onreadystatechange = function () {
            //如果用户是在domReady之后绑定的函数，就立马执行
            if (d.readyState === 'complete') {
                d.onreadystatechange = null;
                init();
            }
        }
    }
};

//处理兼容性问题的js处理
//处理filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function (callback) {
        var arr = [];
        for (var i = 0, len = this.length; i < len; i++) {
            if (callback(this[i], i)) {
                arr.push(this[i])
            }
        }
        return arr;
    }
};
//forEach处理
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback) {
        for (var i = 0, len = this.length; i < len; i++) {
            callback(this[i], i);
        }
    }
};
//...后续添加的代码写在这里
//深度克隆
function deepClone(obj){
    var result,oClass=isClass(obj);
    //确定result的类型
    if(oClass==="Object"){
        result={};
    }else if(oClass==="Array"){
        result=[];
    }else{
        return obj;
    }
    for(key in obj){
        var copy=obj[key];
        if(isClass(copy)=="Object"){
            result[key]=arguments.callee(copy);//递归调用
        }else if(isClass(copy)=="Array"){
            result[key]=arguments.callee(copy);
        }else{
            result[key]=obj[key];
        }
    }
    return result;
};
//返回传递给他的任意对象的类
function isClass(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
};

//将请求来的数据处理到本地dataCache中
function converseData(req,dataCache,phase,daily) {
    //判断将数据存储到缓存对象的位置
    var phaseTime;
    if(phase === 'current') {
        phaseTime = 'currentDate';
    } else if (phase === 'prev') {
        phaseTime = 'prevDate';
    }
    //将上一次的值清空，重新赋值
    for(var x in dataCache[phaseTime]) {
        dataCache[phaseTime][x]['data'] = [];
    }
    dataCache[phaseTime]['xAxis'] = [];
    //
    //daily是一个bool值，决定是分日还是分时
    for (var j = 0; j < req.data.length; j++) {
        var obj = req.data[j];
        //遍历时间节点的数据对象 将各个字段的数据分配
        for (var k in obj) {
            if (daily) {
                if (k === 'date') {
                    dataCache[phaseTime]['xAxis'].push(obj[k]);
                }
            } else {
                if (k === 'period') {
                    dataCache[phaseTime]['xAxis'].push(obj[k]);
                }
            }
            for (var item in dataCache[phaseTime]) {
                //将各个字段的数据分配到本地的缓存数据对象中
                if (item === k) {
                    dataCache[phaseTime][item]['data'].push(obj[k]);
                }
            }
        }
    }
}

//将缓存数据放入option中
function transfer(origin,end,phase){
    var phaseTime;
    if(phase ==='current') {
        phaseTime = 'currentDate';
    } else if (phase === 'prev') {
        phaseTime = 'prevDate';
    }
    for (var i = 0; i < end.series.length; i++) {
        var item = end.series[i];
        for (var k in origin[phaseTime]) {
            if (k === item.field) {
                item.data = origin[phaseTime][k]['data'];
            }
        }
    }
    end.xAxis.data = origin[phaseTime]['xAxis'];
}

//对象数据转化为数组数据 option.series
function objToArr(config,obj) {
    var arr = [];
    for (var ck in config) {
        for (var ok in obj) {
            if ( ck === ok) {
                arr[config[ck]] = obj[ok];
            }
        }
    }
    return arr;
}
//时间转换格式函数
//计算对比时间
function transferTime(option) {
    //获取查询时间毫秒
    var curDateStart = new Date(option.start);
    var curDateEnd = new Date(option.end);
    var deltaTime;
    //如果是同一天
    if (option.start === option.end) {
        deltaTime = 3600 * 24 * 1000;
    } else {
        //计算查询时间的时间间隔
        deltaTime = curDateEnd.getTime() - curDateStart.getTime();
    }
    //计算上一个阶段的时间节点
    var prevDateStart = curDateStart.getTime() - deltaTime;
    var prevDateEnd = curDateEnd.getTime() - deltaTime;
    //将上一个阶段的时间节点转化为时间对象
    var preStart = new Date(prevDateStart);
    var preEnd = new Date(prevDateEnd);

    var preStartArr = [];
    var preEndArr = [];
    preStartArr[0] = preStart.getFullYear();
    preStartArr[1] = preStart.getMonth() + 1;
    preStartArr[2] = preStart.getDate();

    preEndArr[0] = preEnd.getFullYear();
    preEndArr[1] = preEnd.getMonth() + 1;
    preEndArr[2] = preEnd.getDate();

    //格式处理
    for (var i = 0; i < 3; i++) {
        preStartArr[i] = preStartArr[i].toString();
        preEndArr[i] = preEndArr[i].toString();
        if (preStartArr[i].length === 1) {
            preStartArr[i] = '0' + preStartArr[i];
        }
        if (preEndArr[i].length === 1) {
            preEndArr[i] = '0' + preEndArr[i];
        }
    }

    //将结果包装成对象
    return {
        start: preStartArr.join('/'),
        end: preEndArr.join('/')
    };
}