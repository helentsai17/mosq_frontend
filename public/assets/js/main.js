
// 風險顏色
var colors = [
    { "num": "0~9", "title": " 低風險", "color": "#fff" },
    { "num": "10~19", "title": " 中風險", "color": "#f8cc6b" },
    { "num": "20~29", "title": " 中高風險", "color": "#f19149" },
    { "num": "30~", "title": " 高風險", "color": "#fc4b4b" },
]

var colors_en = [
    { "num": "0~9", "title": " Low", "color": "#fff" },
    { "num": "10~19", "title": " Moderate", "color": "#f8cc6b" },
    { "num": "20~29", "title": " High", "color": "#f19149" },
    { "num": "30~", "title": " Critical", "color": "#fc4b4b" },
]


// d3 縮放 行為設定
var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scaleExtent([1, 10])
    .scale(1)
    .on("zoom", zoomed);

// d3 拖拉 行為設定
var drag = d3.behavior.drag()
    .on('dragstart', function (){
    })
    .on('drag', function () {
    })
    .on('dragend', function () {
    });




// target 是否在 view 內
function inView(view, target) {
    var view = $(view);
    var target = $(target);
    // setting 
    var cushion = 0.5; // 超過target 50% 面積就算出界  

    // data
    var view_positon = view.position();
    var view_rect = view[0].getBoundingClientRect();
    var view_h = view_rect.height;
    var view_w = view_rect.width;

    var target_positon = target.position();
    var target_rect = target[0].getBoundingClientRect();
    var target_h = target_rect.height;
    var target_w = target_rect.width;

    var view_info = {
        // view
        top: view_positon.top,
        left: view_positon.left,
        bottom: view_positon.top + view_h,
        right: view_positon.left + view_w,
    };
    var target_info = {
        // target
        top: target_positon.top,
        left: target_positon.left,
        bottom: target_positon.top + target_h,
        right: target_positon.left + target_w,
    };

    var in_border_status = {
        // 超邊界狀況 超出邊界/ 沒超出
        top: view_info.top - target_info.bottom > (-80) ? true : false,
        left: view_info.left - target_info.right > (-80) ? true : false,
        bottom: view_info.bottom - target_info.top < (80) ? true : false,
        right: view_info.right - target_info.left < (80) ? true : false,
    }

    
    if (in_border_status.top ||
        in_border_status.right ||
        in_border_status.bottom ||
        in_border_status.left
        ) {
        return {
            status: 'out',
            in_border_status
        };
    }
    else {
        return {
            status: 'in',
            in_border_status
        };
    }
}

// map 的 所有 el是否在 視野內
function mapElInView(mapEl) {
    var countries = $(mapEl).find('.country.detect-border');

    var is_country_in_view = {
        in_view: false, // 是否在視野內
        info: {} // 詳細資訊
    };

    
    
    countries.each(function (idx, country) {
        var in_view = inView(mapEl, country);
        if (in_view.status == 'in') {
            
            // in
            is_country_in_view.in_view = true
            return false;
        } else {
            // out
            is_country_in_view.in_view = false;
        }

        is_country_in_view.info = in_view.in_border_status;
    });

    return is_country_in_view;
}

 // 取得相對位置
function get_svg_relative_info(parentEl, childEl) {
    var parentPos = parentEl.getBoundingClientRect(),
        childPos = childEl.getBoundingClientRect(),
        relativePos = {};

    relativePos.top = childPos.top - parentPos.top,
        relativePos.right = childPos.right - parentPos.right,
        relativePos.bottom = childPos.bottom - parentPos.bottom,
        relativePos.left = childPos.left - parentPos.left;

    return relativePos;
}

// 取得要置中的 修正 位移量
function get_translate_alter(parentEl, childEl) {
    var relative_pos_info = get_svg_relative_info(parentEl, childEl)

    return {
        relative_pos_info: relative_pos_info,
        x: -(relative_pos_info.left + relative_pos_info.right) / 2,
        y: -(relative_pos_info.top + relative_pos_info.bottom) / 2
    }
}

// 地圖 大小
function map_resize(setting) {
    // element
    var map_wrap = setting['map_wrap'];
    var target = setting['resize_target'];
    var basis = setting['resize_basis'] || target;
    // data
    var scale_max = setting['scale_max'];
    var scale_min = setting['scale_min'];
    var zoom = setting['zoom'];
    // computed
    var map_wrap_w = map_wrap[0][0].getBoundingClientRect().width;
    var basis_w = basis[0][0].getBoundingClientRect().width;
    // 預設 map scale
    default_scale = map_wrap_w / basis_w;
    if (default_scale > scale_max) default_scale = scale_max;
    if (default_scale < scale_min) default_scale = scale_min;
    target
        .attr({
            transform: "scale(" + default_scale + ")"
        });

    // 更新zoom資料
    zoom.scaleExtent([0.5, 10])
        .scale(default_scale);
}

