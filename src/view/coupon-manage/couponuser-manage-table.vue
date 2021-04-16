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
      <Button style="margin: 10px 0" type="primary" @click="showAddModal"
        >新增关联</Button
      >
    </Card>

    <Modal
      v-model="couponModal"
      title="优惠券详细信息"
      @on-ok="resetForm('couponForm')"
      @on-cancel="resetForm('couponForm')"
    >
      <Form
        :model="couponForm"
        :label-width="80"
        :rules="ruleValidate"
        ref="couponForm"
      >
        <FormItem label="优惠券名称" prop="couponName">
          <Select v-model="couponForm.couponId" style="width: 200px">
            <Option
              v-for="item in couponList"
              :value="item.couponId"
              :key="item.couponId"
              >{{ item.couponName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="用户" prop="couponName">
          <Select v-model="couponForm.username" style="width: 200px">
            <Option
              v-for="item in userList"
              :value="item.username"
              :key="item.username"
              >身份证号{{ item.username }}--姓名{{ item.userNickname }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="addRelationship('couponForm')">
            提交
          </Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  findCouponAllInfo,
  findCoupon,
  addRelationship,
  deleteRelationship,
} from "@/api/coupon";
import { findAllUser } from "@/api/user";
export default {
  name: "tables_page",
  components: {
    Tables,
  },
  data() {
    return {
      columns: [
        { title: "优惠券名称", key: "couponName", sortable: true },
        { title: "用户身份证", key: "username", sortable: true },
        { title: "用户姓名", key: "userNickname", sortable: true },
        {
          title: "Handle",
          key: "handle",
          options: ["delete"],
          button: [
            (h, params, vm) => {
              return h("Poptip", {
                props: {
                  confirm: true,
                  title: "你确定要删除吗?",
                },
                on: {
                  "on-ok": () => {
                    vm.$emit("on-delete", params);
                    vm.$emit(
                      "input",
                      params.tableData.filter(
                        (item, index) => index !== params.row.initRowIndex
                      )
                    );
                  },
                },
              });
            },
          ],
        },
      ],
      tableData: [],
      couponList: [],
      userList: [],
      isAdd: false,
      couponModal: false,
      couponForm: {
        username: "",
        userNickname: "",
        couponId: "",
        couponName: "",
      },
      ruleValidate: {
        username: [{ required: true, message: "不能为空", trigger: "blur" }],
        couponId: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleDelete(params) {
      console.log(params);
      let subForm = Object.assign({}, this.tableData[params.index]);
      deleteRelationship(subForm).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success(data.message);
          this.findAllCouponAllInfo();
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    showAddModal() {
      this.couponModal = true;
      this.isAdd = true;
      this.couponForm = {
        username: "",
        userNickname: "",
        couponId: "",
        couponName: "",
      };
    },
    resetForm(name) {
      this.$refs[name].resetFields();
    },
    addRelationship() {
      let subForm = Object.assign({}, this.couponForm);
      console.log("sub form", subForm);
      addRelationship(subForm).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success(data.message);
          this.findAllCouponAllInfo();
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    findAllCouponAllInfo() {
      findCouponAllInfo().then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.tableData = data.data;
        }
      });
    },
    findALlCoupon() {
      findCoupon({}).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.couponList = data.data;
        }
      });
    },
    findAllUser() {
      findAllUser().then((res) => {
        const { data } = res;
        if (data.code === 0) this.userList = data.data;
      });
    },
  },
  mounted() {
    this.findAllCouponAllInfo();
    this.findALlCoupon();
    this.findAllUser();
  },
};
</script>

<style>
</style>