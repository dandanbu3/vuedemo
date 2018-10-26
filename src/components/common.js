// 移动端访问判断
export function redirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = (/ipad/i).test(sUserAgent);
    var bIsIphone = (/iphone os/i).test(sUserAgent);
    var bIsMidp = (/midp/i).test(sUserAgent);
    var bIsUc7 = (/rv:1.2.3.4/i).test(sUserAgent);
    var bIsUc = (/ucweb/i).test(sUserAgent);
    var bIsCE = (/windows ce/i).test(sUserAgent);
    var bIsWM = (/windows mobile/i).test(sUserAgent);
    var bIsAndroid = (/android/i).test(sUserAgent);
    if (bIsIpad || bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM || bIsAndroid) {
        window.location.href = '//m.bilibili.com' + window.location.pathname;
    }
}

// 数字转换
export function transformFansNum(val) {
    if (val < 1e4) {
    } else if (val < 1e8) {
        val = (Math.round(val / 1e3) / 10) + '万';
    } else {
        val = (Math.round(val / 1e7) / 10) + '亿';
    }
    return val;
};

export function getCookieName(cookieName) {
    var theCookie = '' + document.cookie;
    var ind = theCookie.indexOf(cookieName + '=');
    if (ind === -1 || cookieName === '') {
        return '';
    }
    var ind1 = theCookie.indexOf(';', ind);
    if (ind1 === -1) {
        ind1 = theCookie.length;
    }
    return theCookie.substring(ind + cookieName.length + 1, ind1);
}

export const trimHttp = (url) => {
    return url ? url.replace(/^http:/, '') : '';
};

export const webp = (function() {
    try {
        return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
    } catch (err) {
        return false;
    }
})();

export const formatImg = (url, w, h) => {
    if (!url) {
        return url;
    }
    var suffix = url.match(/(.*\.(jpg|jpeg|gif|png|bmp))(\?.*)?/);
    // 路径是否包含/bfs/
    var isBfs = url.indexOf('/bfs/') !== -1;
    // 是否是GIF图片
    if (!suffix || suffix[2] === 'gif' || suffix[2] === 'bmp' || !isBfs) {
        return url;
    }
    // 裁剪规则
    var cut = (w && h) ? '@' + w + 'w_' + h + 'h' : '@';
    // 图片后参数 比如视频动态图
    var args = suffix[3] ? suffix[3] : '';
    if (webp) {
        return suffix[1] + cut + '.webp' + args;
    } else {
        return suffix[1] + cut + '.' + suffix[2] + args;
    }
};