// 地圖置中
function map_center(setting) {
    var map_wrap = setting['map_wrap'];
    var target = setting['center_target'];
    var zoom = setting['zoom'];
    var translate_alter = get_translate_alter(map_wrap[0][0], target[0][0]);

    default_translate_x = translate_alter.x;
    default_translate_y = translate_alter.y;

    target
        .attr({
            transform: function (d) {
                return "scale(" + default_scale + ")" + " translate(" + default_translate_x + ", " + default_translate_y + ")";
            }
        })
        
    // 更新zoom資料
    zoom.translate([default_translate_x, default_translate_y]);
}


// D3 zoomed
function zoomed() {
    var container = this;
    // 紀錄 xy
    var x = d3.event.translate[0];
    var y = d3.event.translate[1];

    var map_el_in_view = mapElInView(container);
    // 拖拉方向
    var to_right = x > prev_x ? true:false;
    var to_left = x < prev_x ? true:false;
    var to_bottom = y > prev_y ? true:false;
    var to_top = y < prev_y ? true:false;

    // 能否拖拉
    var can_drag = false;
    if (
        map_el_in_view.info.left && to_right ||
        map_el_in_view.info.right && to_left ||
        map_el_in_view.info.top && to_bottom ||
        map_el_in_view.info.bottom && to_top
    ) {
        can_drag = true;
    }

    if (can_drag || map_el_in_view.in_view ) {
        // 可拖拉
        d3.selectAll('.country-wrap').attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    } else {
        return;
    }

    prev_x = x;
    prev_y = y;

}


/******************************************************************
    page lock
*******************************************************************/
function set_page_lock() {
    $('html, body').css({
        overflow: 'hidden',
    });
}

function set_page_release() {
    $('html, body').css({
        overflow: '',
    });
}

/******************************************************************
    resize
*******************************************************************/
function trigger_resize() {
    var resizeEvent = window.document.createEvent('UIEvents');
    resizeEvent.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(resizeEvent);
}

/******************************************************************
    mobile menu scroll bar 樣式
*******************************************************************/
function mobile_header_scrollbar() {
    var mobile_menu_list = $(".header .mobile-menu>ul");
    var lang = $('html').attr('lang');
    if (window.innerWidth < 992 || (window.innerWidth < 1200 && lang == 'en')) {
        mobile_menu_list.mCustomScrollbar({
            callbacks: {
                // 有scrollbar
                onOverflowY: function () {
                    mobile_menu_list.addClass('is-scrollbar-mode')
                },
                // 沒有scrollbar
                onOverflowYNone: function () {
                    mobile_menu_list.removeClass('is-scrollbar-mode')
                }
            }
        });
    } else {
        mobile_menu_list.mCustomScrollbar("destroy");
    }
}

$(function(){

    /*-----------------------------------------------------------------
        手機板地圖
    -----------------------------------------------------------------*/
    $('.country-wrap').on('touchmove',function(e){
        e.preventDefault();
    });

    /*-----------------------------------------------------------------
       使用者捲動偵測 On Scroll
    -----------------------------------------------------------------*/
    $(window).on('load scroll', function (e) {
        var top = $(window).scrollTop();
        if (top > 20) {
            $('body').addClass('scrolling');
        } else {
            $('body').removeClass('scrolling');
        }
    });

    /*-----------------------------------------------------------------
        menu buger
    -----------------------------------------------------------------*/
    mobile_menu = {
        el: {
            burger: $('.menu-trigger .burger'),
            menu: $('.header .mobile-menu')
        },
        data: {
            is_open: false
        },
        open: function(){
            this.el.burger.addClass('open');
            this.el.menu.addClass('is-open');
            this.data.is_open = true;
            set_page_lock();
        },
        close: function () {
            this.el.burger.removeClass('open');
            this.el.menu.removeClass('is-open');
            this.data.is_open = false;
            set_page_release();

        },
        init: function() {
            var that = this;
            this.el.burger.on('click',function(){
                if (that.data.is_open) {
                    that.close();
                } else {
                    that.open();
                }
            });
            
        },
        reset: function() {
            this.close();
            this.data.is_open = false;
        }
    }

    mobile_menu.init();

    $(window).on('resize', function () {
        var lang = $('html').attr('lang');

        if (window.innerWidth > 992 && lang !== 'en') {
            mobile_menu.close();
        } else if (window.innerWidth > 1200 && lang == 'en') {
            mobile_menu.close();
        }
    })

    /*-----------------------------------------------------------------
        mobile_header_scrollbar
    -----------------------------------------------------------------*/
    mobile_header_scrollbar();

    $(window).on('resize', function () {
        mobile_header_scrollbar();
    })


});
