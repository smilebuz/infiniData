<template lang="html">
  <div class="createsource">
    <div class="stepcontainer">
      <Steps :current="currentStep">
        <Step title="选择数据源"></Step>
        <Step title="填写配置"></Step>
      </Steps>
    </div>
    <div class="maincontainer typecontainer" v-if="currentStep === 1">
      <div class="sourcetype" v-for="(source, index) in sources" :key="source.type" @click="selectSourceType(source.type)">
        <img :src="source.sourceImg" :alt="source.type" class="type__image">
      </div>
    </div>
    <div class="maincontainer configcontainer" v-else>
      <Form :model="createParams" :label-width="100" class="createParams">
        <FormItem label="连接名称">
          <Input v-model="createParams.connName"></Input>
        </FormItem>
        <FormItem label="主机IP">
          <Input v-model="createParams.host"></Input>
        </FormItem>
        <FormItem label="数据库名称">
          <Input v-model="createParams.dbName"></Input>
        </FormItem>
        <FormItem label="端口号">
          <Input v-model="createParams.port"></Input>
        </FormItem>
        <FormItem label="用户名">
          <Input v-model="createParams.userName"></Input>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="createParams.password"></Input>
        </FormItem>
        <FormItem label="最大并发连接数">
          <Input v-model="createParams.maxConn"></Input>
        </FormItem>
        <FormItem label="编码设置">
          <Select v-model="createParams.encoding">
            <Option value="utf8">UTF-8</Option>
            <Option value="gbk">GBK</Option>
          </Select>
        </FormItem>
        <FormItem class="buttongroup">
          <Button type="primary" @click="testConn">测试连接</Button>
          <Button type="info" @click="saveConfig">保存</Button>
          <Button @click="cancelConfig">取消</Button>
        </FormItem>
      </Form>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      currentStep: 1,
      sources: [
        {
          type: 'informix',
          sourceImg: require('../../assets/images/icon/Informix.png')
        },
        {
          type: 'db2',
          sourceImg: require('../../assets/images/icon/db2.png')
        },
        {
          type: 'oracle',
          sourceImg: require('../../assets/images/icon/oracle.png')
        },
        {
          type: 'sqlserver',
          sourceImg: require('../../assets/images/icon/sqlserver.png')
        },
        {
          type: 'mysql',
          sourceImg: require('../../assets/images/icon/mysql.png')
        }
      ],
      createParams: {
        connName: '',
        encoding: '',
        host: '',
        port: '',
        maxConn: '',
        dbType: '',
        dbName: '',
        userName: '',
        password: '',
        user: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  methods: {
    ...mapActions({
      createSource: 'createSource',
      testSourceConn: 'testSourceConn'
    }),
    selectSourceType (sourcetype) {
      this.createParams.dbType = sourcetype
      this.currentStep = 2
    },
    testConn () {
      // 测试请求
      let connParams = {
        type: this.createParams.dbType,
        host: this.createParams.host,
        port: this.createParams.port,
        database_name: this.createParams.dbName,
        user_name: this.createParams.userName,
        password: this.createParams.password
      }
      this.testSourceConn(connParams).then(data => {
        this.$Message.success({
          content: '连接测试成功',
          top: 50,
          duration: 1.5
        })
      }).catch(error => {
        this.$Message.warning({
          content: error.message,
          top: 50,
          duration: 1.5
        })
      })
    },
    saveConfig () {
      // 保存请求
      this.createSource(this.createParams).then(data => {
        this.$router.push('Source')
      }).catch(error => {
        this.$Message.warning({
          content: error.message,
          top: 50,
          duration: 1.5
        })
      })
    },
    cancelConfig () {
      this.$router.push('Source')
    }
  },
  mounted () {
    this.createParams.user = this.user.userName
  }
}
</script>

<style lang="scss">
  .stepcontainer {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .maincontainer {
    background: #f0f0f0;
  }
  .typecontainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 50px;
  }
  .sourcetype {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 150px;
    margin-right: 50px;
    margin-left: 50px;
    margin-bottom: 50px;
    cursor: pointer;
    background: #fff;
  }
  .configcontainer {
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .createParams {
    width: 40%;
    margin: 0 auto;
    overflow: auto;
  }
  .buttongroup {
    float: right;
  }
</style>
