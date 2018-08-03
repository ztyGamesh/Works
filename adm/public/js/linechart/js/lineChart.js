
    //折线图配置信息
    var config = {
        //1.数据项(自定义图例)
        myLegend: lineConfig.myLegend,
        myLegendId: lineConfig.myLegendId,
        //2.数据项配色
        myLegendColor: ["#f04e35", "#0077e5", "#ffc801", "#a75adc", "#ff91bb", "#99cc01",],
        //3.纵坐标配置模板
        yAxisTemplet: {
            show: false,
            min:"dataMin",
            type: 'value',
            splitLine: {
                //隐藏坐标轴轴线
                show: false,
            },
            //坐标轴线相关
            axisLine: {
                //设置坐标轴显示颜色
                lineStyle: {}
            },
            //坐标轴相关
            axisTick: {
                //隐藏坐标轴刻度
                show: false
            },
            //纵坐标值后跟%
            axisLabel: {
                // formatter: '{value}%'
                formatter: "{value}"
            },
            //坐标轴留白策略
            boundaryGap: ["10%", "10%"],
            minInterval: 1,
            // interval:1
        },
        //4.系列列表模板
        seriesTemplet: {
            // 使用的y轴的index，在单个图标实例中存在多个y轴的时候有用
            // yAxisIndex: 0,
            type: 'line',
            label: {
                normal: {
                    show: false,
                }
            },
            lineStyle: {
                normal: {}
            },
            smooth:false,
            //是否链接空值
            connectNulls: true
        },
    };
    //折线图绘图配置
    var option = {
        color: config.myLegendColor,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    type: 'dotted',
                    color: '#ccc'
                }
            },
            confine: true,
            // triggerOn:"click",
            formatter: function (params) {
                // console.log(params);
                var str;
                for (var p = 0; p < params.length; p++) {
                    if (params[p].value == null) {
                        params[p].value = '-';
                        params[p].data = '-';
                    }
                    if (params[p].seriesName === '点击率' && params[p].value !== "-") {
                        params[p].value = params[p].value*100 +'%';
                        params[p].data  = params[p].data*100 + '%';
                    }
                }
                if (params.length === 1 && params[0].data !== '-') {
                    str = '<ul id="tooltip">'
                        + '<li id="tooltipBall">'
                        + '<div style="visibility: hidden">占位</div>'
                        + '<div style="color: ' + params[0]['color'] + '"><span>●</span></div>'
                        + '</li>'
                        + '<li>'
                        + '<div style="visibility: hidden">占位</div>'
                        + '<div style="color: ' + params[0]['color'] + '">' + params[0].seriesName + '</div>'
                        + '</li>'
                        + '<li>'
                        + '<div class="tooltipData">' + dataCache.date[0] + '</div>'
                        + '<div style="color: ' + params[0]['color'] + '">' + params[0].value + '</div>'
                        + '</li>'
                        + '</ul>';
                }
                if (params.length === 2 ) {
                    if (params[0].data === '-' && params[1].data === '-') {
                        return ""
                    }
                    //处理弹出框没有数据不显示问题
                    var type1 = params[0].seriesName;
                    var type2 = params[1].seriesName;
                    if (type1 !== type2) {
                        str = '<ul id="tooltip">'
                            + '<li id="tooltipBall">'
                            + '<div style="visibility: hidden">占位</div>'
                            + '<div style="color: ' + params[0]['color'] + '"><span>●</span></div>'
                            + '<div style="color:' + params[1]['color'] + ' "><span>●</span></div>'
                            + '</li>'
                            + '<li>'
                            + '<div style="visibility: hidden">占位</div>'
                            + '<div style="color: ' + params[0]['color'] + '">' + params[0].seriesName + '</div>'
                            + '<div style="color: ' + params[1]['color'] + '">' + params[1].seriesName + '</div>'
                            + '</li>'
                            + '<li>'
                            + '<div class="tooltipData">' + dataCache.date[0] + '</div>'
                            + '<div style="color: ' + params[0]['color'] + '">' + params[0].value + '</div>'
                            + '<div style="color: ' + params[1]['color'] + '">' + params[1].value + '</div>'
                            + '</li>'
                            + '</ul>';
                    } else {
                        str = '<ul id="tooltip">'
                            + '<li id="tooltipBall">'
                            + '<div style="visibility: hidden">占位</div>'
                            + '<div style="color: ' + params[0]['color'] + '"><span>●</span></div>'
                            + '</li>'
                            + '<li>'
                            + '<div style="visibility: hidden">占位</div>'
                            + '<div style="color: ' + params[0]['color'] + '">' + params[0].seriesName + '</div>'
                            + '</li>'
                            + '<li>'
                            + '<div class="tooltipData">' + dataCache.date[0] + '</div>'
                            + '<div style="color: ' + params[0]['color'] + '">' + params[0].value + '</div>'
                            + '</li>'
                            + '<li>'
                            + '<div class="tooltipData">' + dataCache.date[1] + '</div>'
                            + '<div style="color: ' + params[0]['color'] + '">' + params[1].value + '</div>'
                            + '</li>'
                            + '</ul>';
                    }
                }
                else if (params.length === 4) {
                    var hide = true;
                    for (var p = 0; p < 4; p++) {
                        if (params[p].data !== '-') {
                            hide = false;
                        }
                    }
                    if (hide) {
                        return '';
                    }
                    //处理弹出框没有数据不显示的问题
                    for (var p = 0; p < params.length; p++) {
                        var type = typeof params[p].value;
                        if (type.indexOf('undefined') !== -1 || params[p].value === 'undefined%') {
                            params[p].value = 'null';
                        }
                    }
                    var type1 = params[0].value;
                    var type2 = params[1].value;
                    var type3 = params[2].value;
                    var type4 = params[3].value;
                    if (type1 === 'null' && type2 === 'null' && type3 === 'null' && type4 === 'null') {
                        return str = ''
                    }
                    str = '<ul id="tooltip">'
                        + '<li id="tooltipBall">'
                        + '<div style="visibility: hidden">占位</div>'
                        + '<div style="color: ' + params[0]['color'] + '"><span>●</span></div>'
                        + '<div style="color: ' + params[1]['color'] + '"><span>●</span></div>'
                        + '</li>'
                        + '<li>'
                        + '<div style="visibility: hidden">占位</div>'
                        + '<div style="color: ' + params[0]['color'] + '">' + params[0].seriesName + '</div>'
                        + '<div style="color: ' + params[1]['color'] + '">' + params[1].seriesName + '</div>'
                        + '</li>'
                        + '<li>'
                        + '<div class="tooltipData">' + dataCache.date[0] + '</div>'
                        + '<div style="color: ' + params[0]['color'] + '">' + params[0].value + '</div>'
                        + '<div style="color: ' + params[1]['color'] + '">' + params[1].value + '</div>'
                        + '</li>'
                        + '<li>'
                        + '<div class="tooltipData">' + dataCache.date[1] + '</div>'
                        + '<div style="color: ' + params[0]['color'] + '">' + params[2].value + '</div>'
                        + '<div style="color: ' + params[1]['color'] + '">' + params[3].value + '</div>'
                        + '</li>'
                        + '</ul>';
                }
                ;
                return str;
            },
            backgroundColor: 'rgba(0,0,0,0)',
            position: function (point, params, dom, rect, size) {
                var width = document.getElementById('line-container').offsetWidth;
                var delta = document.getElementById("tooltip")?document.getElementById("tooltip").offsetWidth:{point:[0,0]} ;
                var x = point[0] > width / 2 ? point[0] - delta : point[0];
                var y = point[1] - 20;
                var obj = [x, y];
                return obj;
            }
        },
        legend: {
            x: 'left',
            padding: [10, 20, 0, 20],
            selected: {},
        },
        grid: {
            show: false,
            left: "6%",
            right: "6%",
            bottom: "16%",
            top: "20%",

        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine: { //网格线
                show: false,
                lineStyle: {
                    color: ['#b1b1b1'],
                    type: 'dashed'
                }
            },
            //坐标轴轴线相关
            axisLine: {
                lineStyle: {
                    color: '#ccc',
                }
            },
            //坐标轴刻度相关
            axisTick: {
                show: false,
            },
            //设置坐标轴间隔
            axisLabel: {
                interval: "auto",
            },
            data: [],
        },
        yAxis: [],
        series: [],
        //工具栏
        toolbox: {
            show: false,
            feature: //保存图片
                {
                    saveAsImage: {
                        type: 'png',
                    }
                },
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
                bottom: 0,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '40%',
                handleColor: "#80cbc4",
                // fillerColor:'#ccc',
                // borderColor: "red",
            },
            {type: "inside"}
        ],
    };
    //根据请求日期获取的数据缓存对象
    var dataCache = {
        date: ['当前日期', '对比日期'],
        prevDate: {
            xAxis: []
        },
        currentDate: {
            xAxis: []
        }
    };
    //折线图对象
    var myChart = echarts.init(document.getElementById('main'), 'macarons');

    //根据配置初始化option
    function initOption(config) {
        //依据config.myLegend
        var len = config.myLegend.length;
        for (var i = 0; i < len; i++) {
            var name = config.myLegend[i];
            var color = config.myLegendColor[i];
            var field = config.myLegendId[i];
            var yAxisTemplet = deepClone(config.yAxisTemplet);
            var seriesTemplet = deepClone(config.seriesTemplet);
            option.legend.selected[name] = false;
            yAxisTemplet.name = name;
            if(yAxisTemplet.name === "点击率") {
                yAxisTemplet.axisLabel.formatter = function (params) {
                    return params*100 + '%';
                }
            }
            yAxisTemplet.axisLine.lineStyle.color = color;
            seriesTemplet.name = name;
            seriesTemplet.field = field;
            seriesTemplet.yAxisIndex = i;
            seriesTemplet.lineStyle.normal.color = color;
            option.yAxis.push(yAxisTemplet);
            option.series.push(seriesTemplet);
        }
    }

    //初始化数据仓库
    function initData(config, dataCache) {
        var len = config.myLegend.length;
        for (var i = 0; i < len; i++) {
            var name = config.myLegend[i];
            var color = config.myLegendColor[i];
            var field = config.myLegendId[i];
            var objCurrent = deepClone(config.seriesTemplet);
            var objPrev = deepClone(config.seriesTemplet);
            objCurrent.name = name;
            objCurrent.field = field;
            objCurrent.data = [];
            objCurrent.yAxisIndex = i;
            objCurrent.lineStyle.normal.color = color;
            objPrev.name = name;
            objPrev.field = field;
            objPrev.data = [];
            objPrev.yAxisIndex = i;
            objPrev.lineStyle.normal.color = color;
            dataCache.currentDate[field] = objCurrent;
            dataCache.prevDate[field] = objPrev;
        }
    }

    //页面初始加载时给数据仓库填充信息 折线图信息
    function renderCurrentLine(data) {
        var req = JSON.parse(data);
        if (req.status === 1) {
            //当前阶段的数据
            //1.缓存到本地
            //2.转换到option中
            //3.绘图
            converseData(req, dataCache, 'current', false);
            transfer(dataCache, option, 'current');
            myChart.setOption(option);
        }
    }

    function renderBeforeLine(data) {
        var req = JSON.parse(data);
        if (req.status === 1) {
            //对比阶段的数据
            //直接缓存到本地既可
            converseData(req, dataCache, 'prev', false);
        }
    }

    function renderCurrentLineDaily(data) {
        var req = JSON.parse(data);
        if (req.status === 1) {
            //当前阶段的数据
            //1.缓存到本地
            //2.转换到option中
            //3.绘图
            converseData(req, dataCache, 'current', true);
            transfer(dataCache, option, 'current');
            myChart.setOption(option);
        }
    }

    function renderBeforeLineDaily(data) {
        var req = JSON.parse(data);
        if (req.status === 1) {
            converseData(req, dataCache, 'prev', true);
        }
    }
    function interactBefore() {
        //2.将请求的数据处理，缓存在页面
        //页面初始加载的时候，只需要请求今天的数据，所以只需要请求 今天的折线图数据
        // myAjax('GET', "/js/linechart/dataCurrent.json", true, renderCurrentLine);//今天的折线图数据
        // myAjax('GET', "/js/linechart/dataPrev.json", true, renderBeforeLine);//昨天的折线图数据
    }


    //初始化option完成
    initOption(config);
    // console.log(option);
    //1.初始化仓库完成
    initData(config, dataCache);
    // console.log(dataCache);
    //1.刚加载页面，请求数据，渲染页面，此时页面上渲染的是当天的数据(发送的是当天的请求)
    interactBefore();

    //总开关的对比按钮逻辑
    $('#compare_date').bind('change', function () {//比较单选框
        if ($('#compare_date').prop('checked')) {
            $('#compareDate').removeAttr('disabled');
        } else {
            $('#compareDate').attr('disabled', 'disabled');
            //为了保证对比时间总开关关闭的时候，不显示对比时间的折线图虚线
            if($("#timeControl1").prop("checked")) {
                $("#timeControl1").prop("checked",false);
                var compareTimedata = document.getElementById("myTimeControl").children[1];
                compareTimedata.style.opacity = 0.4;
                myChart.clear();
                option.series.pop();
                option.series.pop();
                //3.根据新的option重新渲染折线图
                myChart.setOption(option)
            }
        }
    });
    //3.绑定与用户的交互时间，对用户的不同交互做不同的展示。
    function render(config) {
        //1.创建自定义图例
        {
            var fragment = document.createDocumentFragment();
            var ulLegend = document.createElement("ul");
            var ulTimeControl = document.createElement("ul");
            ulLegend.id = "myLegend";
            var len = config.myLegend.length;
            for (var i = 0; i < len; i++) {
                var liLegend = document.createElement("li");
                var span = document.createElement("span");
                span.color = config.myLegendColor[i];
                span.checked = false;
                span.yeild = config.myLegend[i];//name
                span.field = config.myLegendId[i];//字段
                span.index = i;
                span.innerHTML = config.myLegend[i];
                liLegend.appendChild(span);
                ulLegend.appendChild(liLegend);
            }
        }
        //2.创建控制时间阶段的两个按钮
        {
            ulTimeControl.id = "myTimeControl";
            for (var i = 0; i < 2; i++) {
                var liTime = document.createElement("li");
                var span = document.createElement("span");
                //时间控制按钮的logo
                var spanIcon = document.createElement("div");
                span.innerHTML = dataCache.date[i];
                span.id = 'timeControl' + i;
                span.checked = false;
                spanIcon.id = 'timeIcon' + i;
                liTime.appendChild(spanIcon);
                liTime.appendChild(span);
                ulTimeControl.appendChild(liTime);
            }
            fragment.appendChild(ulLegend);
            fragment.appendChild(ulTimeControl);
            document.getElementById("line-container").appendChild(fragment);
        }
        //3.给每个自定义图例绑定点击事件
        //事件代理
        var lis = Array.prototype.slice.call(ulLegend.children);
        var spans = lis.map(function (v) {
            return v.children[0];
        })
        spans.clicked = [];
        //每个图例的点击逻辑
        document.getElementById('myLegend').onclick = function (ev) {
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if (target.nodeName.toLowerCase() === 'span') {
                //处理选中项目按钮显示的逻辑
                {
                    //获取点击前当前项的checked
                    var flag = target.checked;
                    //获取点击前所有项中选中的项
                    spans.clicked = spans.filter(function (v) {
                        return v['checked'] === true;
                    })
                    //如果当前项原本是选中的，并且所有项中只有一个选中项
                    //即如果当前项是所有项中的唯一选中项 退出本次点击事件
                    if (flag && spans.clicked.length === 1) {
                        return
                    }
                    //点击完成
                    target.checked = !target.checked;
                    //获取所有项中的选中项
                    spans.clicked = spans.clicked.filter(function (v) {
                        return v['checked'] === true;
                    })
                    //如果选中项的数量大于等于2，说明本次点击的项不能被选中
                    if (spans.clicked.length >= 2) {
                        // alert('filled');
                        layer.msg("最多可选2个指标");
                        //将本次点击事件取消
                        target.checked = false;
                        return
                    }
                }
                // 处理选中项目的字体的样式
                spans.forEach(function (v) {
                    if (v['checked']) {
                        v.style.color = 'white';
                        v.style.backgroundColor = v.color;
                    } else {
                        v.style.color = '#a6a6a6';
                        v.style.backgroundColor = "white";
                    }
                })
                //处理折线图
                if (target.checked) {
                    //显示点击对应的数据
                    option.legend.selected[target.yeild] = true;
                    option.yAxis[target.index]['show'] = true;
                    //摆放纵轴的位置
                    for (var l = 0; l < len; l++) {
                        if (option.yAxis[l]['position'] === 'left' && l !== target.index) {
                            option.yAxis[target.index]['position'] = 'right';
                            break;
                        } else {
                            option.yAxis[target.index]['position'] = 'left';
                        }
                    }
                    //处理切换项目时候对比日期图像的显示
                    {
                        var timeCompare = document.getElementById('timeControl1');
                        var tap = timeCompare.checked;
                        if (tap) {
                            //对比时间按钮打开
                            //获取当前选中项的field
                            myChart.clear();
                            var configCache = {};
                            for (var i = 0; i < config.myLegendId.length; i++) {
                                configCache[config.myLegendId[i]] = i;
                            }
                            option.series = objToArr(configCache, dataCache.currentDate);
                            var map = [];
                            spans.forEach(function (v) {
                                if (v['checked']) {
                                    map.push(v["field"]);
                                }
                            })
                            console.log(map);
                            if (map) {
                                for (var k in dataCache.prevDate) {
                                    for (var j = 0; j < map.length; j++) {
                                        if (k === map[j]) {
                                            var seriesTemplet = deepClone(config.seriesTemplet);
                                            seriesTemplet.name = dataCache.prevDate[k].name;
                                            seriesTemplet.data = dataCache.prevDate[k].data;
                                            seriesTemplet.yAxisIndex = dataCache.prevDate[k].yAxisIndex;
                                            seriesTemplet.lineStyle.normal.type = 'dotted';
                                            option.series.push(seriesTemplet);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    myChart.setOption(option);
                }
                else {
                    //显示点击对应的数据
                    myChart.clear();
                    console.log(target.yeild);
                    option.legend.selected[target.yeild] = false;
                    option.yAxis[target.index]['show'] = false;
                    for (var k = 0; k < len; k++) {
                        option.yAxis[k]['position'] = 'left';
                    }
                    myChart.setOption(option);
                }
            }
        }
        spans[0].click();
        spans[1].click();
        //4.给两个时间按钮绑定点击事件
        var compareTimedata = document.getElementById("myTimeControl").children[1];
        compareTimedata.style.opacity = 0.4;
        document.getElementById('myTimeControl').onclick = function (ev) {
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            //如果总开关没开，就不能显示对比日期
            if(!$("#compare_date").prop("checked")) {
                return
            }
            if (target.nodeName.toLowerCase() === 'span' && target.id === 'timeControl1') {
                target.checked = !target.checked;
                compareTimedata.style.opacity = 1;
                var map = [];
                //1.根据图例选中情况，获取选中的两项图例的标识,获取标识
                spans.forEach(function (v) {
                    if (v['checked'] === true) {
                        map.push(v.field);
                    }
                })
                //2.根据标识，去dataCache的过去数据中查找数据，插入option
                var len = map.length;
                if (target.checked) {
                    for (var k in dataCache.prevDate) {
                        for (var i = 0; i < len; i++) {
                            if (k === map[i]) {
                                var seriesTemplet = deepClone(config.seriesTemplet);
                                seriesTemplet.name = dataCache.prevDate[k].name;
                                seriesTemplet.data = dataCache.prevDate[k].data;
                                seriesTemplet.yAxisIndex = dataCache.prevDate[k].yAxisIndex;
                                seriesTemplet.lineStyle.normal.type = 'dotted';
                                seriesTemplet.lineStyle.normal.color = dataCache.prevDate[k].lineStyle.normal.color;
                                option.series.push(seriesTemplet);
                                //3.根据新的option重新渲染折线图
                                myChart.setOption(option);
                            }
                        }
                    }
                    // console.log(option);
                }
                else {
                    compareTimedata.style.opacity = 0.4;
                    myChart.clear();
                    option.series.pop();
                    option.series.pop();
                    //3.根据新的option重新渲染折线图
                    myChart.setOption(option)
                }

            }

            if (target.nodeName.toLowerCase() === 'span' && target.id === 'timeControl0') {
                console.log('当前时间控制显示');
            }
        }

    }

    render(config);

    window.onresize = myChart.resize;
