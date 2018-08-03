/**
 * common report.js for report-page
 * must be report-page load this file
 * @demo:  
 *  var PageConfig = {
 *  }
 *  var TotalConfig = {
 *  }
 * @param {type} params
 */

/**
 * set bootstrap-table query params
 */
function queryParams(params){
    // bootstrap-table defualt toolbar
    $('#toolbar').find('input, select').each(function(){
        params[$(this).attr('name')] = $(this).val();
    });
    // if has custom-toolbar
    $('#custom-toolbar').find('input,select').each(function(){
        if ( $(this).attr('name') != undefined ) {
            params[$(this).attr('name')] = $(this).val();
        }
    });
    return params;

}

/**
 * 将array的json数据，写成html-select代码
 */
function setHtmlSelect(obj, list, def) {
    var html = '<option value="">全部</option>';
    $.each(list, function(k,v){
        var selected = '';
        if (def && def==k) {
            selected = 'selected="selected"';
        }
        html += '<option value="'+k+'" '+selected+'>'+v+'</option>';
    });
    $(obj).html(html);
    $(obj).selectpicker('refresh');
}

var  List = {
    $table: null,
    addHtml: '',
    editValidate: false,
    editableRow: '',
    editableIndex: '',
    modifyUid: '',
    cacheSeries: null,
    cacheChart  :   null,
    init : function(){
        //显示列表
        this.$table = $(PageConfig.tableId);
        this.$table.bootstrapTable(PageConfig.table);
//        this.buildTable(this.$table, 18, 25, PageConfig.table.columns);
        
        //显示sum和chart
        this.tableTotal();

        //初始化工具栏和多选功能
        this.toolbar();

        this.multiAction();
        this.toggleChart();
    },
        
    //列表多项操作
    multiAction:function(){
        this.$table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function() {
            $('#dropdown').prop('disabled', !$table.bootstrapTable('getSelections').length);
        });
    
        // export report
        var toolbar = PageConfig.toolbar;
        if ( toolbar && toolbar.export != undefined ) {            
            $(toolbar.export.id).click(function(){
                var params = queryParams( {} );
                var query = ''
                $.each(params, function(i,v){
                    query += '&' + i + '=' + v;
                });
                window.location = toolbar.export.url +'?'+query;
//                $.get(toolbar.export.url, params, function(res) {
//                });
            });
        }
        
    },
        
    //获取已选数据uid
    getIdSelections:function(){
        return $.map(List.$table.bootstrapTable('getSelections'), function(row) {
            return row[PageConfig.tableIndexCol];
        });
    },
        
    //工具栏
    toolbar:function(){
        // init value
        var value = PageConfig.toolbar.value;
        if (value != undefined) {
            var id = value.id;
            $.getJSON(value.url, {}, function(res){
                // default value
                for (var i=0; i < id.length; i++) {
                    setHtmlSelect(id[i], res[i]);
                }
            });
        }
        // bind ganged event
        var ganged = PageConfig.toolbar.ganged;
        if (ganged != undefined) {
            $.each(ganged, function(i,v){
                $(v.id).on('changed.bs.select', function(e){
                    var val = $(this).val();
                    $.getJSON(v.url, {uid:val}, function(res){
                        setHtmlSelect(v.gang, res, val);
                    });
                });
            });
        }
        
        $('#ok').click(function() {
            List.$table.bootstrapTable('refresh');
        });
        $('#custom-toolbar #btnSub').click(function(){
            Comm.loading();
            List.$table.bootstrapTable('refresh');
            
            List.tableTotal();
        });
    },
        
    // total table-sum and table-chart
    tableTotal: function() {
        var url = TotalConfig.url;
        if (url != undefined) {
            var params = queryParams( {} );
    //        console.log( params );
            $.getJSON(url, params, function(res) {
                var  firstKey   =   null;
                // table-sum
                if (res.sum) {
                    var html = '<table class="table table-bordered"><tr>';
                    $.each(res.sum, function(i,v){
                        if(null === firstKey){
                            firstKey    =   i;
                        }
                        html += '<td class="stat"   data-key="'+i+'"><div class="title">'+v[0]+'</div><div class="data"><span class="number">'+(v[1]?v[1]:0)+'</span></div></td>';
                    });
                    html += '</tr></table>';
                    $(TotalConfig.sumId).html( html );
                }

                //判断数据的维度数量,只有一级就直接显示,多级数据
                // table-echart
                if (res.chart) {
                    if(undefined == res.type){
                        List.showEChart(TotalConfig.chartId, res.chart);
                    }else{
                        // 如果 一维的数据里面就有data  则 认为是一维的图,故,有个hack 多维数据不能以data 为键值,先这样,回头处理
                        if( 'line' == res.type){
                            List.showEChart(TotalConfig.chartId, res.chart);
                        }else if(res.chart.series && res.chart.series.data){
                            List.showEChart(TotalConfig.chartId, res.chart);
                        }else{
                            //缓存数据
                            List.cacheSeries    =  res.chart.series;
                            List.cacheChart     =  res.chart ;
                            res.chart.series    =  res.chart.series[firstKey];
                            List.showEChart(TotalConfig.chartId, res.chart);
                        }
                    }


                }
            
            });
        }
    },

    // show echart
    showEChart: function( id, option ) {

        //如果是饼图,只取前二十个
        if(option.series && undefined != option.series.type &&  'pie' == option.series.type){
            option.series.data = option.series.data.slice(0,20);
        }
        var myChart = echarts.init(document.getElementById(id), 'macarons');
        var chart = $.extend(TotalConfig.chart, option);
//        console.log( chart );
        myChart.setOption(chart);
        Comm.hideLoading();
    },
        
    buildTable: function($el, cells, rows, columns) {
        var i, j, row,
//                columns = [],
                data = [];
//        for (i = 0; i < cells; i++) {
//            columns.push({
//                field: 'field' + i,
//                title: 'Cell' + i,
//                sortable: true
//            });
//        }
        for (i = 0; i < rows; i++) {
            row = {};
            for (j = 0; j < cells; j++) {
                row['field' + j] = 'Row-' + i + '-' + j;
            }
            data.push(row);
        }
//        console.log( data );
        $el.bootstrapTable('destroy').bootstrapTable({
            columns: columns,
            data: data,
            search: true,
            toolbar: '.toolbar',
            fixedColumns: true,
            fixedNumber: +1
        });
    },
    toggleChart:function(key){
        $('#table-sum ').on('click','.stat',function(){
            if(!List.cacheChart || !List.cacheSeries){
                return false;
            }
            var key         =   $(this).attr('data-key');
            var showSeries  =   List.cacheSeries[key] ;
            List.cacheChart.series  =   showSeries;
            List.showEChart(TotalConfig.chartId, List.cacheChart);

        });
    }
    // buildTable: function($el, url) {
    //     var url = 'json/' + url + '.json';
    //     $el.bootstrapTable({
    //         url: url,
    //         columns: [{
    //             field: 'city',
    //             title: '城市'
    //         }]
    //     });
    // }

};

$(function() {
    List.init();
});
