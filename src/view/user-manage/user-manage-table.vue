<!--
 * @Author: your name
 * @Date: 2021-04-14 11:55:11
 * @LastEditTime: 2021-04-14 16:44:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \iview-admin-template-real\src\view\user-manage\user-manage-table.vue
-->
<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-delete="handleDelete"
      />
      <!-- <Button style="margin: 10px 0" type="primary" @click="exportExcel"
        >导出为Csv文件</Button
      > -->
    </Card>
    <Modal
      v-model="userModal"
      title="用户详细信息"
      @on-ok="modifyUserPermission"
      @on-cancel="cancel"
    >
      <Form :model="userInfoForm" :label-width="80">
        <FormItem label="姓名">
          <Input
            v-model="userInfoForm.userNickname"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem label="身份证号">
          <Input
            v-model="userInfoForm.username"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="userInfoForm.gender">
            <Radio label="male">男</Radio>
            <Radio label="female">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="手机">
          <Input
            v-model="userInfoForm.smartphone"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem label="邮箱">
          <Input
            v-model="userInfoForm.email"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem label="账号状态">
          <RadioGroup v-model="userInfoForm.isFreeze">
            <Radio label="0">可使用</Radio>
            <Radio label="1">锁定</Radio>
            <Radio label="2" disabled>未注册</Radio>
          </RadioGroup>
        </FormItem>
        <!-- <FormItem>
          <Button type="primary">Submit</Button>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findAllUser, modifyFreeze } from "@/api/user";
export default {
  name: "tables_page",
  components: {
    Tables,
  },
  data() {
    return {
      columns: [
        { title: "身份证号", key: "username", sortable: true },
        { title: "邮箱", key: "email", sortable: true },
        { title: "账号状态", key: "isFreeze", editable: false },
        {
          title: "操作",
          key: "handle",
          options: ["点击修改"],
          button: [
            (h, params, vm) => {
              return h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  on: {
                    click: () => {
                      // this.remove(params.index);
                      // this.userInfoForm =
                      console.log(
                        "[User manage table]",
                        "{index}",
                        params.index
                      );
                      let curUser = this.originTableData[params.index];
                      let keys = Object.keys(this.userInfoForm);
                      for (const key of keys) {
                        if (curUser[key] == undefined) {
                          this.userInfoForm[key] = "";
                          continue;
                        }
                        if (key == "gender") {
                          this.userInfoForm[key] = curUser[key]
                            ? "male"
                            : "female";
                        } else {
                          this.userInfoForm[key] = curUser[key].toString();
                        }
                      }
                      console.log(
                        "[User manage table]",
                        "{user info form}",
                        this.userInfoForm
                      );
                      // this.userInfoForm.isFreeze = this.originTableData[params.index] = 1 ?
                      this.userModal = true;
                    },
                  },
                },
                "修改"
              );
            },
          ],
        },
      ],
      tableData: [],
      originTableData: [],
      userModal: false,
      userInfoForm: {
        username: "",
        userNickname: "",
        gender: 0,
        smartphone: "",
        email: "",
        isFreeze: 0,
      },
    };
  },
  methods: {
    handleDelete(params) {
      console.log(params);
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`,
      });
    },
    async modifyUserPermission() {
      const freezeObj = {
        username: this.userInfoForm.username,
        isFreeze: Number.parseInt(this.userInfoForm.isFreeze),
      };
      let { data } = await modifyFreeze(freezeObj);
      console.log("[User manager table]", "{data}", data);

      if (data.code === 0) {
        this.findAllUser();
        this.$Message.success({
          background: true,
          content: data.message,
        });
      } else {
        this.$Message.error({
          background: true,
          content: data.message,
        });
      }
    },
    cancel() {},
    findAllUser() {
      findAllUser().then((res) => {
        let { data } = res.data;
        this.originTableData = data;
        this.tableData = data.map((d) => {
          let cp = Object.assign({}, d);
          if (cp.isFreeze == 0) {
            cp.isFreeze = "可使用";
          } else if (cp.isFreeze == 1) {
            cp.isFreeze = "账号锁定";
          } else {
            cp.isFreeze = "未注册";
          }
          return cp;
        });
        console.log("[User manage table]", "{data}", data);
      });
    },
  },
  mounted() {
    // getTableData().then((res) => {
    //   this.tableData = res.data;
    // });
    this.findAllUser();
  },
};
</script>

<style>
</style>