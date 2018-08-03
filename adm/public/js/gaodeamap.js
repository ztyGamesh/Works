/**
 * 高德地图相关js
 * Created by zhangxc on 15/3/12.
 */
//地图相关 jsvar mapObj, district, polygons=[], citycode, toolBar, mouseTool, contextMenu,editorTool,circle;
var mapObj, district, polygons=[], citycode,toolBar,mouseTool,scale;
var citySelect = document.getElementById('city');
var districtSelect = document.getElementById('district');
var areaSelect = document.getElementById('biz_area');
var provinceList = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省','黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省','河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市','四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾', '香港特别行政区', '澳门特别行政区'];
var provinceSelect = document.getElementById('province');
var content = '<option>--请选择--</option>';
for(var i =0, l = provinceList.length; i < l; i++){
    content += '<option value="'+provinceList[i]+'">'+provinceList[i]+'</option>';
    provinceSelect.innerHTML = content;
}
mapObj = new AMap.Map('mapContainer',{
    resizeEnable: true,
    layers: [
        new AMap.TileLayer()
    ]
});
mapObj.setCity('北京');
mapObj.setZoom(10);


//地图中添加地图操作ToolBar插件、鼠标工具MouseTool插件
mapObj.plugin(["AMap.ToolBar","AMap.MouseTool"], function(){
    toolBar = new AMap.ToolBar();
    mapObj.addControl(toolBar);
    mouseTool = new AMap.MouseTool(mapObj);
});
mapObj.plugin(["AMap.Scale"], function(){
    scale = new AMap.Scale();
    mapObj.addControl(scale);
});
function searchmap(elem){
//        alert(elem);
    var citySelect = document.getElementById('city');
    if("province" == $(elem).attr("id")){
        citySelect.innerHTML = provinceCity[$(elem).val()];
        $('#city').selectpicker('refresh');
    }

    mapObj.setCity($(elem).val());
}
$("#province").bind('onchange',function(){
    searchmap(1);
});
$("#city").bind('onchange',function(){
    searchmap(2);
});

var defaultCircleRadius = 5000;//单位 米
var circleArr = new Array();
var  markerArr = new  Array();

    var circleNum = 1;


//右键菜单添加Marker标记
function addMarkerMenu(){
    mouseTool.close();
    var marker = new AMap.Marker({
        map: mapObj,
        position: contextMenuPositon, //基点位置
        icon: "http://webapi.amap.com/images/marker_sprite.png", //marker图标，直接传递地址url
        offset: {x:-8,y:-34} //相对于基点的位置
    });
    contextMenu.close();
    drawCircle(circleNum);
    markerArr[circleNum] = marker;
    circleNum ++;
}
//自定义右键菜单内容
var menuContent = document.createElement("div");
menuContent.innerHTML = "<ul class='manulist' style='float:initial; margin: 2px; padding: 2px; list-style-type: none; position: relative; background-color: rgb(255, 255, 255); border: 1px solid rgb(175, 175, 175); border-top-left-radius: 3px; border-top-right-radius: 3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; box-shadow: rgb(153, 153, 153) 2px 2px 8px; white-space: nowrap; cursor: pointer;'>"+"<li class='manulist-li' style='float:initial; padding:0 4px; color:#333; font:12px/18px Arial; height: 20px;' onclick='addMarkerMenu()'>设置为中心点</li></ul>";

//创建右键菜单
contextMenu = new AMap.ContextMenu({isCustom:true,content:menuContent});//通过content自定义右键菜单内容

//地图绑定鼠标右击事件——弹出右键菜单
AMap.event.addListener(mapObj, 'rightclick', function(e){
    contextMenu.open(mapObj, e.lnglat);
    contextMenuPositon = e.lnglat; //右键菜单位置
});
contextMenu.close();



//圆数组

function drawCircle(circleNum){

    //console.log(contextMenuPositon);

    var  circle = new AMap.Circle({
        center:new AMap.LngLat(contextMenuPositon.lng,contextMenuPositon.lat),// 圆心位置
        radius:defaultCircleRadius, //半径
        strokeColor: "#4673cc", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线粗细度
        fillColor: "#a3b1cc", //填充颜色
        fillOpacity: 0.5//填充透明度
    });

    circle.setMap(mapObj);

//    获取圆的半径   editorTool.ca.Sc.radius
    var circleEditor;
//    添加圆编辑控件
    mapObj.plugin(["AMap.CircleEditor"], function() {
        editorToolSub = new AMap.CircleEditor(mapObj, circle);

    });
    mapObj.plugin(["AMap.CircleEditor"],function(){
        circleEditor = new AMap.CircleEditor(mapObj,circle);

        circleEditor.open();
    });

//        editorToolSub.open();
    //地理位置插件
    var lnglatXY = new AMap.LngLat(contextMenuPositon.lng,contextMenuPositon.lat);
    var MGeocoder;
    var addressInfo = "坐标：" + contextMenuPositon.lng + "-" + contextMenuPositon.lat;
    //加载地理编码插件
    AMap.service(["AMap.Geocoder"], function() {
        MGeocoder = new AMap.Geocoder({
            radius: defaultCircleRadius,
            extensions: "all"
        });
        //逆地理编码
        MGeocoder.getAddress(lnglatXY, function(status, result){

            if(status === 'complete' && result.info === 'OK'){
                addressInfo = result.regeocode.formattedAddress;
                $("#maplist tbody").append(
                    '<tr style="height: 32px;"><td>'+
                    '<input name="location[addressInfo][]" readonly class="map-set-name" value="'+addressInfo+'" title="'+addressInfo+'">'+
                    '</td><td>'+
                    '<input name="location[lng][]" readonly class="map-set-x" value="'+ contextMenuPositon.lng +'" title="'+ contextMenuPositon.lat +'">'+
                    '</td><td>'+
                    '<input name="location[lat][]" readonly class="map-set-y" value="'+ contextMenuPositon.lat +'" title="'+ contextMenuPositon.lat +'">'+
                    '</td><td>'+
                    '<input name="location[radius][]"  readonly  id="map'+ circleNum +'" class="map-set-z" value="'+defaultCircleRadius+'" title="'+defaultCircleRadius+'">'+
                    '</td><td style="text-align: center; cursor: pointer;">'+
                    '<button type="button" class="btn btn-danger btn-xs map-set-delete" circle-id="'+ circleNum +'" onclick="removeLocation(this);">删除</button></td></tr>'
                );
                showLocationTitle();
            }
        });
        AMap.event.addListener(circleEditor,'adjust',function(e){
            $("#map"+circleNum).val(e.radius);
        });
    });

    circleArr[circleNum] = circle;
    //监听调整圆


}
//删除定位数据
function removeLocation(elem){
    $(elem).parents('tr').remove();   //删除定位显示数据
    var circleId =  $(elem).attr('circle-id');
    if(circleId){
        circleArr[circleId].hide();  //隐藏圆
        markerArr[circleId].hide();  //隐藏中心点
    }


    showLocationTitle();
}

function showLocationTitle(){
    if($("#maplist tbody tr").children().length > 1){
        $('.map-set-list').show();
    }else{
        $('.map-set-list').hide();
    }
}

$(function() {
    showLocationTitle();
})