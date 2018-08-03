/**
 * 广告投放管理-添加投放
 */
$(function(){
	
    var $form = $('#formAdadd');
    
    // edit init form-select value
    if ( $form.find("#uid") ){
        var order_class = $form.find("#orderClass").val();
        var order_val = $form.find('#order').val();
        getGroupOrders( order_class, order_val );
        
        var adslot_site = $form.find('#adslotSite').val();
        var adslot_val = $form.find('#adslot').val();
        getSiteAdslots( adslot_site, adslot_val );
    }
    
	// load material-tree
    getMaterialTree( $("#order option:selected").val() );
	
	// order-group ganged order
	$('#orderClass').on('changed.bs.select', function(e){
		var group = $(this).val();
		getGroupOrders( group );
	});
    
    // order ganged material-list
    $('#order').on('changed.bs.select', function(e){
        var order = $(this).val();
        getMaterialTree( order );
    });
	
	// adslot-site ganged adslot
	$('#adslotSite').on('changed.bs.select', function(e){
		var site = $(this).val();
		getSiteAdslots( site );
	});

    // adtype ganged ex
    $('#divAdtype label.btn').click(function () {
        var val = $(this).find('input').val();
        if (val == 'client') {
            $('#divEx').hide();
        } else {
            $('#divEx').show();
        }
    });

    // ajax form submit
    $("#formAdadd").submit(function(){
        var $form = $(this);
        $form.validation();
        $form.ajaxSubmit({
            dataType:'json',
            beforeSubmit: function(){
                if (!$form.valid()) return false;
            },       
            success: function(txt){
//            	txt = $.parseJSON(txt);
                console.log( txt );
                if (txt.status != 1){
                    Comm.error( txt.msg );
                    return false;
                }
            	window.location.href = '/order/ad';
            }
        });
        return false;
    });
	
});

// 获取订单组关联订单列表
function getGroupOrders( group, val ) {
    $.getJSON('/order/getgrouporders', {group:group}, function(res){
        var html = '';
        $.each(res, function(i,v){
        	var selected = '';
        	if (val && val==i) {
        		selected = 'selected="selected"';
        	}
            html += '<option value="'+i+'" '+selected+'>'+v+'</option>';
        });
        $('#order').html(html);
        $('#order').selectpicker('refresh');
    });
}

// 获取站点关联广告位
function getSiteAdslots( site, val ) {
    $.getJSON('/order/getsiteadslots', {site:site}, function(res){
        var html = '';
        $.each(res, function(i,v){
        	var selected = '';
        	if (val && val==i) {
        		selected = 'selected="selected"';
        	}
            html += '<option value="'+i+'" '+selected+'>'+v+'</option>';
        });
        $('#adslot').html(html);
        $('#adslot').selectpicker('refresh');
    });
}

// 获取素材列表
function getMaterialTree( order ){
    $.get('/order/getmaterialtree',{order:order},function(html){
		$('.material-select-box #content').html( html );
	});
}

// show material detail
function materialDetial(obj) {
	var row = $(obj).find('#detailData').text();
//	console.log(row);
	$('#modalMaterialDetail').modal('show');
	
	row = $.parseJSON(row);
	var $view = $('#modalMaterialDetail');
	// use material 
	$view.find("#uid").val( row.uid );
	// view use
	$view.find("#title span").html(row.name +'('+row.nid+')');
	$view.find("#ext span").html(row.ext);
	$view.find("#size span:eq(0)").html(row.w);
	$view.find("#size span:eq(1)").html(row.h);
	
	if (row.ext == 'swf') {
		$view.find("#url span").html('<object height="'+row.h+'" width="'+row.w+'" wmode="transparent" data="'+row.url+'" type="application/x-shockwave-flash"><param value="high" name="quality"><param value="transparent" name="wmode"><param value="9.0.45.0" name="swfversion"></object>');
	} else {
		$view.find("#url span").html('<img src="'+row.url+'" width="'+row.w+'" height="'+row.h+'">');
	}
	
}

// use material to main
function useMaterialMain(){
	var uid = $("#modalMaterialDetail #uid").val();
	if (!uid) {
		Comm.error('参数错误！');
		return false;
	}
	var row = $('.material-list .child li[uid="'+uid+'"]').find("#detailData").html();
	row = $.parseJSON(row);
	console.log( row );
	var $form = $('#formAdadd');
	$form.find('input[name="material"]').val(row.uid);
	$form.find('input[name="w"]').val(row.w);
	$form.find('input[name="h"]').val(row.h);
	$form.find('#material_name').val(row.name);
	
	$('#modalMaterialDetail').modal('hide');
	$form.find('#material_name').focus();
}

// use material to second
function useMaterialSecond(){
	var uid = $("#modalMaterialDetail #uid").val();
	if (!uid) {
		Comm.error('参数错误！');
		return false;
	}
	var row = $('.material-list .child li[uid="'+uid+'"]').find("#detailData").html();
	row = $.parseJSON(row);
	console.log( row );
	var $form = $('#formAdadd');
	$form.find('input[name="mini_material"]').val(row.uid);
	$form.find('input[name="mini_w"]').val(row.w);
	$form.find('input[name="mini_h"]').val(row.h);
	$form.find('#mini_material_name').val(row.name)
	
	$('#modalMaterialDetail').modal('hide');
	$form.find('#mini_material_name').focus();
}

// clear material for selected
function clearMaterial() {
	var $form = $('#formAdadd');
	
	$form.find('input[name="material"]').val('');
	$form.find('input[name="w"]').val('');
	$form.find('input[name="h"]').val('');
	$form.find('#material_name').val('');
	
	$form.find('input[name^="mini"]').val('');
	$form.find('#mini_material_name').val('');
	
	$form.find('input[name="material"]').focus();
}



