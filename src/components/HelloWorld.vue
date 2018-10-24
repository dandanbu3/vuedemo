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
    <button @click="testOne">testOne</button>
    <div>
      <button @click="turnpage">turnpage</button>
    </div>
  </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import {hello, MUTATION_REMOVE_USER, QUERY_USER} from '@/graphql/search.graphql';
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
                        page: '444'
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
                    mutation: MUTATION_REMOVE_USER,
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
            this.$apollo
                .query({
                    // Query
                    query: QUERY_USER,
                    variables: {
                        username: 'ducafecat',
                        password: '12321321321321432',
                        page: '444'
                    },
                })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
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
</style>
