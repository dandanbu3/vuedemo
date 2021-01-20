<style lang="less">


    @import '../../assets/style/color.less';
    .pager {
        margin-top: 10px;
        // text-align: center;
        .pages {
            display: inline-block;
            vertical-align: middle;
            strong {
                min-width: 15px;
                margin: 0 2px;
                // padding: 0 5px;
                // height: 38px;
                font-size: 14px;
                display: inline-block;
                // line-height: 38px;
                // font-family: Arial;
            }
            // .showAnimate {
            //   animation: shake 0.5s ease;
            // }
            .page-item {
                display: inline-block;
                margin: 0 4px;
                font-size: 12px;
                vertical-align: middle;
                .next {
                    color: @border-color;
                    &.disabled {
                        color: @border-color;
                    }
                    &.disabled:hover {
                        color: @border-color;
                    }
                }
                .count {
                    margin: 0 5px;
                    color: @light-black;
                }
                button {
                    // min-width: 32px;
                    display:block;
                    // font-size: 14px;
                    border:0;
                    // border-radius: 50%;
                    cursor: pointer;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    // transition: .2s all;
                    background-color: #fff;
                    box-sizing: content-box;
                    outline: none;
                    color: @light-black;
                    // background-color: transparent;
                    padding: 0;
                    &.disabled {
                        color: @light-black;
                        cursor: not-allowed;
                        &:hover {
                            color: @light-black;
                            // background-color: transparent;
                        }
                    }
                    &:hover {
                        //  background: #37c8f7;
                        color: @dark-blue;
                    }
                }
                &.active {
                    button {
                        // background: $bilibili-blue;
                        // background: #37c8f7;
                        color: @dark-blue;
                    }
                }
            }
        }
        .jump-pager{
            padding: 0 2px;
            font-size: 12px;
            color: #99a2aa;
            display: inline-block;
            vertical-align: middle;
            margin-left: 10px;
            span {
                vertical-align: middle;
            }
            input[type=number]{
                text-align: center;
                width: 50px;
                border-radius: 4px;
                display: inline-block;
                padding: 0 10px;
                height: 24px;
                line-height: 24px;
                font-size: 12px;
                box-shadow: none;
                outline: none;
                border: 1px solid #ccd0d7;
                background-color: #fff;
                margin: 0 5px;
                vertical-align: middle;
            }
            .jump-pager-input::-webkit-inner-spin-button {
                -webkit-appearance: none;
            }
            .jump-pager-input::-webkit-outer-spin-button {
                -webkit-appearance: none;
            }
        }
    }
</style>
<template>
    <div class="pager" ref="pager" v-if="totalPages > 1">
        <ul class="pages">
            <!-- <li v-if="options.totalCount" class="page-item">
              <span v-if="options.totalTemplate === null" class="pagination-btn count">
                共{{totalPages}}页
              </span>
              <span v-if="options.totalTemplate !== null" class="pagination-btn count">{{options.totalTemplate(options.totalItems, totalPages)}}</span>
            </li> -->
            <li class="page-item" :class="{disabled: options.currentPage === 1}">
                <button class="pagination-btn next" @click="selectPage(options.currentPage - 1, $event)" :class="{disabled: options.currentPage === 1}">
                    <i class="iconfont">&#xe61b;</i>
                </button>
            </li>
            <li v-if="options.boundaryBtns && pages[0]['number'] > 1" class="page-item first" :class="{disabled: options.currentPage === 1}">
                <button class="pagination-btn" @click="selectPage(1, $event)" :disabled="options.currentPage === 1">1</button>
            </li>
            <strong v-if="pages[0]['number'] > 2">...</strong>
            <li v-for="(page, index) in pages" v-bind:key="index" class="page-item" :class="{active: page.number === options.currentPage}">
                <button class="pagination-btn num-btn" @click="selectPage(page.number, $event)">{{page.text}}</button>
            </li>
            <strong v-if="pages[pages.length-1]['number'] < totalPages-1">...</strong>
            <li v-if="options.boundaryBtns && pages[pages.length-1]['number'] < totalPages" class="page-item last" :class="{disabled: options.currentPage === totalPages}">
                <button class="pagination-btn" @click="selectPage(totalPages, $event)" :disabled="options.currentPage === totalPages">{{totalPages}}</button>
            </li>
            <li class="page-item" :class="{disabled: options.currentPage === totalPages}">
                <button class="pagination-btn next" @click="selectPage(options.currentPage + 1, $event)" :class="{disabled: options.currentPage === totalPages}">
                    <i class="iconfont">&#xe619;</i>
                </button>
            </li>
        </ul>
        <div v-if="options.jumpPage" class="jump-pager">
            <span>跳至</span>
            <input type="number"
                class="jump-pager-input no-spin"
                v-model="jumpTo"
                min="1"
                @keyup.enter="selectPage(jumpTo, $event)">
            <span>页</span>
        </div>
    </div>
