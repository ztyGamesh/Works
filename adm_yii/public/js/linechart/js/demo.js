/**
 * Created by zhengtianyang on 2017/5/10.
 */
// 图标中图例初始化函数
function render(arr) {
    //创建自定义图例
    var fragment = document.createDocumentFragment();
    var ul = document.createElement('ul');
    ul.id = 'data-list';
    var len = arr.length;
    arr.forEach(function (v, i) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'item';
        a.innerHTML = v;
        a.title = v;
        a.index = i;
        if (i === len - 1) {
            li.style.borderRight = '0';
        }
        li.appendChild(a);
        ul.appendChild(li);
    })
    fragment.appendChild(ul);
    document.getElementById('admEchart').appendChild(fragment);
    //创建自定义时间展示块
    var timeModule = document.createDocumentFragment();
    var div = document.createElement('div');
    //自定义时间图例
    var fragmentTime = document.createDocumentFragment();
    var ulTime = document.createElement('ul');
    ulTime.className = 'timeModule';
    for (var t = 0; t < 2; t++) {
        var liTimeItem = document.createElement('li');
        //增加图例项目
        var legendLogo = document.createElement('div');
        liTimeItem.appendChild(legendLogo);
        //---//
        var liTimeText = document.createTextNode(dataCharts.data[t]);
        liTimeItem.appendChild(liTimeText);
        ulTime.appendChild(liTimeItem);
    }
    ulTime.children[0].children[0].className = 'legendLeft';
    ulTime.children[1].children[0].className = 'legendRightF';
    ulTime.children[1]['id'] = 'timeCompare';
    ulTime.children[1]['checked'] = false;
    fragmentTime.appendChild(ulTime);
    document.getElementById('admEchart').appendChild(fragmentTime);
//        console.log(fragmentTime);
    var timeCompare = document.getElementById('timeCompare');
    //日期对比的控制
    timeCompare.addEventListener('click', function () {
        this['checked'] = !this['checked'];
        var searchArr = [];
        if (this['checked'] === true) {
            this.children[0].className = 'legendRightB';
            this.style.opacity = 0.6;
            items.forEach(function (v) {
                if (v['checked'] === true) {
                    searchArr.push(v.children[0]['title']);
                }
            })
//                console.log(searchArr);
            for (var i = 0; i < dataCharts.prevData.length; i++) {
                for (var j = 0; j < searchArr.length; j++) {
                    if (dataCharts.prevData[i]['name'] === searchArr[j]) {
                        option.series.push(dataCharts.prevData[i]);
                    }
                }
            }
            myChart.setOption(option);
        } else if (this['checked'] === false) {
            this.style.opacity = 1;
            this.children[0].className = 'legendRightF';
            myChart.clear();
            option.series.pop();
            option.series.pop();
            myChart.setOption(option);
//                console.log(option.series);
        }

//            console.log(this['checked']);
    })
    // 绑定点击事件
//        console.log(ul)
    var items = Array.prototype.slice.call(ul.children);
    items.temp = [];
    //颜色数组
    var colorArr = ['red', 'blue', 'orange', 'purple', 'pink', 'yellow'];
    items.forEach(function (v, i) {
        v['checked'] = false;
        // 给每个点击项固定一个颜色
        for (var j = 0; j < colorArr.length; j++) {
            if (j === i) {
                v['color'] = colorArr[j];
            }
        }
        //给每个项添加点击事件
        v.addEventListener('click', function () {
            var flag = this.checked;
            items.temp = items.filter(function (v) {
                return v['checked'] === true;
            })
            if (flag && items.temp.length === 1) {
                return
            }
            this.checked = !this.checked;
            items.temp = items.filter(function (v) {
                return v['checked'] === true;
            })
            if (items.temp.length > 2) {
                alert('filled');
                this.checked = false;
                return
            }

            // 处理选中项目的字体为白色
            items.forEach(function (v) {
                if (v['checked'] === true) {
                    v.children[0].style.color = 'white';
                } else {
                    v.children[0].style.color = '#ccc';
                }
            })
            //  处理颜色
            // 怎样判断一个按钮是否被点击
//                var that = null;

            //异步加载数据
            //用定时器模仿ajax
            if (this['checked']) {
                this.className = this['color'];
                var title = this.children[0].title;
                var index = this.children[0].index;
                var timeController = document.getElementById('timeCompare');
                if (timeController.checked === true) {
                    option.series.pop();
                    option.series.pop();
                    myChart.clear();
                    option.series = dataCharts.currentData;
                    var searchArr = [];
                    items.forEach(function (v) {
                        if (v['checked'] === true) {
//                                console.log(v.children[0]['title']);
                            searchArr.push(v.children[0]['title']);
                        }
                    })
                }
                console.log(searchArr);
                if (searchArr) {
                    for (var i = 0; i < dataCharts.prevData.length; i++) {
                        for (var j = 0; j < searchArr.length; j++) {
                            if (dataCharts.prevData[i]['name'] === searchArr[j]) {
//                                    console.log(dataCharts.prevData[i]);
                                option.series.push(dataCharts.prevData[i]);
                            }
                        }
                    }
                }

                setTimeout(function () {
//                        myChart.clear();
                    //显示点击对应的数据
                    option.legend.selected[title] = true;
                    //显示点击对应数据的纵坐标轴
                    option.yAxis[index]['show'] = true;
                    // 如果
                    for (var l = 0; l < arr.length; l++) {
                        if (option.yAxis[l]['position'] === 'left' && l !== index) {
                            option.yAxis[index]['position'] = 'right';
                            break;
                        } else {
                            option.yAxis[index]['position'] = 'left';
                        }
                    }
                    myChart.setOption(option);
                }, 0)
            } else {
                this.className = '';
                var title = this.children[0].title;
                var index = this.children[0].index;
                setTimeout(function () {
                    option.legend.selected[title] = false;
                    option.yAxis[index]['show'] = false;
                    for (var k = 0; k < arr.length; k++) {
                        option.yAxis[k]['position'] = 'left';
                    }
                    myChart.setOption(option);
                }, 0)
            }


        })
    });
    items[0].click();
    items[1].click();
}