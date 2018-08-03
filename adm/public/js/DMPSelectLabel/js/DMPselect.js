function addElementIDListener(option) {

                // 监听者数组  ["levelOne", "levelTwo", "levelThree"]
                this.spanArr = option.spanArr 
                || ["levelOne", "levelTwo", "levelThree"];
                // 被监听者数组  ["elementOne", "elementTwo", "elementThree"]
                this.selectArr = option.selectArr 
                || ["elementOne", "elementTwo", "elementThree"];

                // 数据双向绑定的 靶对象
                this.elementID = {
                };

                // 获取数据的接口路径  
                this.url = option.url || null;

                // 获取标签code的接口路径 初始化选中状态
                this.urlCode = option.urlCode || null;
                // 最终的选定标签的code
                this.code;
            }

addElementIDListener.prototype = {


                constructor: addElementIDListener,

                //初始化  
                init: function () {
                    var self = this;
                    this.codeInit()
                    .then(function (hasCode) {
                        // hasCode 是 初始化 选择器时候得到 是否渲染 点击状态的 判断值
                        self.fillData(hasCode);
                    })
                    .then(function () {
                        self.addMonitor();
                        self.bindStatus();
                    });
                    
                },
                 // 获取 code 接口的数据 并传入 codeRender  
                codeInit: function () {
                    // 根据 hasCode 判断 是否需要 给urlCode发送 数据请求
                    var dtd = $.Deferred();
                    var self = this;
                    var url = this.urlCode;
                    // console.log(url);
                    $.getJSON(url, function (data) {
                        //判断初始化时 是否应该 持有 初始选中状态
                        var flag = data.data.tag_code == null
                        ? false
                        : true;
                        var hasCode = self.judgeCode(flag);
                        if (!hasCode) {
                            dtd.resolve(hasCode);
                            return dtd;
                        }
                        self.codeRender(data);
                        dtd.resolve();
                    });
                    return dtd;
                },
                //如果传入code 按照 code 分级层级结构 做初始化展示 
                codeRender: function (result) {
                    // data 是获取的总数据
                    if (result.status !== 1) {
                        return
                    } 
                    var data = result.data;
                    // 根据最终标签 还原点击状态  
                    var level1 = data.level1;
                    var level2 = data.level2 || data.level1;
                    var level3 = data.level3 || data.level2 || data.level1;

                    // 根据最终标签 还原展示状态  
                    var level1Name = data.level1_name;
                    var level2Name = data.level2_name !== "全部" 
                    ? data.level2_name
                    : "";
                    var level3Name = data.level3_name !== "全部"
                    ? data.level3_name
                    : "";


                    // console.log(level1, level2, level3);
                    // 将三个级别的标签id 分别赋给三个初始化的 option的value值
                    $("#" + this.selectArr[0]).children(":first").attr("value",level1);
                    $("#" + this.selectArr[1]).children(":first").attr("value",level2);
                    $("#" + this.selectArr[2]).children(":first").attr("value",level3);

                    // 将三个级别的标签内容 分别赋予右边的展示框中  
                    $("#" + this.spanArr[0]).html(level1Name);
                    $("#" + this.spanArr[1]).html(level2Name);
                    $("#" + this.spanArr[2]).html(level3Name);
                },
                // ajax 获取标签信息  将数据填入标签  引入 cxselect.js 实现三级联动功能
                fillData: function (hasCode) {
                    var url = this.url;
                    var self = this;

                    var dtd = $.Deferred();
                    $.getJSON(url,function (data) {
                        // console.log(data);
                        $("#element_id").cxSelect({
                            selects: ['first', 'second', 'third'],
                            jsonName: 'name',
                            jsonValue: 'code',
                            jsonSub: 'child',
                            data: data.data
                        },function () {
                            // 结束这次异步操作
                            dtd.resolve();
                        })
                    });
                    return dtd;
                },
                // 监听者给靶对象安装监听器  
                addMonitor: function () {
                    var spans = this.spanArr;
                    for (var i = 0; i < spans.length; i++) {
                        this.Monitor(spans[i]);
                    }
                },
                // 安装监听器  
                Monitor: function (attrName) {
                    Object.defineProperty(this.elementID, attrName, {
                        set: function (newValue) {
                            //监听者(从靶对象)拿到监听到的数据后的处理代码  
                            document.getElementById(attrName).innerHTML = newValue;
                        }
                    })
                },
                // 将被监听者状态的改变 与 靶对象绑定  
                bindStatus: function () {
                    var selects = this.selectArr;
                    var self = this;
                    for (var i = 0; i < selects.length; i++) {
                        // 将 对象实例的引用传入点击处理函数
                        $("#" + selects[i]).click(self, this[selects[i]]);
                    }                    
                },
                // 一级被监听者的状态改变  
                elementOne: function (event) {
                    // console.log("levelOne");
                    var that = event.data;
                    var selects = that.spanArr;
                    var elementID = that.elementID;
                    //一级被监听者值改变 应该跟靶对象的 一级监听者 监听的值绑定  
                    var list = this.children;
                    var inText;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].selected) {
                            // console.log(list[i].innerHTML);
                            var code = list[i].value;
                            that.code = code;
                            inText = list[i].innerHTML;
                            break;
                        }
                    }
                    elementID[selects[0]] = inText || " ";
                    elementID[selects[1]] = "";
                    elementID[selects[2]] = "";

                },
                // 二级被监听者的状态改变
                elementTwo: function (event) {
                    // console.log("levelTwo");
                    var that = event.data;
                    var selects = that.spanArr;
                    var elementID = that.elementID;
                    //一级被监听者值改变 应该跟靶对象的 一级监听者 监听的值绑定  
                    var list = this.children;
                    var inText;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].selected) {
                            // console.log(list[i].innerHTML);
                            var code = list[i].value;
                            that.code = code;
                            inText = list[i].innerHTML;
                            break;
                        }
                    }
                    if (inText === "全部") {
                        inText = "";
                    }
                    elementID[selects[1]] = inText || " ";
                    elementID[selects[2]] = "";
                },
                // 三级被监听者的状态改变
                elementThree: function (event) {
                    // console.log("levelThree");
                    var that = event.data;
                    var selects = that.spanArr;
                    var elementID = that.elementID;
                    //一级被监听者值改变 应该跟靶对象的 一级监听者 监听的值绑定  
                    var list = this.children;
                    var inText;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].selected) {
                            // console.log(list[i].innerHTML);
                            var code = list[i].value;
                            that.code = code;
                            inText = list[i].innerHTML;
                            break;
                        }
                    }
                    if (inText === "全部") {
                        inText = "";
                    }
                    elementID[selects[2]] = inText || " ";
                },
                // 输出当前状态的最终code  
                inputCode: function () {
                    return this.code;
                },
                // 判断初始化的时候是否包含点击状态 (即是否包含 code请求)
                judgeCode: function (InhasCode) {
                    var hasCode = InhasCode;
                    if (!hasCode) {
                        $("#" + this.selectArr[0]).empty();
                        $("#" + this.selectArr[1]).empty();
                        $("#" + this.selectArr[2]).empty();
                        // 初始化不包含点击状态
                        hasCode = false;
                    } 
                    else {
                        // 初始化包含点击状态
                        hasCode = true;
                    }
                    return hasCode;
                }
            };

var labellingObj = new addElementIDListener({
    url: "/promotion/tag?level=3",
    urlCode: '/promotion/fetchcreative?id='+GetQueryString('id')+''
});
labellingObj.init();