</template>
<script>
/**
 * Default pagination options
 * @typedef PaginationOptions
 * @type {Object}
 * @property {Number} currentPage - Current / starting page number
 * @property {Number} totalItems - Number for total items
 * @property {Number} pageSize - Number for items per page
 * @property {?Number} totalPages - Total pages number
 * @property {?Number} maxLength - Number for max pages to display
 * @property {?Boolean} keepMiddle - Whether to keep current page in the middle of the visible ones
 * @property {Boolean} directionBtns - Wether to display Previous / Next buttons
 * @property {Number} previousText - Text for Previous button
 * @property {Number} NextText - Text for Next button
 * @property {Number} boundrayBtns - Wether to display First / Last buttons
 * @property {Boolean} totalCount - Wether to display total items count , page count
 * @property {?String} totalTemplate - Custom template for total items count
 */

const DEFAULT_OPTIONS = {
    currentPage: 1,
    totalItems: 0,
    pageSize: 10,
    totalPages: null,
    maxLength: 7,
    keepMiddle: true,
    directionBtns: true,
    previousText: 'Previous',
    nextText: 'Next',
    boundaryBtns: true,
    totalCount: false,
    totalTemplate: null,
    jumpPage: false,
};

export default {
    name: 'pager',
    props: {
        options: {
            type: Object,
            required: true,
            default: () => DEFAULT_OPTIONS,
        },
    },
    data() {
        return {
            jumpTo: null,
            pages: [],
        };
    },
    computed: {
        totalPages() {
            const options = this.options;

            if (typeof options.totalPages === 'number') {
                return options.totalPages;
            }

            if (options.totalItems === 0) {
                return 1;
            }

            return Math.ceil(options.totalItems / options.pageSize);
        },
    },
    created() {
        const self = this;
        const options = this.options;

        for (const key in DEFAULT_OPTIONS) {
            if (!Object.prototype.hasOwnProperty.call(DEFAULT_OPTIONS, key) || !{}.hasOwnProperty.call(DEFAULT_OPTIONS, key)) {
                return;
            }
            const oneOption = DEFAULT_OPTIONS[key];
            if (options[key] === undefined) {
                // self.$set('options.' + key, oneOption);
                self.$set(self.options, key, oneOption);
            }
        }

        const keepMiddle = typeof options.keepMiddle === 'boolean' ? options.keepMiddle : false;

        self.pages = initPagesArray(
            keepMiddle,
            self.totalPages,
            options.currentPage,
            options.maxLength,
        );

        self.$watch('options.totalItems', () => {
            self.pages = initPagesArray(
                keepMiddle,
                self.totalPages,
                options.currentPage,
                options.maxLength,
            );
        });

        self.$watch('options.totalPages', () => {
            self.pages = initPagesArray(
                keepMiddle,
                self.totalPages,
                options.currentPage,
                options.maxLength,
            );
        });

        self.$watch('jumpTo', (val) => {
            if (val.length === 0) { return; }

            let newValue;
            if (val > 0 && val <= self.totalPages) {
                newValue = parseInt(val, 10);
            } else {
                newValue = val <= 0 ? 1 : self.totalPages;
            }

            self.$nextTick(() => {
                self.jumpTo = newValue;
            });
        });
    },
    methods: {
        // showAnimate(isEnabel, e) {
        //   if (!isEnabel || e.target.className.indexOf('showAnimate') > -1) return;
        //   e.target.className += ' showAnimate';
        //   setTimeout(() => {
        //     e.target.className = e.target.className.replace(' showAnimate', '');
        //   }, 500);
        // },
        selectPage(pn, e) {
            if (e.currentTarget.className.indexOf('disabled') > -1) {
                // this.showAnimate(true, e);
                return;
            }
            if (pn < 1 || pn > this.totalPages) {
                return;
            }
            const self = this;
            const options = self.options;
            let pageNumber = pn;
            if (typeof pageNumber !== 'number') {
                pageNumber = 1;
            }

            if (options.currentPage === pageNumber) { return; }

            const prevPage = options.currentPage;
            options.currentPage = pageNumber;

            this.$emit('pageChange', pageNumber, this.totalPages);

            const limit = options.maxLength;
            if (limit === null) {
                return;
            }

            const keepMiddle = typeof options.keepMiddle === 'boolean' ? options.keepMiddle : false;
            // go to first
            if (pageNumber === 1 && prevPage > limit) {
                self.pages = initPagesArray(
                    keepMiddle,
                    self.totalPages,
                    pageNumber,
                    limit,
                );
                return;
            }

            if (keepMiddle && limit < self.totalPages) {
                self.pages = updatePagesArray(
                    keepMiddle,
                    self.totalPages,
                    pageNumber,
                    limit,
                );
                self.$nextTick(updateButtonFocus.bind(self, pageNumber));
                return;
            }

            // check whether to update array
            const start = ((Math.ceil(prevPage / limit) - 1) * limit) + 1;
            const end = Math.min((start + limit) - 1, self.totalPages);

            if (pageNumber < start || pageNumber > end) {
                self.pages = updatePagesArray(
                    keepMiddle,
                    self.totalPages,
                    pageNumber,
                    limit,
                );
            }
            self.$nextTick(updateButtonFocus.bind(self, pageNumber));
        },
    },
};

