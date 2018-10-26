<template>
    <div>
        <div class="container contain-div">
            <div class="row">
                <div class="gridview-content-container">
                    <div class="row">
                        <div class="col-6-med col-5">
                            <div>
                                <div><img class="song-img" :src="trimHttp(formatImg(cover, 370, 370))"></div>
                                <div class="song-intro">简介</div>
                                <div class="song-content" :class="introFoldStatus ? 'song-fold': ''">
                                    <div id="content-span" class="content-span">{{intro}}</div>
                                </div>
                                <div v-if="showIntroFoldStatus" class="song-introText" :class="introFoldStatus ? '' : ''" @click="introFoldChange">{{introFoldText}}</div>
                                <div v-if="isPGC !== '1'" class="song-type">
                                    <span class="song-type-title">歌曲分类：</span>
                                    <span>{{songType.join('、')}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-9-med col-7">
                            <div class="song-padding">
                                <div class="song-gap">
                                    <div class="song-title report-wrap-module" :title="title" id="song_detail_click_video_entrance">
                                        <a v-if="activityInfo.id" class="activity-sybowl" :href="'//' + activityInfo.url" target="_blank">活动作品</a>
                                        {{title}}
                                        <a v-if="avid && !isVideo" :href="'https://www.bilibili.com/video/av'+ avid" target="_blank">
                                            <i class="iconfont font24">&#xe60b;</i>
                                        </a>
                                    </div>
                                    <div class="song-time">&nbsp;&nbsp;&nbsp;&nbsp;<span @click="showComplain">稿件投诉</span></div>
                                    <div class="song-play-num">播放数&nbsp;&nbsp;<span>{{transformPlayNum}}</span></div>
                                    <div class="song-info" :class="infoFoldStatus ? 'song-infoStatus': ''">
                                        <div class="song-info-content" id="song-info-content">
                                            <div class="song-info-div" v-for="(memberList, sort) in songMember" :key="sort">
                                                <div class="song-info-theme">{{memberList.name}}&nbsp;&nbsp;</div>
                                                <div>
                                                    <span v-for="(member, index) in memberList.value" :key="index" class="song-info-detail">
                                                        <span>{{index ? '/' : ''}}</span><!--
                                                        --><a v-if="member.mid" title="UP主" :href="`https://space.bilibili.com/${member.mid}/#/audio`" target="_blank">{{member.name}}</a>
                                                        <span v-else>{{member.name}}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="showInfoFoldStatus" class="song-infoFold" @click="infoFoldChange">{{infoFoldText}}</div>
                                </div>
                                <div class="share-board">
                                    <div class="song-playbtn" @click="songPlay">
                                        <i class="iconfont" v-if="!playcurrentstatus">&#xe610;</i>
                                        <!-- <i v-else class="iconfont">&#xe60d;</i>-->
                                        <span class="song-play">立即播放</span>
                                    </div>
                                    <span @click="payCoin" class="song-share">
                                        <i :class="paycoinnumber ? 'font-blue' : ''" class="iconfont font24">&#xe62b;</i>
                                        <div>{{coinNum > 0 ? transformCoinNum : '投币'}}</div>
                                    </span>
                                    <span v-if="isPGC !== '1'" @click="colloctSong" class="song-share">
                                        <i :class="songcollect ? 'font-blue' : ''" class="iconfont font24">&#xe60a;</i>
                                        <div>{{collectNum > 0 ? transformCollectNum : '收藏'}}</div>
                                    </span>
                                    <span class="song-share" @click="goToComment">
                                        <i class="iconfont font24">&#xe609;</i>
                                        <div>{{commentNum > 0 ? transformCommentNum : '评论'}}</div>
                                    </span>
                                    <span class="song-share" @click="openDialog">
                                        <i class="iconfont font24">&#xe60e;</i>
                                        <div>{{shareNum > 0 ? transformShareNum : '分享'}}</div>
                                    </span>
                                    <div class="share-btn" v-show="shareDialogStatus">
                                        <div class="share-type">分享至站外<i class="iconfont close" @click="closeDialog">&#xe61a;</i></div>
                                        <ul class="clearfix">
                                            <li class="bili-share" data-share-id="weibo" title="分享到新浪微博">
                                                <i class="iconfont font44 sina">&#xe618;</i>
                                                <div>微博</div>
                                            </li>
                                            <li class="bili-share" data-share-id="weixin" title="分享到微信">
                                                <i @mouseenter="showQRCode" @mouseleave="hideQRCode" class="iconfont font44 wechat">&#xe617;</i>
                                                <div>微信</div>
                                            </li>
                                            <li class="bili-share" data-share-id="qzone" title="分享到QQ空间" >
                                                <i class="iconfont font44 qzone">&#xe613;</i>
                                                <div>QQ空间</div>
                                            </li>
                                            <li class="bili-share" data-share-id="qq" title="分享到QQ">
                                                <i class="iconfont font44 qq">&#xe614;</i>
                                                <div>QQ</div>
                                            </li>
                                            <li class="bili-share" title="复制链接" @click="copyHref">
                                                <i class="iconfont font44 link">&#xe615;</i>
                                                <div>复制链接</div>
                                            </li>
                                            <!-- <li class="icon share-icon baidu bili-share" data-share-id="tieba" title="分享到百度贴吧"  :report-id="'share_tieba'">baidu</li> -->
                                            <input :value="avLink" class="copyText" id="inputText">
                                            <canvas v-show="qrcodeStatus" class="song-qrcode" id="canvas"></canvas>
                                        </ul>
                                        <div class="share-type song-border">分享至站内</div>
                                        <ul class="clearfix">
                                            <li class="bili-share" data-share-id="dynamic" title="分享到动态" @click="showDynmicShare">
                                                <i class="iconfont font44 dynamic">&#xe616;</i>
                                                <div>动态</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="song-intro">歌词</div>
                                <div v-if="showLrcFoldStatus" class="song-lrcFold" @click="lrcFoldChange">{{lrcText}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-if="activityInfo.id">
                        <div class="activity-wrap">
                            <div class="activity-left">
                                <div class="l-inside">
                                    <div class="hinter-msg" :class="activityInfo.ifEnd ? 'act-end' : 'act-start'">
                                        <b class="text" v-if="!activityInfo.ifEnd">本稿件参加过[{{activityInfo.name}}]</b>
                                        <b class="text" v-else>本稿件参加过[{{activityInfo.name}}]，活动已结束~</b>
                                    </div>
                                    <div v-if="!activityInfo.ifEnd" class="b-btn-praise" @click="voteActivityFunc" :class="activityInfo.ifVoted ? 'voted-btn' : ''">点击投票</div>
                                </div>
                            </div>
                            <div class="activity-right">
                                <a class="inside-bg" target="_blank" :class="activityInfo.ifEnd ? 'end-act' : false"
                                    :href="formatUrl(activityInfo.url)"
                                    :style="{backgroundImage: 'url(' + activityInfo.cover.replace(/http\:/, '') + ')'}">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="gridview-sidebar">
                    <div class="row">
                        <div class="col-4-med col-4">
                            <HotSong :tableData="hotSongList" :tableTotal="hotSongTotal" :currentPage="hotSongPage" :showStatus="showHotSongStatus" @changeParent="changeInfo"/>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="showGoTopStatus || animationStatus" class="song-scroll" @click="goTop"></div>
            <div v-show="complainStatus" class="song-complain-bg">
                <div class="song-complain">
                    <div class="complain-title">稿件投诉<i class="iconfont close-btn" @click="hideComplain">&#xe61a;</i></div>
                    <div class="complain-text">请将你的反馈以邮件形式发送至audio@bilibili.com，我们将尽快处理！</div>
                    <div class="complain-btn" @click="hideComplain">知道了</div>
                </div>
            </div>
            <div v-if="showCoinBoardStatus" class="song-coin-bg">
                <div class="song-coin">
                    <i class="iconfont song-coin-close" @click="closeCoinBoard">&#xe61a;</i>
                    <div class="song-coin-title">给UP主投上 <span class="song-coin-number">{{selectOneCoin ? '1' : '2'}}</span> 个硬币</div>
                    <div class="song-coin-content">
                        <div class="song-one-coin" :class="selectOneCoin ? 'active' : ''" @click="selectCoinNumber(true)"><div class="song-coin-text">1硬币</div></div>
                        <div v-if="showTwoCoinChoice" class="song-two-coin" :class="!selectOneCoin ? 'active' : ''" @click="selectCoinNumber(false)"><div class="song-coin-text">2硬币</div></div>
                    </div>
                    <div class="song-coin-btn" @click="submitCoin">确认投币</div>
                    <div v-if="coinExp !== 50" class="song-coin-exp">经验值+<span>{{selectOneCoin ? '10' : '20'}}</span>（今日<span>{{coinExp}}</span>/50）</div>
                    <div v-else class="song-coin-exp">今日投币+50经验成就get√赞！</div>
                </div>
            </div>
            <div class="follow-up-toast" v-show="followupToastStatus">
                <i class="iconfont close-toast">&#xe61a;</i>
                <div>投币成功！感谢您的支持～</div>
                <div class="follow-up-font">关注该UP主，第一时间知道TA的最新投稿</div>
                <div class="follow-up-btn" @click="followUp">关注</div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
/* global $, followGroupDialog */
/* eslint new-cap: ["error", { "newIsCap": false, "properties": false }] */
/* eslint no-unused-vars: "off" */
import biliShare from 'components/share';
import HotSong from 'components/index/HotSong';
import {showToast} from 'components/toast';
import {redirect, transformFansNum, getCookieName, formatImg, trimHttp} from 'components/common';
import gql from 'graphql-tag';
import * as dao from '@/graphql/song.graphql';
export default {
    name: 'Song',
    data () {
        return {
            lrcList: ['歌词载入中...'],
            lrcFoldStatus: true,
            showLrcFoldStatus: false,
            lrcText: '展开更多',
            shareDialogStatus: false,
            qrcodeStatus: false,
            infoFoldStatus: true,
            showInfoFoldStatus: false,
            infoFoldText: '展开更多',
            showIntroFoldStatus: false,
            introFoldStatus: true,
            introFoldText: '展开更多',
            songId: '',
            author: '',
            cover: '',
            intro: '',
            lyric: '',
            title: '',
            showGoTopStatus: false,
            songType: [],
            songMember: [],
            passTime: 0,
            serverTime: 0,
            avid: '',
            cid: '',
            avLink: '',
            complainStatus: false,
            collectNum: 0,
            commentNum: 0,
            shareNum: 0,
            coinNum: 0,
            playNum: 0,
            musicType: '',
            // 热门歌曲
            hotSongList: [],
            hotSongPage: 1,
            hotSongTotal: 0,
            showHotSongStatus: false,
            // 歌单推荐
            componentType: 'includeList',
            recommendList: [],
            recommendPage: 1,
            recommendTotal: 0,
            showIncludeStatus: false,
            // 关注
            upintro: '',
            fanNum: null,
            listenerNum: null,
            followFoldStatus: true,
            showFollowFold: false,
            showFollowStatus: true,
            upcover: '',
            isOff: '',
            isLock: '',
            isDel: '',
            isVideo: '',
            isPGC: '',
            animationStatus: false,
            errorStatus: false,
            weiboStatus: false,
            wxStatus: false,
            qqZoneStatus: false,
            qqStatus: false,
            linkStatus: false,
            showDynamicStatus: false,
            PGCType: null,
            appString: '',
            // 活动信息
            activityInfo: {
                // 活动ID
                id: 0,
                // 活动名称
                name: '',
                // 活动是否结束
                ifEnd: false,
                // 参加的活动url
                url: '',
                // 是否已经投过票
                ifVoted: false,
                // 稿件ID（投票时需要）
                copyId: 0,
                // 活动背景
                cover: ''
            },
            includeAlbumObj: {
                cover: '',
                menuId: '',
                title: '',
                snum: '',
                statistic: {
                    play: 0,
                    collect: 0,
                    comment: 0,
                    share: 0
                }
            }, // 所属合辑
            showCoinBoardStatus: false,
            selectOneCoin: false,
            coinExp: 0,
            followupToastStatus: false,
            showTwoCoinChoice: true,
            similarInfo: {
                list: [],
                cover: '',
            },
            formatImg,
            trimHttp,
            upuid: '',
            upname: '',
            songcollect: '',
            playcurrentstatus: '',
            followstatus: '',
            paycoinnumber: '',
        };
    },
    components: {
        HotSong,
    },
    watch: {
        '$route' (to, from) {
            // 对路由变化作出响应...
            this.init();
        }
    },
    created () {
    },
    mounted () {
        this.init();
        window.addEventListener('scroll', this.scrollFunction);
        // document.body.onscroll = this.scrollFunction;
        if (location.search) {
            var searchURL = location.search;
            searchURL = searchURL.substring(1, searchURL.length);
            var hideStatus = searchURL.split('&')[0];
        }
    },
    destroyed() {
        window.removeEventListener('scroll', this.scrollFunction);
    },
    computed: {
        transformPlayNum() {
            return transformFansNum(this.playNum);
        },
        transformCollectNum() {
            return transformFansNum(this.collectNum);
        },
        transformCommentNum() {
            return transformFansNum(this.commentNum);
        },
        transformShareNum() {
            return transformFansNum(this.shareNum);
        },
        transformCoinNum() {
            return transformFansNum(this.coinNum);
        }
    },
    filters: {
        transFormNum: function(val) {
            return transformFansNum(val);
        }
    },
    methods: {
        init() {
            redirect();
            this.showIntroFoldStatus = false;
            this.showLrcFoldStatus = false;
            this.showInfoFoldStatus = false;
            this.showFollowFold = false;
            this.showHotSongStatus = false;
            this.showIncludeStatus = false;
            this.showFollowStatus = true;
            this.shareDialogStatus = false;
            this.complainStatus = false;
            this.showGoTopStatus = false;
            this.qrcodeStatus = false;
            this.lrcFoldStatus = true;
            this.infoFoldStatus = true;
            this.introFoldStatus = true;
            this.followFoldStatus = true;
            this.introFoldText = '展开更多';
            this.infoFoldText = '展开更多';
            this.lrcText = '展开更多';
            this.componentType = 'includeList';
            this.errorStatus = false;
            this.PGCType = false;
            this.appString = '';
            this.showCoinBoardStatus = false;
            this.coinExp = 0;
            var songId = this.$route.params.songId;
            this.songId = songId;
            this.$apollo.query({
                query: dao.getSongInfo,
                variables: {
                    songId: songId
                },
            }).then(data => {
                // this.songId = data.songInfo.aid;
                console.log(data);
                this.author = data.data.songInfo.author;
                this.cover = data.data.songInfo.cover;
                this.intro = data.data.songInfo.intro;
                this.lyric = data.data.songInfo.lyric;
                this.title = data.data.songInfo.title;
                this.avid = data.data.songInfo.aid;
                this.cid = data.data.songInfo.cid;
                this.passTime = data.data.songInfo.passtime;
                this.serverTime = data.data.songInfo.curtime;
                this.playNum = data.data.songInfo.statistic.play;
                this.collectNum = data.data.songInfo.statistic.collect;
                this.commentNum = data.data.songInfo.statistic.comment;
                this.shareNum = data.data.songInfo.statistic.share;
                this.coinNum = data.data.songInfo.coin_num;
                this.musicType = data.data.songInfo.crtype;
                this.isOff = this.isType(data.data.songInfo.limit, 1);
                this.isLock = this.isType(data.data.songInfo.limit, 2);
                this.isDel = this.isType(data.data.songInfo.limit, 3);
                this.isVideo = data.data.songInfo.crtype === 3;
                // 0，付费 1，PGC 2，首发 3，猫耳FM 4，视频转音频
                this.isPGC = this.isType(data.songInfo.attr, 1);
                // 活动id
                this.activityInfo.id = data.activityId;
                this.$apollo.query({
                    query: dao.getUserInfo,
                    variables: {
                        uid: this.upuid
                    }
                  }).then(data => {
                    this.upcover = data.avater;
                    this.upintro = data.sign;
                    this.$nextTick(function() {
                        var follow = document.getElementById('follow-content');
                        if (follow && follow.offsetHeight > 48) {
                            this.showFollowFold = true;
                        }
                    });
                }).catch(response => { this.SETFOLLOWSTATUS(false); });
                // 获取所属歌单信息
                dao.getIncludeMenuInfo(this.songId).then(data => {
                    this.includeAlbumObj = data;
                });
                if (this.isPGC === '1') {
                    this.intro = '该歌曲为付费歌曲，目前仅支持收听试听片段，请静候更多功能上线。';
                } else if (this.isVideo) {
                    this.intro = '';
                }
                this.lrcList = [];
                if (data.lyric) {
                } else {
                    this.lrcList = ['暂无歌词，歌词贡献及校对可发送邮件至audio@bilibili.com'];
                }
                this.$nextTick(function() {
                    var contentSpan = document.getElementById('content-span');
                    if (contentSpan && contentSpan.offsetHeight > 48) {
                        this.showIntroFoldStatus = true;
                    }
                });
                var canvas = document.getElementById('canvas');
            }).catch(response => {
                this.errorStatus = true;
                if (response.code === 72010027) {
                    this.PGCType = true;
                    this.appString = response.msg;
                }
            });
            this.avLink = location.href + '?type=6';
        },
        lrcFoldChange() {
            this.lrcFoldStatus = !this.lrcFoldStatus;
            this.lrcText = this.lrcFoldStatus ? '展开更多' : '收起';
        },
        setShare() {
            let me = this;
            biliShare.init({
                url: location.href,
                title: me.title,
                desc: me.title + ' UP主：' + me.upname,
                summary: me.intro,
                shortTitle: me.title,
                pic: me.cover,
                weiboTag: '#哔哩哔哩音乐#',
                aid: me.$route.params.songId,
                type: 'getSongShareNum',
                self: me
            }, (data) => {
                me.shareNum = data;
            });
        },
        showDynmicShare() {
            dao.isLogin().then(data => {
                if (data.isLogin) {
                    this.showDynamicStatus = true;
                } else {
                    this.login();
                }
            }).catch(response => {
                this.login();
            });
        },
        showQRCode() {
            this.qrcodeStatus = true;
            if (!this.wxStatus) {
                dao.getSongShareNum({sid: this.$route.params.songId, type: 'share'}).then((data) => {
                    if (data) {
                        this.shareNum = data.share;
                    }
                });
                this.wxStatus = true;
            }
        },
        hideQRCode() {
            this.qrcodeStatus = false;
        },
        copyHref() {
            // this.avLink = location.origin + location.pathname;
            // console.log(this.avLink);
            var inputText = document.getElementById('inputText');
            var currentFocus = document.activeElement;
            inputText.focus();
            inputText.select();
            inputText.setSelectionRange(0, inputText.value.length);
            if (document.execCommand('copy', true)) {
                currentFocus.focus();
                showToast('已经复制到剪切板');
                if (!this.linkStatus) {
                    dao.getSongShareNum({sid: this.$route.params.songId, type: 'share'}).then((data) => {
                        if (data) {
                            this.shareNum = data.share;
                        }
                    });
                    this.linkStatus = true;
                }
            } else {
                showToast('复制链接失败');
            }
        },
        introFoldChange() {
            this.introFoldStatus = !this.introFoldStatus;
            this.introFoldStatus ? this.introFoldText = '展开更多' : this.introFoldText = '收起';
        },
        infoFoldChange() {
            this.infoFoldStatus = !this.infoFoldStatus;
            this.infoFoldStatus ? this.infoFoldText = '展开更多' : this.infoFoldText = '收起';
        },
        closeDialog() {
            this.shareDialogStatus = false;
        },
        openDialog() {
            this.shareDialogStatus = true;
        },
        colloctSong() {
            window.getCollectionList(this.$route.params.songId, () => {
                this.SETSONGCOLLECT(true);
                this.collectNum = this.collectNum + 1;
                window.ap.loadCollectionStatus(this.$route.params.songId);
            }, () => {
                this.SETSONGCOLLECT(false);
                this.collectNum = this.collectNum - 1;
                window.ap.loadCollectionStatus(this.$route.params.songId);
            });
        },
        scrollFunction() {
            var height = document.body.clientHeight;
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            if (scrollTop > height && document.getElementsByClassName('song-scroll').length) {
                document.getElementsByClassName('song-scroll')[0].style.backgroundPosition = '-40px';
                this.showGoTopStatus = true;
            } else {
                this.showGoTopStatus = false;
            }
        },
        goTop(el) {
            var x = -40;
            var target = el.currentTarget;
            var self = this;
            this.animationStatus = true;
            var scrollTime = setInterval(() => {
                target.style.backgroundPosition = (x -= 143) + 'px';
                if (x < -754) {
                    clearInterval(scrollTime);
                    $('.song-scroll').animate({ bottom: '65%' }, 500);
                    $('html, body').animate({ scrollTop: 0 }, 500);
                    setTimeout(() => {
                        this.animationStatus = false;
                        this.$nextTick(() => {
                            $('.song-scroll').css({ bottom: '15%' });
                        });
                    }, 600);
                    // document.body.scrollTop = document.documentElement.scrollTop = 0;
                }
            }, 100);
        },
        timeText(passtime, servertime) {
            var val = servertime - passtime;
            var time = new Date(servertime * 1000);
            var y = time.getFullYear();
            var M = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var m = time.getMinutes();
            var s = time.getSeconds();
            var ptime = new Date(passtime * 1000);
            var py = ptime.getFullYear();
            var pM = ptime.getMonth() + 1;
            var pd = ptime.getDate();
            if (val < 60) {
                return '刚刚';
            } else if (val < 3600) {
                return parseInt(val / 60) + '分钟前';
            } else if (val < 86400) {
                return parseInt(val / 3600) + '小时前';
            } else if (val < 86400 + h * 3600 + m * 60 + s) {
                return '昨天';
            } else if (passtime * 1000 - new Date(y + '/01/01') > 0) {
                return pM + '-' + pd;
            } else {
                return py + '-' + pM + '-' + pd;
            }
        },
        // collectSong() {
        //
        // },
        showComplain() {
            this.complainStatus = true;
        },
        hideComplain() {
            this.complainStatus = false;
        },
        changeInfo(type, value) {
            this[type] = value;
        },
        songPlay() {
            if (this.isOff === '1') {
                showToast('抱歉，该音频已下架');
                return false;
            }
            if (this.isLock === '1') {
                showToast('抱歉，该音频由于版权受限无法播放');
                return false;
            }
            if (this.isDel === '1') {
                showToast('抱歉，该音频已删除');
                return false;
            }
            // if (!window.ap.isPaused() && window.ap.getSid() === parseInt(this.$route.params.songId)) {
            //   window.ap.pause();
            //   this.SETPLAYCURRENTSTATUS(false);
            // } else if (window.ap.getSid() !== parseInt(this.$route.params.songId)) {
            var index = window.ap.addAudio([{
                name: this.title,
                artist: this.author,
                cover: this.cover,
                sid: parseInt(this.$route.params.songId),
                uid: this.upuid
            }]);
            if (index === -1) {
                showToast('加入播放列表失败');
            } else {
                window.ap.switchAudio({index: index});
                window.ap.play();
                // this.SETPLAYCURRENTSTATUS(true);
                showToast('已加入播放列表');
            }
            // } else {
            //   window.ap.play();
            // }
        },
        isType(val, len) {
            var valString = +val.toString(2);
            return ('0000' + valString).substr(-5).substring(len, len + 1);
        },
        login() {
            window.UserStatus.quickLogin(() => {
                window.ap.loadLoginStatus();
                // 回调
                dao.isLogin().then(data => {
                    if (data.isLogin) {
                        this.SETUSERUID(data.mid);
                        this.SETUSERNAME(data.uname);
                    }
                }).catch(response => { console.log(response.message.toString()); });
                // 更新投币状态
                dao.getPayCoinNumber({sid: this.$route.params.songId}).then(data => {
                    this.SETPAYCOINNUMBERSTATUS(data);
                }).catch(response => { console.log(response.msg.toString()); });
                // 更新关注状态
                dao.getFollowStatus({uid: this.upuid}).then(data => {
                    this.SETFOLLOWSTATUS(data.relation === 1);
                }).catch(response => { console.log(response.msg.toString()); this.SETFOLLOWSTATUS(false); });
                // 更新收藏状态
                dao.checkCollectSong({sid: this.$route.params.songId}).then(data => {
                    this.SETSONGCOLLECT(data);
                }).catch(response => { console.log(response.msg.toString()); this.SETSONGCOLLECT(false); });
            });
        },
        goToComment() {
            $('html, body').animate({ scrollTop: $('#song-comment').offset().top }, 500);
        },
        // 活动投票
        voteActivityFunc() {
            if (this.activityInfo.ifVoted) {
                return;
            }
            // 获取token
            let actToken = '';
            let jctCookie = this.getCookie('bili_jct');

            dao.getActivityToken().then(data => {
                actToken = data;

                dao.voteActivity({lid: this.activityInfo.id, oid: this.activityInfo.copyId}, {token: actToken, csrf: jctCookie}).then(data => {
                    // 已投票
                    this.activityInfo.ifVoted = true;
                    showToast('投票成功');
                }).catch(response => {
                    showToast(response.msg);
                });
            }).catch(response => {
                if (response.code === -101) {
                    this.login();
                }
            });
        },
        formatUrl(url) {
            if (url.substring(0, 4) === 'http') {
                url = url.replace(/^http:/, '');
                return url;
            } else {
                url = '//' + url;
                return url;
            }
        },
        // 获取cookie
        getCookie(cname) {
            let name = cname + '=';
            let ca = document.cookie.split(';');

            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1);
                if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
            }
            return '';
        },
        payCoin() {
            dao.isLogin().then(data => {
                if (data.isLogin) {
                    if ((this.paycoinnumber === 1 && this.isVideo) || this.paycoinnumber === 2) {
                        showToast('对本稿件的投币枚数已用完');
                        return false;
                    } else if (this.paycoinnumber === 1 || this.isVideo) {
                        this.selectOneCoin = true;
                        this.showTwoCoinChoice = false;
                    } else {
                        this.selectOneCoin = false;
                        this.showTwoCoinChoice = true;
                    }
                    dao.getCoinExp().then(data => {
                        this.coinExp = data;
                    }).catch(response => {
                        console.log(response.msg);
                    });
                    this.showCoinBoardStatus = true;
                }
            }, data => {
                if (data.data && !data.data.isLogin) {
                    this.login();
                }
            }).catch(response => { console.log(response.message.toString()); });
        },
        closeCoinBoard() {
            this.showCoinBoardStatus = false;
        },
        selectCoinNumber(val) {
            this.selectOneCoin = val;
        },
        submitCoin() {
            this.showCoinBoardStatus = false;
            dao.payCoin({sid: this.$route.params.songId, multiply: this.selectOneCoin ? 1 : 2, csrf: getCookieName('bili_jct')}).then(data => {
                this.SETPAYCOINNUMBERSTATUS(this.selectOneCoin ? this.paycoinnumber + 1 : this.paycoinnumber + 2);
                this.coinNum = this.selectOneCoin ? this.coinNum + 1 : this.coinNum + 2;
                if (this.followstatus) {
                    showToast('投币成功，感谢您的支持');
                } else {
                    this.followupToastStatus = true;
                    var setToast = setTimeout(() => {
                        if (this.followupToastStatus) {
                            this.followupToastStatus = false;
                        } else {
                            clearTimeout(setToast);
                        }
                    }, 5000);
                }
            }).catch(response => { showToast(response.msg.toString()); });
        },
        followUp() {
            dao.followUp({uid: this.upuid, csrf: getCookieName('bili_jct')}).then(data => {
                if (data.relation === 1) {
                    this.SETFOLLOWSTATUS(true);
                    $.getScript('//static.hdslb.com/common/js/followGroupDialog.js', () => {
                        followGroupDialog(this.upuid, this.upname, {
                            onSubmitSuccess: function() {
                                showToast('加入分组成功');
                            },
                            onSubmitError: function(msg) {
                                showToast(msg || '移动分组失败');
                            }
                        });
                    });
                } else {
                    showToast('关注失败，请重试');
                }
            }).catch(response => {
                showToast('关注失败，请重试');
            });
        },
    }
};
</script>
<style lang="less" scoped>
    @import '../assets/style/color.less';
    .contain-div {
        margin-top: 40px;
    }
    .song-img {
        width: 300px;
        height: 300px;
        border-radius: 4px;
    }
    .song-intro {
        font-size: 18px;
        color: @black;
        margin-top: 40px;
    }
    .song-content {
        width: 298px;
        font-size: 12px;
        color: @gray-text-color;
        line-height: 24px;
        margin-top: 10px;
        .content-span {
            font-size: 12px;
            white-space: pre-line;
            word-wrap: break-word;
        }
        &.song-fold {
            height: 48px;
            overflow: hidden;
        }
    }
    .song-introText,
    .song-infoFold,
    .song-lrcFold {
        display: inline-block;
        color: @dark-blue;
        font-size: 12px;
        cursor: pointer;
    }
    .song-type {
        margin-top: 20px;
        color: @light-brown;
        font-size: 12px;
        display: flex;
        align-items: flex-start;
        .song-type-title {
            white-space: nowrap;
        }
    }
    .song-title {
        // height: 68px;
        font-size: 24px;
        color: @light-black;
        letter-spacing: 0;
        margin-bottom: 12px;
        line-height: 34px;
        font-weight: 600;
        word-wrap: break-word;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // -webkit-box-orient: vertical;
        // display: -moz-box;
        // -moz-line-clamp: 2!important;
        // -moz-box-orient: vertical;
        .activity-sybowl {
            width: 58px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            font-size: 12px;
            color: @white;
            background: @bg-pink;
            border-radius: 4px;
            float: left;
            margin: 5px 12px 0 0;
            font-weight: normal;
        }
    }
    .font24 {
        font-size: 24px;
        color: @gray-text-color;
    }
    .song-time {
        font-size: 12px;
        color: @gray-text-color;
        span {
            cursor: pointer;
        }
    }
    .song-play-num {
        font-size: 12px;
        line-height: 22px;
        color: @gray-text-color;
        span {
            color: @black;
        }
    }
    .song-info {
        line-height: 22px;
        &.song-infoStatus {
            height: 110px;
            overflow: hidden;
        }
        .song-info-content {
            font-size: 12px;
            color: @black;
            .song-info-div {
                // margin-top: 6px;
                display: flex;
                align-items: flex-start;
                word-break: break-all;
            }
            .song-info-theme {
                color: @gray-text-color;
                flex-shrink: 0;
                white-space: nowrap;
            }
            .song-info-detail {
                flex-shrink: 0;
                color: @black;
            }
            a {
                color: @dark-blue;
            }
            a:hover {
                color: @dark-blue;
            }
        }
    }
    .song-playbtn {
        width: 140px;
        height: 48px;
        display: inline-block;
        line-height: 48px;
        text-align: center;
        background-color: @dark-blue;
        border-radius: 4px;
        color: @white;
        font-size: 18px;
        cursor: pointer;
        .song-play {
            margin-left: 14px;
        }
    }
    .song-playbtn:hover {
        background-color: @brown-blue;
    }
    .share-board {
        position: relative;
        margin-top: 20px;
        display: flex;
        align-items: center;
        .song-share {
            display: inline-block;
            margin-left: 40px;
            cursor: pointer;
            text-align: center;
            line-height: normal;
            .font-blue {
                color: @dark-blue;
            }
            div {
                color: @gray-text-color;
                margin-top: 2px;
            }
            a {
                color: @gray-text-color;
            }
            a:hover {
                color: @gray-text-color;
            }
        }
        .share-btn {
            position: absolute;
            top: 51px;
            left: 160px;
            width: 339px;
            background: @white;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .14);
            border-radius: 4px;
            z-index: 9;
            line-height: 24px;
            ul {
                padding: 0 8px;
            }
            .bili-share {
                float: left;
                width: 64px;
                text-align: center;
                cursor: pointer;
                div {
                    margin-top: 7px;
                    color: @dark-black;
                }
            }
            .share-type {
                color: @light-black;
                line-height: 12px;
                padding: 20px;
                position: relative;
                &.song-border {
                    border-top: 1px solid @gray;
                }
                .close {
                    position: absolute;
                    right: 10px;
                    top: 20px;
                    font-size: 24px;
                    cursor: pointer;
                    color: @gray-text-color;
                }
            }
            .copyText {
                opacity: 0;
                height: 0;
            }
            .font44 {
                font-size: 44px;
                line-height: 44px;
            }
            .sina {
                color: @red;
            }
            .wechat {
                color: @green;
            }
            .qzone {
                color: @yellow;
            }
            .qq {
                color: @blue;
            }
            .dynamic {
                color: @pink;
            }
            .link {
                color: @dark;
            }
            .song-qrcode {
                position: absolute;
                top: 110px;
                left: 40px;
                width: 100px;
                height: 100px;
                background-color: @white;
                z-index: 9;
            }
        }
    }
    .lrc-fold {
        height: 240px;
        overflow: hidden;
        margin-top: 12px;
    }
    .lrc-unfold {
        height: auto;
        overflow: visible;
        margin-top: 12px;
    }
    .song-lrc {
        font-size: 14px;
        line-height: 30px;
        color: @dark-black;
        word-wrap: break-word;
    }
    // .slide-fade-enter-active {
    //   transition: all .3s ease;
    // }
    // .slide-fade-leave-active {
    //   transition: all .8s ease;
    // }
    // .slide-fade-enter, .slide-fade-leave-to
    // /* .slide-fade-leave-active for below version 2.1.8 */ {
    //   transform: translateX(10px);
    //   opacity: 0;
    // }
    .b-head{
        font-size: 18px;
        line-height: 24px;
        color: @black;
        margin: 0 0 20px;
    }
    .b-head-t {
        color: @black;
        font-size: 18px;
    }
    .b-head-string, .results {
        color: @gray-text-color;
        font-size: 16px;
    }
    .song-comment {
        border-top: 1px solid @unable-border-color;
        padding-top: 30px;
        margin-right: 64px;
        margin-top: 20px;
        margin-bottom: 5px;
    }
    /* .del-log {
        float: right;
        font-size: 12px;
        line-height: 24px;
        color: #99a2aa;
    } */
    .song-padding {
        padding-right: 50px;
        font-size: 12px;
        line-height: 16px;
        .song-gap {
            min-height: 230px;
        }
    }
    .song-scroll {
        width: 62px;
        height: 85px;
        position: fixed;
        right: 20px;
        bottom: 15%;
        background-image: url(~image/gotop.png);
        background-repeat: no-repeat;
        background-position: -40px;
        cursor: pointer;
        // &.gotop {
        //   animation: gotop .5s;
        // }
    }
    // @keyframes gotop {
    //   0% {bottom: 15%;}
    //   25% {bottom: 26.25%;}
    //   50% {bottom: 37.5%;}
    //   50% {bottom: 48.75%;}
    //   100% {bottom: 60%;}
    // }
    .song-complain-bg {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .3);
        z-index: 10001;
        .song-complain {
            width: 340px;
            height: 278px;
            position: absolute;
            left: 50%;
            top: 189px;
            transform: translate(-50%);
            background-color: @white;
            border-radius: 4px;
            text-align: center;
            .complain-title {
                font-size: 16px;
                color: @brown;
                line-height: 50px;
                height: 50px;
                border-bottom: 1px solid @unable-border-color;
                .close-btn {
                    color: @gray-text-color;
                    font-size: 24px;
                    position: absolute;
                    right: 20px;
                    top: 0;
                    cursor: pointer;
                }
            }
            .complain-text {
                font-size: 14px;
                color: @brown;
                line-height: 24px;
                padding: 50px 61px;
            }
            .complain-btn {
                width: 220px;
                height: 32px;
                line-height: 32px;
                margin: 0 auto;
                background: @dark-blue;
                border-radius: 4px;
                color: @white;
                cursor: pointer;
            }
        }
    }
    .song-coin-bg {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .3);
        z-index: 10002;
        .song-coin {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 430px;
            height: 422px;
            transform: translate(-50%, -50%);
            background-color: @white;
            border-radius: 8px;
            text-align: center;
            .song-coin-close {
                color: @gray-text-color;
                font-size: 24px;
                position: absolute;
                right: 16px;
                top: 16px;
                cursor: pointer;
            }
            .song-coin-title {
                margin-top: 20px;
                margin-bottom: 30px;
                color: @black;
                font-size: 16px;
                .song-coin-number {
                    font-size: 30px;
                    color: @dark-blue;
                    font-family: "Helvetica Neue";
                }
            }
            .song-coin-content {
                display: flex;
                align-items: center;
                justify-content: center;
                .song-one-coin {
                    position: relative;
                    width: 160px;
                    height: 230px;
                    margin-left: 30px;
                    margin-right: 30px;
                    border: 2px dashed @border-color;
                    border-radius: 5px;
                    background-image: url(~image/22-gray.png);
                    background-position: 50%;
                    background-repeat: no-repeat;
                    color: @gray-text-color;
                    &.active {
                        border: 2px solid @border-blue;
                        background-image: url(~image/22.gif);
                        background-size: 122px;
                        color: @border-blue;
                    }
                }
                .song-one-coin:hover {
                    border-color: @border-blue;
                }
                .song-two-coin {
                    position: relative;
                    width: 160px;
                    height: 230px;
                    margin-right: 30px;
                    border: 2px dashed @border-color;
                    border-radius: 5px;
                    background-image: url(~image/33-gray.png);
                    background-position: 50%;
                    background-repeat: no-repeat;
                    color: @gray-text-color;
                    &.active {
                        border: 2px solid @border-blue;
                        background-image: url(~image/33.gif);
                        background-size: 118px;
                        color: @border-blue;
                    }
                }
                .song-two-coin:hover {
                    border-color: @border-blue;
                }
                .song-coin-text {
                    position: absolute;
                    top: 0;
                    left: 15px;
                    line-height: 40px;
                    font-size: 14px;
                }
            }
            .song-coin-btn {
                width: 120px;
                height: 36px;
                line-height: 36px;
                margin: 24px auto 12px;
                border-radius: 4px;
                font-size: 14px;
                background-color: @dark-blue;
                color: @white;
                cursor: pointer;
            }
            .song-coin-btn:hover {
                background-color: @brown-blue;
            }
            .song-coin-exp {
                font-size: 12px;
                font-family: "Helvetica Neue";
                color: @gray-text-color;
            }
        }
    }
    .follow-up-toast {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 304px;
        height: 49px;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 14px;
        color: #fff;
        background-color: rgba(0, 0, 0, .8);
        transition: all .5s;
        transform: translate(-50%, -50%);
        z-index: 10003;
        .follow-up-font {
            font-size: 12px;
            line-height: 24px;
        }
        .close-toast {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 24px;
            cursor: pointer;
        }
        .follow-up-btn {
            position: absolute;
            top: 24px;
            right: 36px;
            width: 52px;
            height: 24px;
            line-height: 24px;
            border-radius: 4px;
            text-align: center;
            background-color: @dark-blue;
            cursor: pointer;
        }
    }
    .activity-wrap {
        margin: 30px 64px 0 0;
        font-size: 14px;
        overflow: hidden;
        border: 1px solid @unable-border-color;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        .activity-left {
            float: left;
            margin-right: -320px;
            padding: 0 320px 0 20px;
            width: 100%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            .l-inside {
                .hinter-msg {
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    &.act-start {
                        margin-top: 17px;
                    }
                    &.act-end {
                        line-height: 68px;
                    }
                    .text {
                        color: @black;
                    }
                }
                .b-btn-praise {
                    margin-top: 12px;
                    width: 100px;
                    height: 32px;
                    line-height: 32px;
                    border-radius: 4px;
                    text-align: center;
                    color: @white;
                    background-color: @primary-color;
                    cursor: pointer;
                }
                .voted-btn {
                    color: #e5e9ef;
                    border: 1px solid;
                    background-color: transparent;
                    cursor: default;
                }
            }
        }
        .activity-right {
            float: right;
            .inside-bg {
                width: 320px;
                height: 100px;
                position: relative;
                display: block;
                background-position: 50%;
                background-repeat: no-repeat;
                background-size: cover;
                &:before {
                    content: "";
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: -webkit-linear-gradient(left,#fff,transparent 30%);
                    background-image: -webkit-gradient(linear,left top,right top,from(#fff),color-stop(30%,transparent));
                    background-image: -o-linear-gradient(left,#fff,transparent 30%);
                    background-image: linear-gradient(90deg,#fff,transparent 30%);
                }
                &.end-act {
                    height: 68px;
                }
            }
        }
    }
    .album-title {
        font-size: 18px;
        color: @black;
        margin-top: 30px;
    }
    .song-li {
        height: 77px;
        font-size: 12px;
        margin-top: 11px;
        margin-bottom: 11px;
        .song-left {
            float: left;
            width: 75px;
            position: relative;
            .song-shadow {
                width: 68px;
                height: 68px;
                margin-left: 5px;
                background: rgba(50, 176, 218, .30);
                border: 1px solid;
                border-color: @gray-blue;
                border-radius: 4px;
            }
            .song-img {
                position: absolute;
                top: 5px;
                left: 0;
                width: 70px;
                height: 70px;
                background-color: @brown-gray;
                border-radius: 4px;
            }
        }
        .song-right {
            float: right;
            width: 181px;
            padding-left: 13px;
            .song-right-title {
                color: @black;
                line-height: 20px;
                width: 181px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 40px;
                font-size: 12px;
                a:hover {
                    color: @dark-blue;
                }
            }
            .song-right-bottom {
                display: flex;
                align-items: center;
                margin-top: 12px;
                .song-playnum {
                    color: @gray-text-color;
                    line-height: 20px;
                }
                .song-num {
                    color: @gray-text-color;
                    line-height: 20px;
                    margin-left: 40px;
                }
            }
        }
    }
    .similar-song-menu {
        margin-top: 12px;
        .similar-left {
            float: left;
            position: relative;
            margin-right: 14px;
            .similar-cover {
                display: inline-block;
                background-color: @brown-gray;
                border-radius: 4px;
            }
            .similar-icon {
                height: 30px;
                width: 30px;
                position: absolute;
                background: url(~image/similar-cover.png) center center no-repeat;
                background-size: 100%;
                bottom: 20px;
                left: 20px;
            }
        }
        .similar-right {
            float: left;
            font-size: 12px;
            line-height: 20px;
            .title {
                color: @black;
                margin: 10px 0;
                width: 170px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
                &:hover {
                    color: @dark-blue;
                }
            }
            .song-num {
                color: @gray-text-color;
            }
        }
    }
    @media only screen and (min-width: 90em) {
        .song-img {
            width: 370px;
            height: 370px;
        }
        .song-comment {
            margin-right: 80px;
        }
        .activity-wrap {
            margin-right: 80px;
        }
        .song-padding {
            padding-right: 80px;
            .song-gap {
                min-height: 300px;
            }
        }
    }
</style>
