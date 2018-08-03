;
(function ($) {
    var run = {
        export: {},
        init: function (obj, args) {
            run.fillCss(obj, args);
            run.fillHtml(obj, args);
            run.data(obj, args);
        },
        fillCss: function (obj, args) {
            var className = '.' + obj.attr('class');
            var style = '<style type="text/css">' +
                className + ' th,' + className + ' td {' +
                'display: inline-block;' +
                'width: ' + args.tdWidth + ';' +
                'height: ' + args.tdHeight + ';' +
                'line-height: ' + args.tdHeight + ';' +
                'margin: ' + args.tdMargin + ';' +
                'border: 1px solid;' +
                'border-color: ' + args.borderColor + ';' +
                'border-radius: ' + args.borderRadius + ';' +
                'color: ' + args.color + ';' +
                'text-align: center;' +
                'cursor: pointer;' +
                'user-select: none;' +
                '-webkit-user-select: none;' +
                '-moz-user-select: none;' +
                '-ms-user-select: none;' +
                '-o-user-select: none;' +
                '}' +
                className + ' th {' +
                'background: ' + args.thBackground + ';' +
                '}' +
                className + ' td[checked *= checked] {' +
                'background: ' + args.endBgcolor + ';' +
                '}' +
                '</style>';
            $('head').append(style);
        },
        fillHtml: function (obj, args) {
            var table = '<table>' +
                '<thead>' +
                '<tr>' +
                '<th>' + args.all + '</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody></tbody>' +
                '</table>';
            obj.append(table);
            var week = ['一', '二', '三', '四', '五', '六', '日'];
            for (var i = 0; i < args.tbodyWidth; i++) {
                obj.find('table thead tr').append('<th>' + i + '</th>');
            }
            for (var i = 0; i < args.tbodyHeight; i++) {
                obj.find('table tbody').append('<tr></tr>');
                for (var j = 0; j <= args.tbodyWidth; j++) {
                    if (j) {
                        obj.find('table tbody tr').eq(i).append('<td><input type="checkbox" style="display: none;" name="target_hours[' + (i + 1) + '][' + (j - 1) + ']" value="' + (j - 1) + '" /></td>');
                    } else {
                        obj.find('table tbody tr').eq(i).append('<td name="' + week[i] + '" style="background: ' + args.tdBackground + ';">' + week[i] + '</td>');
                    }
                }
            }
            run.all(obj, args);
            run.top(obj, args);
            run.left(obj, args);
            run.content(obj, args);
            obj.find('table td, table th').mouseup(function () {
                run.test(obj, args);
            });
        },
        all: function (obj, args) {
            var that = obj.find('table tbody tr td');
            obj.find('table thead tr th:first').mouseup(function () {
                $(this).attr('checked', false);
                $(this).siblings().attr('checked', false);
                that.attr('checked', false);
                that.children('input').attr('checked', false);
                that.parent().each(function () {
                    $(this).children().first().css({background: args.tdBackground});
                });
            });
        },
        top: function (obj, args) {
            var start, end;
            var $that = obj.find('table thead tr th');
            $that.each(function () {
                $(this).mousedown(function () {
                    start = $(this).index();
                }).mouseup(function () {
                    end = $(this).index();
                    if (start > end) {
                        var num = start;
                        start = end;
                        end = num;
                    }
                    if ($(this).index()) {
                        for (var i = start; i <= end; i++) {
                            var checked = $that.eq(i).attr('checked');
                            if (!checked) {
                                obj.find('table tbody tr').each(function () {
                                    $(this).children().eq(i).attr('checked', true).children('input').attr('checked', true).prop('checked', true);
                                });
                                $that.eq(i).attr('checked', true);
                            } else {
                                obj.find('table tbody tr').each(function () {
                                    $(this).children().eq(i).attr('checked', false).children('input').attr('checked', false);
                                });
                                $that.eq(i).attr('checked', false);
                            }
                        }
                    }
                });
            });
        },
        left: function (obj, args) {
            var start, end;
            var $that = obj.find('table tbody tr');
            $that.each(function () {
                $(this).find('td:first').mousedown(function () {
                    start = $(this).parent().index();
                }).mouseup(function () {
                    end = $(this).parent().index();
                    if (start > end) {
                        var num = start;
                        start = end;
                        end = num;
                    }
                    for (var i = start; i <= end; i++) {
                        var checked = $that.eq(i).find('td:first').attr('checked');
                        if (!checked) {
                            $that.eq(i).find('td:first').siblings().attr('checked', true).children('input').attr('checked', true).prop('checked', true);
                            $that.eq(i).find('td:first').attr('checked', true);
                        } else {
                            $that.eq(i).find('td:first').siblings().attr('checked', false).children('input').attr('checked', false);
                            $that.eq(i).find('td:first').attr('checked', false);
                        }
                    }
                });
            });
        },
        content: function (obj, args) {
            var startx, endx, starty, endy;
            var $that = obj.find('table tbody tr td:not([name])');
            $that.mousedown(function () {
                startx = $(this).index();
                starty = $(this).parent().index();
                $(this).css({background: args.overBgcolor});
            }).mouseup(function () {
                endx = $(this).index();
                endy = $(this).parent().index();
                var sx, ex, sy, ey;
                sx = Math.min(startx, endx);
                ex = Math.max(startx, endx);
                sy = Math.min(starty, endy);
                ey = Math.max(starty, endy);
                for (var i = sx; i <= ex; i++) {
                    for (var j = sy; j <= ey; j++) {
                        var that = obj.find('table tbody tr').eq(j).find('td');
                        var checked = that.eq(i).attr('checked');
                        if (!checked) {
                            that.eq(i).css({background: ''}).attr('checked', true).children('input').attr('checked', true).prop('checked', true);
                        } else {
                            that.eq(i).css({background: ''}).attr('checked', false).children('input').attr('checked', false);
                        }
                    }
                }
            });
        },
        test: function (obj, args) {
            var all = [];
            var xnum = [], ynum = [];
            var x = [], y = [];
            for (var i = 0; i <= args.tbodyHeight; i++) {
                x.push(1);
                all.push([])
            }
            for (var i = 0; i <= args.tbodyWidth; i++) {
                y.push(1);
            }
            for (var i = 0; i < args.tbodyHeight; i++) {
                $('table tbody tr').eq(i).children().each(function () {
                    if ($(this).index()) {
                        if ($(this).attr('checked')) {
                            xnum.push($(this).parent().index() + 1);
                            ynum.push($(this).index() - 1);
                            all[i].push($(this).index() - 1);
                        }
                    }
                });
                run.export[i + 1] = all[i]
            }
            //console.log(run.export);
            // left checked
            for (var i = 0; i < xnum.length; i++) {
                if (xnum[i] == xnum[i + 1]) {
                    for (var j = 1; j <= args.tbodyHeight; j++) {
                        if (xnum[i] == j) {
                            x[j]++;
                            if (x[j] == args.tbodyWidth) {
                                obj.find('table tbody tr').eq(j - 1).find('td:first').attr('checked', true);
                            } else {
                                obj.find('table tbody tr').eq(j - 1).find('td:first').attr('checked', false);
                            }
                        }
                    }
                }
            }

            // top checked

            ynum.sort();
            for (var i = 0; i < ynum.length; i++) {
                if (ynum[i] == ynum[i + 1]) {
                    for (var j = 1; j <= args.tbodyWidth; j++) {
                        if (ynum[i] == j - 1) {
                            y[j]++;
                            if (y[j] == args.tbodyHeight) {
                                obj.find('table thead tr th').eq(j).attr('checked', true);
                            } else {
                                obj.find('table thead tr th').eq(j).attr('checked', false);
                            }
                        }
                    }
                }
            }

            // all checked

			var thatx = obj.find('table tbody tr td[name]');
			var thaty = obj.find('table thead tr th');
			var checkedx = 0, checkedy = 0;
			thatx.each(function() {
				if ($(this).attr('checked')) {
					checkedx++;
					if (checkedx == args.tbodyHeight) {
						obj.find('table thead tr th:first').attr('checked', true);
					} else {
						obj.find('table thead tr th:first').attr('checked', false);
					}
				}
			});
			thaty.each(function() {
				if ($(this).attr('checked')) {
					checkedy++;
					if (checkedy == args.tbodyWidth + 1) {
						obj.find('table thead tr th:first').attr('checked', true);
					} else {
						obj.find('table thead tr th:first').attr('checked', false);
					}
				}
			});
		},
		data: function(obj, args) {
            if (args.data) {
                var dataObj = Object.keys(args.data);
                var num = dataObj[0] - 0;
                for (var i = num; i <= dataObj.length + num - 1; i++) {
                    for (var j = 0; j < args.data[i].length; j++) {
                        obj.find('tr').eq(dataObj[i - num]).find('td').eq(args.data[i][j] + 1).attr('checked', true).children('input').attr('checked', true);
                    }
                }
            }
		}
	};
	$.fn.timeSelectlist = function(options) {
		var args = $.extend({}, {
			tbodyWidth: 24,
			tbodyHeight: 7,
			startBgcolor: '#ffffff',
			endBgcolor: '#C81424',
			overBgcolor: '#FF9966',
			borderColor: '#cccccc',
			borderRadius: '4px',
			thBackground: '#f5f5f5',
			tdBackground: '#f5f5f5',
			color: '#555',
			tdWidth: '25px',
			tdHeight: '25px',
			tdMargin: '1px',
			all: 'del',
			data: {}
		}, options);
		run.init(this, args);
		return this;
	};
})(jQuery);