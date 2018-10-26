<template>
    <div v-if="showStatus">
        <div class="song-title">音乐人的热门歌曲<i class="iconfont font18" @click="addAllSong">&#xe612;</i></div>
        <div>
            <ul class="report-wrap-module" id="song_detail_upper_hot_song">
                <li class="hotsong-li" v-for="hotSong in tableData" :key="hotSong.id">
                    <div class="hotsong-title"><router-link :to="'/audio/au' + hotSong.id">{{hotSong.title}}</router-link></div>
                    <div class="hotsong-upname" @click="change(hotSong.id)">{{hotSong.author}}</div>
                    <i class="iconfont font24" @click="addSong(hotSong.title, hotSong.author, hotSong.cover, hotSong.id, hotSong.uid)">{{hotSong.id === hotsongplayInfo.sid && hotsongplayInfo.playstatus ? '&#xe60d;' : '&#xe60c;'}}</i>
                </li>
            </ul>
        </div>
        <Pagination :options="pagerOptions" @pageChange="pageChange" ></Pagination>
    </div>
</template>
<script type="text/javascript">
/* eslint new-cap: ["error", { "newIsCap": false, "properties": false }] */
import Pagination from './Pagination';
import * as dao from '@/graphql/song.graphql';
import {showToast} from 'components/toast';
export default {
    data () {
        return {
          upuid: '',
          upname: '',
          hotsongplayInfo: '',
        };
    },
    components: {
        Pagination
    },
    computed: {
        pagerOptions: function() {
            return {
                currentPage: this.currentPage,
                pageSize: 6,
                maxLength: 4,
                totalItems: this.tableTotal,
                jumpPage: false,
                totalCount: true,
                keepMiddle: true,
                boundaryBtns: true,
                totalTemplate: null
            };
        }
    },
    props: ['tableData', 'tableTotal', 'currentPage', 'showStatus'],
    methods: {
        pageChange(currentPage, totalPage) {
            dao.getUPHotSong({uid: this.upuid, pn: currentPage, ps: 6}).then(data => {
                if (data) {
                    this.$emit('changeParent', 'hotSongList', data.data);
                    this.$emit('changeParent', 'hotSongTotal', data.totalSize);
                    this.$emit('changeParent', 'hotSongPage', data.curPage);
                }
            }).catch(response => { console.log(response.msg.toString()); });
        },
        async addAllSong() {
            var songList = [];
            for (var i = 1; i < Math.ceil(this.tableTotal / 50) + 1; i++) {
                await dao.getUPHotSong({uid: this.upuid, pn: i, ps: 50}).then(data => {
                    if (data) {
                        data.data.forEach(item => {
                            songList.push({
                                name: item.title,
                                artist: item.author,
                                cover: item.cover,
                                sid: item.id,
                                uid: item.uid
                            });
                        });
                    }
                });
            }
            window.ap.clearAudio();
            window.ap.addAudio(songList);
            window.ap.play();
        },
        addSong(title, author, cover, id, uid) {
            if (!window.ap.isPaused() && window.ap.getSid() === parseInt(id)) {
                window.ap.pause();
                this.SETHOTSONGPLAYINFO({sid: id, playstatus: false});
            } else if (window.ap.getSid() !== parseInt(id)) {
                var index = window.ap.addAudio([{
                    name: title,
                    artist: author,
                    cover: cover,
                    sid: id,
                    uid: uid
                }]);
                if (index === -1) {
                    showToast('加入播放列表失败');
                } else {
                    window.ap.switchAudio({index: index});
                    window.ap.play();
                    this.SETHOTSONGPLAYINFO({sid: id, playstatus: true});
                    showToast('已加入播放列表');
                }
            } else {
                window.ap.play();
            }
        },
        change(id) {
            this.$router.push('/audio/au' + id);
        }
    },
};
</script>
<style lang="less" scoped>
    @import '../../assets/style/color.less';
    .song-title {
        font-size: 18px;
        color: @black;
        line-height: 24px;
        position: relative;
        border-bottom: 1px solid @border-color;
        padding-bottom: 12px;
        margin-top: 30px;
        .font18 {
            font-size: 24px;
            color: @dark-blue;
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
        }
        .font18:hover {
            color: @brown-blue;
        }
    }
    .hotsong-li {
        line-height: 16px;
        margin-top: 10px;
        margin-bottom: 10px;
        position: relative;
        width: 250px;
        .hotsong-title {
            font-size: 12px;
            color: @black;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            a:hover {
                color: @dark-blue;
            }
        }
        .hotsong-upname {
            font-size: 12px;
            color: @gray-text-color;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .font24 {
            color: @border-color;
            position: absolute;
            top: 6px;
            right: -20px;
            cursor: pointer;
            font-size: 24px;
        }
        .font24:hover {
            color: @dark-blue;
        }
    }
</style>
