<template>
  <div class="hello">
    <div class="apollo">
    <h3>Hello</h3>
    <p>
      {{$apollo.hello}}
    </p>
  </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import {q_hello} from '../graphql/search.graphql';
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
        hello: gql`query { hello }`,
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
    },
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            // hello: '',
            ping: '',
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
