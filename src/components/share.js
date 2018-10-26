/* global $ */
/* eslint no-unused-vars: "off" */
import * as dao from '@/graphql/song.graphql';
const cookie = {
    get: function (cookieName) {
        var theCookie = '' + document.cookie;
        var ind = theCookie.indexOf(cookieName + '=');
        if (ind === -1 || cookieName === '') {
            return '';
        }
        var ind1 = theCookie.indexOf(';', ind);
        if (ind1 === -1) {
            ind1 = theCookie.length;
        }
        return unescape(theCookie.substring(ind + cookieName.length + 1, ind1));
    },
    set: function (name, value, days) {
        days = days !== undefined ? days : 365;
        var exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + '; path=/; domain=.bilibili.com';
    },
    delete: function (name) {
        this.set(name, '', -1);
    }
};

const shareParams = source => {
    // let t = new Date().getTime();
    // let buvid = cookie.get('buvid3') || '';
    return '?type=6'; // &share_medium=web&share_source=' + source + '&bbid=' + buvid + '&ts=' + t;
};

export default {
    openShareWindow: function(base, param) {
        var temp = [];
        for (var p in param) {
            if (param[p] != null) temp.push(p + '=' + encodeURIComponent(param[p]));
        }
        var _u = base + temp.join('&');
        window.open(_u, '', 'width=760, height=640, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
        return false;
    },
    bind: function(params, cb) {
        params = $.extend(true, {
            title: document.title,
            url: location.href,
            desc: '',
            pic: '',
            summary: '',
            shortTitle: '',
            searchPic: false,
            appkey: {
                weibo: '2841902482',
                qqweibo: '84435a83a11c484881aba8548c6e7340'
            },
            weiboTag: '',
            twitterTag: '',
            tp_id: 0,
            aid: ''
        }, params);

        let me = this;
        // let shared = false;
        $('.bili-share').off('click').on('click', function() {
            let id = $(this).attr('data-share-id');
            switch (id) {
                case 'weibo':
                    me.openShareWindow('http://service.weibo.com/share/share.php?', {
                        url: params.url + shareParams('weibo'),
                        type: '3',
                        count: '1',
                        /** 是否显示分享数，1显示(可选) */
                        appkey: params.appkey.weibo,
                        /** 您申请的应用appkey,显示分享来源(可选) */
                        title: params.title + params.weiboTag,
                        /** 分享的文字内容(可选，默认为所在页面的title) */
                        pic: params.pic,
                        /** 分享图片的路径(可选) */
                        searchPic: params.searchPic,
                        ralateUid: '',
                        /** 关联用户的UID，分享微博会@该用户(可选) */
                        language: 'zh_cn',
                        /** 设置语言，zh_cn|zh_tw(可选) */
                        rnd: new Date().valueOf()
                    });
                    if (!params.self.weiboStatus) {
                        dao[params.type]({sid: params.aid, type: 'share'}).then((data) => {
                            if (cb) {
                                cb(data.share);
                            }
                        });
                        params.self.weiboStatus = true;
                    }
                    break;
                case 'qzone':
                    me.openShareWindow('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?', {
                        url: params.url + shareParams('qqzone'),
                        showcount: 1,
                        desc: params.desc,
                        summary: params.summary,
                        title: params.shortTitle,
                        site: '哔哩哔哩',
                        pics: params.pic,
                        style: '203',
                        width: 98,
                        height: 22
                    });
                    if (!params.self.qqZoneStatus) {
                        dao[params.type]({sid: params.aid, type: 'share'}).then((data) => {
                            if (cb) {
                                cb(data.share);
                            }
                        });
                        params.self.qqZoneStatus = true;
                    }
                    break;
                case 'qq':
                    me.openShareWindow('http://connect.qq.com/widget/shareqq/index.html?', {
                        url: params.url + shareParams('qq'),
                        /* 获取URL，可加上来自分享到QQ标识，方便统计 */
                        desc: params.desc,
                        /* 分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔） */
                        title: params.title,
                        /* 分享标题(可选) */
                        summary: params.summary,
                        /* 分享摘要(可选) */
                        pics: params.pic,
                        /* 分享图片(可选) */
                        flash: '',
                        /* 视频地址(可选) */
                        site: '',
                        /* 分享来源(可选) 如：QQ分享 */
                        style: '201',
                        width: 32,
                        height: 32
                    });
                    if (!params.self.qqStatus) {
                        dao[params.type]({sid: params.aid, type: 'share'}).then((data) => {
                            if (cb) {
                                cb(data.share);
                            }
                        });
                        params.self.qqStatus = true;
                    }
                    break;
                case 'tieba':
                    me.openShareWindow('http://tieba.baidu.com/f/commit/share/openShareApi?', {
                        title: params.title,
                        url: params.url + shareParams('baidu') + '&sharechannel=baidu',
                        uid: 726865,
                        to: 'tieba',
                        type: 'text',
                        relateUid: '',
                        pic: params.pic,
                        key: '',
                        sign: 'on',
                        desc: '',
                        comment: params.desc
                    });
                    break;
                default:;
            }
        });
    },
    init: function(params, cb) {
        this.bind(params, cb);
    }
};
