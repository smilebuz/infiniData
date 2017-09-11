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
      <Form :model="configForm" :label-width="80" class="configform">
        <FormItem label="连接名称">
          <Input v-model="configForm.connName"></Input>
        </FormItem>
        <FormItem label="主机IP">
          <Input v-model="configForm.host"></Input>
        </FormItem>
        <FormItem label="数据库名称">
          <Input v-model="configForm.dbName"></Input>
        </FormItem>
        <FormItem label="端口号">
          <Input v-model="configForm.port"></Input>
        </FormItem>
        <FormItem label="用户名">
          <Input v-model="configForm.userName"></Input>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="configForm.password"></Input>
        </FormItem>
        <FormItem label="编码设置">
          <Select v-model="configForm.encoding">
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
      <Modal title="连接测试" on-ok="" on-cancel="" v-model="modals.connModal">
      </Modal>
    </div>
  </div>
</template>

<script>
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
      configForm: {
        connName: '',
        encoding: '',
        host: '',
        port: '',
        dbName: '',
        userName: '',
        password: ''
      },
      modals: {
        connModal: false
      },
      createParams: {
        dbType: '',
        connName: ''
      }
    }
  },
  methods: {
    selectSourceType (sourcetype) {
      this.createParams.dbType = sourcetype
      this.currentStep = 2
    },
    testConn () {
      // 测试请求
      this.modals.connModal = true
    },
    saveConfig () {
      // 保存请求
      this.$router.push('Source')
    },
    cancelConfig () {
      this.$router.push('Source')
    }
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
  .configform {
    width: 40%;
    margin: 0 auto;
    overflow: auto;
  }
  .buttongroup {
    float: right;
  }
</style>