/**
 * Create a page object used in pagination list
 * @param  {Number} number - Page number
 * @param  {Number | String} text - text displayed in pagination button
 * @return {Object}
 */
function createPage(number, text) {
    return {
        'number': number,
        'text': text,
    };
};

/**
 * Gerate pages array, accept a limit maxLength
 * @param {Boolean} keepMiddle - Whether to keep current page in the middle of the visible ones
 * @param  {Number} totalPages - Total page number
 * @param {Number} currentPage - Cuurent page number
 * @param {Number} limit - max length of the array
 * @return {Array} Array of pages
 */
function initPagesArray(keepMiddle, totalPages, currentPage, limit) {
    const pages = [];
    let i;
    let start = 1;
    let end = totalPages;
    if (limit !== null) {
        if (keepMiddle && currentPage > limit) {
            // current page is displayed in the middle of the visible ones
            start = Math.max(currentPage - Math.floor(limit / 2), 1);
            end = (start + limit) - 1;

            // Adjust if limit is exceeded
            if (end > totalPages) {
                end = totalPages;
                start = (end - limit) + 1;
                if (start < 1) {
                    start = 1;
                }
            }
        } else {
            start = ((Math.ceil(currentPage / limit) - 1) * limit) + 1;
            end = Math.min((start + limit) - 1, totalPages);
        }
    }

    for (i = start; i <= end; i++) {
        pages.push(createPage(i, i));
    }
    if (totalPages > end && !keepMiddle) {
        pages.push(createPage(i, '...'));
    }
    return pages;
};

function updateButtonFocus(pageNumber) {
    let pageIndex;
    this.pages.forEach((page, index) => {
        if (page.number === pageNumber) {
            pageIndex = index;
        }
    });
    const btns = this.$refs.pager.querySelectorAll('.pagination-btn.num-btn');
    if (btns.length > 0) {
        btns[pageIndex].focus();
    }
};

/**
 * Gerate pages array, accept a limit maxLength
 * @param {Boolean} keepMiddle - Whether to keep current page in the middle of the visible ones
 * @param {Number} totalPages - Total page number
 * @param {Number} currentPage - Cuurent page number
 * @param {Number} limit - max length of the array
 * @return {Array} Array of pages
 */
function updatePagesArray(keepMiddle, totalPages, currentPage, limit) {
    const pages = [];
    let start = 1;
    let number;
    let end;
    if (keepMiddle) {
        // current page is displayed in the middle of the visible ones
        start = Math.max(currentPage - Math.floor(limit / 2), 1);
        end = (start + limit) - 1;

        // Adjust if limit is exceeded
        if (end > totalPages) {
            end = totalPages;
            start = (end - limit) + 1;
        }
    } else {
        start = ((Math.ceil(currentPage / limit) - 1) * limit) + 1;
        end = Math.min((start + limit) - 1, totalPages);
    }

    // Add page numbers
    for (number = start; number <= end; number++) {
        pages.push(createPage(number, number));
    }

    if (keepMiddle) {
        return pages;
    }

    // Add boundray buttons
    if (limit <= 0) {
        return pages;
    }
    if (start > 1) {
        pages.unshift(createPage(start - 1, '...'));
    }
    if (end < totalPages) {
        pages.push(createPage(end + 1, '...'));
    }

    return pages;
};
</script>
