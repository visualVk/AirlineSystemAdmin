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
        @on-selection-change="selectChange"
      />
      <Button style="margin: 10px 0" type="primary" @click="showAddModal"
        >添加优惠券</Button
      >&nbsp;&nbsp;
      <Button style="margin: 10px 0" type="error" @click="deleteCouponByIds"
        >批量删除优惠券</Button
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
        <FormItem label="标题" prop="couponName">
          <Input
            v-model="couponForm.couponName"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem label="内容" prop="couponDetail">
          <Input
            v-model="couponForm.couponDetail"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem label="截止时间" prop="deadline">
          <DatePicker
            v-model="couponForm.deadline"
            type="datetime"
            placeholder="Select date and time"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="modalClickSwitch('couponForm')">
            提交
          </Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { formatDate } from "@/libs/util";
import {
  findCoupon,
  deleteCoupon,
  modifyCoupon,
  addCoupon,
} from "@/api/coupon";
export default {
  name: "tables_page",
  components: {
    Tables,
  },
  data() {
    return {
      columns: [
        { key: "couponId", type: "selection", width: 60, align: "center" },
        { title: "优惠券名称", key: "couponName", sortable: true },
        { title: "优惠券内容", key: "couponDetail", editable: true },
        { title: "截止日期", key: "deadline" },
        { title: "是否有效", key: "isValid" },
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
            (h, params, vm) => {
              return h("Button", {
                props: {
                  type: "primary",
                  shape: "circle",
                  icon: "ios-more",
                },
                on: {
                  click: () => {
                    // this.remove(params.index);
                    console.log(this.tableData);
                    this.isAdd = false;
                    const cf = Object.assign({}, this.tableData[params.index]);
                    this.couponForm = cf;
                    this.couponModal = true;
                  },
                },
              });
            },
          ],
        },
      ],
      tableData: [],
      originTableDate: [],
      selectCouponIdList: [],
      isAdd: false,
      couponModal: false,
      couponForm: {
        couponId: "",
        couponName: "",
        couponDetail: "",
        deadline: "",
        // isValid: "",
      },
      ruleValidate: {
        couponName: [{ required: true, message: "不能为空", trigger: "blur" }],
        couponDetail: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        deadline: [
          {
            required: true,
            type: "date",
            message: "不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleDelete(params) {
      console.log(params);
      this.selectCouponIdList = [this.tableData[params.index].couponId];
      this.deleteCouponByIds();
    },
    selectChange(selection) {
      this.selectCouponIdList = selection.map((coupon) => coupon.couponId);
      console.log("select coupon id list", this.selectCouponIdList);
    },
    resetForm(name) {
      this.$refs[name].resetFields();
    },
    showAddModal() {
      this.isAdd = true;
      this.couponModal = true;
      //制空
      this.couponForm = {
        couponId: "",
        couponName: "",
        deadline: new Date(),
        couponDetail: "",
      };
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`,
      });
    },
    modalClickSwitch(name) {
      this.$refs[name].validate((valid) => {
        console.log(valid);
        if (valid) {
          let subForm = Object.assign({}, this.couponForm);
          subForm.deadline = formatDate(
            this.couponForm.deadline,
            "yyyy-MM-dd hh:mm:ss"
          );
          console.log(
            "[coupon info manage table]",
            "{form}",
            subForm,
            this.isAdd
          );
          if (!this.isAdd) {
            this.modifyCoupon(subForm);
          } else {
            this.addCoupon(subForm);
          }
        } else {
          this.$Message.error("填写的参数出错");
        }
      });
    },
    modifyCoupon(subForm) {
      console.log("modify form", subForm);
      subForm.isValid = false;
      modifyCoupon(subForm).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success(data.message);
          this.findAllCoupon();
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    addCoupon(subForm) {
      console.log("add form", subForm);
      subForm.isValid = false;
      addCoupon(subForm).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success(data.message);
          this.findAllCoupon();
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    deleteCouponByIds() {
      console.log("delete id list", this.selectCouponIdList);
      deleteCoupon({ couponIdList: this.selectCouponIdList }).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success(data.message);
          this.findAllCoupon();
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    findAllCoupon() {
      findCoupon({}).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.originTableDate = data.data;
          this.tableData = data.data.map((coupon) => {
            let c = Object.assign({}, coupon);
            c.isValid = coupon.isValid ? "有效" : "无效";
            return c;
          });
        }
      });
    },
  },
  mounted() {
    this.findAllCoupon();
  },
};
</script>

<style>
</style>