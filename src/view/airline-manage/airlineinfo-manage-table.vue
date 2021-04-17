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
        @on-delete="deleteAirlineInfo"
      />
      <Button style="margin: 10px 0" type="primary" @click="showAddModal">
        新增飞机 </Button
      >&nbsp;&nbsp;
      <Button style="margin: 10px 0" type="primary" @click="exportExcel">
        导出Excel
      </Button>
    </Card>

    <Modal
      v-model="airlineModal"
      title="用户详细信息"
      @on-ok="resetForm('airlineInfoForm')"
      @on-cancel="resetForm('airlineInfoForm')"
    >
      <Form
        :model="airlineInfoForm"
        :label-width="80"
        ref="airlineInfoForm"
        :rules="ruleValidate"
      >
        <FormItem label="飞机名称" prop="airlineName">
          <Input
            v-model="airlineInfoForm.airlineName"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem label="所属公司" v-if="!isAdd">
          <Input
            v-model="airlineInfoForm.companyName"
            placeholder="Enter something..."
            disabled
          ></Input>
        </FormItem>
        <FormItem label="出发地" prop="city">
          <Select
            v-model="airlineInfoForm.departureCity.cityId"
            style="width: 200px"
          >
            <Option
              v-for="item in cityList"
              :value="item.cityId"
              :key="item.cityId"
              >{{ item.cityName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="目的地" prop="city">
          <Select
            v-model="airlineInfoForm.destinationCity.cityId"
            style="width: 200px"
          >
            <Option
              v-for="item in cityList"
              :value="item.cityId"
              :key="item.cityId"
              >{{ item.cityName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="支持乘坐的乘客" prop="supEntityBOList">
          <CheckboxGroup v-model="airlineInfoForm.supEntityBOList">
            <Checkbox
              v-for="item in ticketTypeList"
              :key="item.ticketTypeId"
              :label="item.ticketTypeId"
            >
              {{ item.ticketTypeName }}
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="modalClickSwitch('airlineInfoForm')">
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
  findAirlineInfo,
  deleteAirlineInfoByAirlineId,
  modifyAirlineInfo,
  addAirlineInfo,
} from "@/api/airline";
import { findAllTicketType } from "@/api/ticket";
import { findAllCity } from "@/api/city";
export default {
  name: "tables_page",
  components: {
    Tables,
  },
  data() {
    return {
      columns: [
        { title: "飞机名称", key: "airlineName", sortable: true },
        { title: "所属公司", key: "companyName" },
        { title: "出发地", key: "departureCity" },
        { title: "目的地", key: "destinationCity" },
        {
          title: "Handle",
          key: "handle",
          options: ["delete", "modify"],
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
                    // vm.$emit(
                    //   "input",
                    //   params.tableData.filter(
                    //     (item, index) => index !== params.row.initRowIndex
                    //   )
                    // );
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
                    this.isAdd = false;
                    this.airlineModal = true;
                    this.airlineInfoForm = this.originTableData[params.index];
                    console.log(
                      "button-airline info form",
                      this.originTableData[params.index],
                      this.airlineInfoForm
                    );
                  },
                },
              });
            },
          ],
        },
      ],
      tableData: [],
      originTableData: [],
      airlineModal: false,
      airlineInfoForm: {
        airlineId: "",
        airlineName: "",
        companyId: "",
        companyName: "",
        departureCity: {
          cityFirstAlp: "",
          cityId: "",
          cityName: "",
        },
        destinationCity: {
          cityFirstAlp: "",
          cityId: "",
          cityName: "",
        },
        supEntityBOList: ["TT1"],
      },
      cityList: [],
      ticketTypeList: [],
      isAdd: false,
      ruleValidate: {
        city: [
          {
            validator: (rule, value, callback) => {
              // console.log(
              //   this.airlineInfoForm.destinationCity.cityId ==
              //     this.airlineinfo.departureCity.cityId
              // );
              if (
                this.airlineInfoForm.destinationCity.cityId ===
                this.airlineInfoForm.departureCity.cityId
              ) {
                callback(new Error("same city"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
          { required: true, message: "please select city", trigger: "blur" },
        ],
        airlineName: [
          { required: true, message: "必须输入飞机名", trigger: "blur" },
        ],
        supEntityBOList: [
          { required: true, message: "必须选择", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetForm(name) {
      this.$refs[name].resetFields();
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `飞机信息-${new Date().valueOf()}.csv`,
      });
    },
    showAddModal() {
      this.isAdd = true;
      this.airlineModal = true;
      //制空
      this.airlineInfoForm = {
        airlineId: "",
        airlineName: "",
        companyId: "",
        companyName: "",
        departureCity: {
          cityFirstAlp: "",
          cityId: "",
          cityName: "",
        },
        destinationCity: {
          cityFirstAlp: "",
          cityId: "",
          cityName: "",
        },
        supEntityBOList: [],
      };
    },
    addAirlineInfo(subForm) {
      subForm.companyId = this.$store.state.user.companyId;
      addAirlineInfo(subForm).then((res) => {
        this.$Message.info({
          content: res.data.message,
        });
        if (res.data.code === 0) {
          this.findAirlineInfo();
        }
      });
    },
    deleteAirlineInfo(param) {
      // console.log(airlineId);
      console.log(
        "[airline info manage table]",
        "{airline id}",
        this.originTableData[param.index].airlineId
      );
      deleteAirlineInfoByAirlineId(
        this.originTableData[param.index].airlineId
      ).then((res) => {
        console.log("[airline info manage table]", "{data}", res.data);
        this.$Message.info({
          content: res.data.message,
          duration: 10,
        });
      });
    },
    modalClickSwitch(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          this.$Message.info(`输入的参数出错`);
          return;
        } else {
          console.log(this.airlineInfoForm);
          let subForm = Object.assign({}, this.airlineInfoForm);
          subForm.supEntityBOList = this.airlineInfoForm.supEntityBOList.map(
            (sup) => {
              let ret = {
                ticketTypeId: sup,
              };
              return ret;
            }
          );
          console.log(subForm);
          if (!this.isAdd) {
            this.modifyAirlineInfo(subForm);
          } else {
            this.addAirlineInfo(subForm);
          }
        }
      });
    },
    modifyAirlineInfo(subForm) {
      modifyAirlineInfo(subForm).then((res) => {
        this.$Message.error({ content: "Fail!" });
        if (res.data.code === 0) {
          this.findAirlineInfo();
        }
      });
    },
    findAllCity() {
      findAllCity().then((res) => {
        this.cityList = res.data.data.flatMap((cities) => cities.cityList);
        console.log("city list", this.cityList);
      });
    },
    async findAllTicketType() {
      let { data } = await findAllTicketType();
      this.ticketTypeList = data.data;
    },
    async findAirlineInfo() {
      // console.log(this.$store.state.user.companyId);
      const { data } = await findAirlineInfo({
        companyId: this.$store.state.user.companyId,
      });
      this.originTableData = data.data.map((airlineinfo) => {
        let ret = Object.assign({}, airlineinfo);
        ret.supEntityBOList = airlineinfo.supEntityBOList.flatMap((a) => {
          return a.ticketTypeId;
        });
        return ret;
      });
      this.tableData = data.data.map((airlineinfo) => {
        let ret = Object.assign({}, airlineinfo);
        ret.departureCity = airlineinfo.departureCity.cityName;
        ret.destinationCity = airlineinfo.destinationCity.cityName;
        ret.supEntityBOList = airlineinfo.supEntityBOList.flatMap((a) => {
          return a.ticketTypeId;
        });
        return ret;
      });
      console.log(data, this.originTableData, this.tableData);
    },
  },
  mounted() {
    this.findAirlineInfo();
    this.findAllTicketType();
    this.findAllCity();
  },
};
</script>

<style>
</style>