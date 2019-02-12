// ==UserScript==
// @name         爱学习功能增强
// @namespace    http://52fisher.cn
// @version      1.2
// @description  修复爱学习翻页功能错误以及隐藏批注
// @author       fisher
// @include      https://bk.aixuexi.com/*
// @include      https://diy-courseware.aixuexi.com/*
// @updateURL    https://raw.githubusercontent.com/52fisher/aixuexiEnhance/master/aixuexiEnhance.user.js
// @downloadURL  https://raw.githubusercontent.com/52fisher/aixuexiEnhance/master/aixuexiEnhance.user.js
// @grant        GM_addStyle
// ==/UserScript==
GM_addStyle('.noborder{border: none!important;}.controller-pannel{background: #e03636;font-size: 20px;color: #eee;width: 50px;height: 50px;border-radius: 50px;text-align: center;vertical-align: middle;line-height: 50px;position: fixed;right: 35px;z-index: 999;bottom: 200px;cursor: default;}.controller-pannel:hover{background:#E55;}ul.controller-items{display: none;position: fixed;right: 30px;z-index: 999;bottom: 260px;}ul.controller-items>li{color: #eee;font-size: 12px;width: 50px;padding: 4px;background: #0b6e48;margin: 4px;cursor: default;}ul.controller-items>li:hover{background:#199475;}');
var axx = {};
axx.fixErrHref = function() {
    //检测DOM改变事件，修正无良程序员的jvascript尴尬事件。
    $('body').on('DOMSubtreeModified', function() {
        $('.page-bar a[href]').attr('href', "javascript:void(0);")
    })
    console.log("修复运行")
}
axx.hideComment = function() {
    //修正播放按钮
    $('.play_button.comment_btn').unbind().on('click', function() {
        console.log('隐藏批注生效')
        $(this).toggleClass('off')
        if ($(".play_button.comment_btn").hasClass('off')) {
            $('#comment').hide();
            $('#slide-box').css({
                'left': '15%'
            });
            $('#scene').css({
                'width': '100%'
            });
            return;
        }
        $('#comment').show();
        $('#scene').css({
            'width': 'auto'
        });
        $('#slide-box').css({
            'left': 855 - parseInt($('#comment').css('left')) + 'px'
        });
    })
}
axx.quickformat = function() {
    $('.lesson-head,.print-logo').toggle();
    $('.gutter-printdiy').toggleClass('noborder');
    $('br').remove();
}
axx.menu = function() {
    //讲义页面增强
    $('div.controller-pannel,ul.controller-items').remove()
    var list_mods = {
            'hideanswer': {
                data: 'hideanswer',
                hide: true,
                name: '答案控制',
                node: '.question-answer'
            },
            'quickformat': {
                data: 'quickformat',
                hide: null,
                name: '一键排版',
                node: ''
            },
            'hideComment': {
                data: 'hideComment',
                hide: null,
                name: '批注控制',
                node: ''
            },
            'menu': {
                data: 'menu',
                hide: true,
                name: '菜单控制',
                node: '.controller-pannel,.controller-items'
            }
        },
        lists_items = '';
    for (var i in list_mods) {
        lists_items += '<li data-node="' + list_mods[i].data + '">' + list_mods[i].name + '</li>';
    }
    $('body').append('<div class="controller-pannel">+</div>')
    $('.controller-pannel').after('<ul class="controller-items">' + lists_items + '</ul>');
    $('ul.controller-items>li').on('click', function() {
        try {
            var nodename = $(this).data('node');
            var hidenode = list_mods[nodename].node;
            list_mods[nodename].hide == true ? $(list_mods[nodename].node).toggle() : axx[nodename]();
        } catch (e) {
            console.log(e)
        }
    })
    $('body').on('click', '.controller-pannel', function() {
        $('ul.controller-items').stop().slideToggle()
    })
    //重新唤醒菜单 g键
    $(document).keydown(function(event) {
        if (event.keyCode == 71) {
            $(list_mods.menu.node).toggle()
        }
        //打印自动隐藏菜单
        if (even.ctrlKey && event.keyCode == 80) {
            $(list_mods.menu.node).hide()
        }
    });
}
axx.fixErrHref()
axx.menu()