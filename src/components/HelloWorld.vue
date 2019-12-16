<template>
  <div class="hello">
    <div class="apollo">
    <h3>Hello</h3>
    <p>
      {{hello}}
    </p>
    <p>
      {{qHello}}
    </p>
    <div>
      <button @click="contentFetch">fetch请求</button>
    </div>
    <div>
      <button @click="testOne">query</button>
    </div>
    <div>
      <button @click="testTwo">mutation</button>
    </div>
    <div>
      <button @click="turnpage">turnpage</button>
    </div>
    <p v-for="(pageItem, index) in pageList" :key="index">
      {{pageItem.num}}
    </p>
  </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import {hello, QUERY_USER, turnPage, removeUser} from '@/graphql/search.graphql';
const getErSeasons = gql`query erSeasons($classId: Long!) {
                            erSeasons{
                              id
                              name
                              startTime
                              endTime
                              classTask(class:$classId){
                                id
                                classId
                                startTime
                                endTime
                                status
                              }
                            }
                          }`;
export default {
    name: 'HelloWorld',
    apollo: {
        // 简单的查询，将更新 'hello' 这个 vue 属性
        // hello: gql(`query {
        //   hello
        // }`),
        // ping: {
        //     // gql 查询
        //     query: gql`query PingMessage($message: String!) {
        //         ping(message: $message)
        //     }`,
        //     // 静态参数
        //     variables: {
        //         message: 'Meow',
        //     },
        // },
        hello: hello,
        // removeUser: removeUser
    },
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            // hello: '',
            ping: '',
            qHello: '',
            page: 1,
            pageSize: 10,
            pageList: [],
            change: false,
        };
    },
    methods: {
        changeClass (id) {
            this.ClassSeasons = [];
            this.Select = id;
            console.log(this.$apollo.query);
            this.$apollo.query({
                query: getErSeasons,
                variables: {
                    classId: this.Select
                }
            }).then(res => {
                this.Parse(res.data.erSeasons);
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        },
        async addTag() {
            // 调用 graphql 变更
            const result = await this.$apollo.mutate({
                // 查询语句
                mutation: gql`mutation ($label: String!) {
                    addTag(label: $label) {
                        id
                        label
                    }
                }`,
                // 参数
                variables: {
                    label: this.newTag,
                },
            });
            console.log(result);
        },
        testOne() {
            this.$apollo
                .query({
                    // Query
                    query: QUERY_USER,
                    variables: {
                        username: 'ducafecat',
                        password: '12321321321321432',
                        page: this.page,
                        pageSize: this.pageSize
                    },
                })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        testTwo() {
            this.$apollo
                .mutate({
                    // Query
                    mutation: removeUser,
                    variables: {
                        id: 123
                    }
                })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        turnpage() {
            console.log(turnPage);
            console.log(this.change);
            this.change = !this.change;
            this.$apollo
                .query({
                    // Query
                    query: turnPage,
                    variables: {
                        page: this.page,
                        pageSize: this.pageSize,
                        change: this.change
                    },
                })
                .then(response => {
                    console.log(response);
                    this.pageList = response.data.pageList;
                    this.page = this.page + 1;
                    this.pageSize = this.pageSize + 1;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        contentFetch() {
            fetch('http://localhost:4000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({query: 'query { hello }', variables: {name: 'bob'}})
            })
                .then(r => r.json())
                .then(data => console.log('data returned:', data));
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello {
  text-align: center;
}
</style>
