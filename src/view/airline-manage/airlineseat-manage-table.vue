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
        >新增航班</Button
      >&nbsp;&nbsp;
      <Button style="margin: 10px 0" type="primary" @click="exportExcel">
        导出Excel
      </Button>
    </Card>

    <Modal
      v-model="airlineSeatModal"
      title="航班详细信息"
      @on-ok="resetForm('airlineSeatForm')"
      @on-cancel="resetForm('airlineSeatForm')"
    >
      <Form
        :model="airlineSeatForm"
        :label-width="80"
        :rules="ruleValidate"
        ref="airlineSeatForm"
      >
        <FormItem label="飞机名称" prop="airlineId">
          <Select
            v-model="airlineSeatForm.airlineId"
            style="width: 200px"
            :disabled="!isAdd"
          >
            <Option
              v-for="item in airlineInfoList"
              :value="item.airlineId"
              :key="item.airlineId"
              >{{ item.airlineName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="出发时间" prop="airlineDate">
          <DatePicker
            v-model="airlineSeatForm.airlineDate"
            type="datetime"
            placeholder="Select date and time"
            style="width: 200px"
            :options="datetimepickrule"
          ></DatePicker>
        </FormItem>
        <FormItem label="持续时长">
          <InputNumber
            :max="24"
            :min="0.5"
            :step="0.5"
            v-model="airlineSeatForm.hours"
          ></InputNumber
          >&nbsp;h
        </FormItem>
        <FormItem
          v-for="(item, index) in airlineSeatForm.seatBOList"
          :key="item.seatTypeId"
          :label="item.seatTypeName"
        >
          $&nbsp;<InputNumber
            :max="2000"
            :min="1"
            :step="0.1"
            v-model="airlineSeatForm.seatBOList[index].price"
          ></InputNumber>
          总票数：<InputNumber
            :max="2000"
            :min="1"
            :step="0.1"
            :disabled="!isAdd"
            v-model="airlineSeatForm.seatBOList[index].tot"
          ></InputNumber>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="modalClickSwitch('airlineSeatForm')">
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
  findAirlineSeat,
  findAirlineInfo,
  addAirlineSeat,
  deleteAirlineSeatById,
  modifyAirlineSeat,
} from "@/api/airline";
export default {
  name: "tables_page",
  components: {
    Tables,
  },
  data() {
    return {
      columns: [
        { title: "飞机名称", key: "airlineName", sortable: true },
        { title: "出发地", key: "departureCity" },
        { title: "目的地", key: "destinationCity" },
        { title: "时长(h)", key: "hours", sortable: true },
        { title: "出发时间", key: "airlineDate", sortable: true },
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
                    this.isAdd = false;
                    this.airlineSeatModal = true;
                    const cur = this.originTableData[params.index];
                    const keys = Object.keys(this.airlineSeatForm);
                    for (const key of keys) {
                      if (cur[key] == undefined || cur[key] == null) continue;
                      this.airlineSeatForm[key] = cur[key];
                    }
                    console.log(
                      "button-airline info form",
                      this.originTableData[params.index]
                    );
                  },
                },
              });
            },
          ],
        },
      ],
      datetimepickrule: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
      tableData: [],
      originTableData: [],
      airlineInfoList: [],
      isAdd: false,
      airlineSeatModal: false,
      ruleValidate: {
        airlineId: [{ required: true, message: "不能为空", trigger: "blur" }],
        // airlineDate: [{ required: true, message: "不能为空", trigger: "blur" }],
        // hours: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      airlineSeatForm: {
        airlineId: "",
        airlineSeatId: "",
        airlineDate: "",
        hours: 1,
        seatBOList: [
          {
            seatTypeId: "ST1",
            seatTypeName: "经济舱",
            remain: 0,
            tot: 1,
            price: 1,
          },
          {
            seatTypeId: "ST2",
            seatTypeName: "商务舱",
            remain: 0,
            tot: 1,
            price: 1,
          },
          {
            seatTypeId: "ST3",
            seatTypeName: "头等舱",
            remain: 0,
            tot: 1,
            price: 1,
          },
        ],
      },
    };
  },
  methods: {
    handleDelete(params) {
      console.log(params);
      const airlineSeatId = this.originTableData[params.index].airlineSeatId;
      deleteAirlineSeatById(airlineSeatId).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success({
            content: data.message,
          });
        } else {
          this.message.error({
            content: data.message,
          });
        }
      });
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `航班信息-${new Date().valueOf()}.csv`,
      });
    },
    showAddModal() {
      this.isAdd = true;
      this.airlineSeatModal = true;
      //制空
      this.airlineSeatForm = {
        airlineId: "",
        airlineSeatId: "",
        airlineDate: new Date().toString(),
        hours: 0,
        seatBOList: [
          {
            seatTypeId: "ST1",
            seatTypeName: "经济舱",
            remain: 0,
            tot: 1,
            price: 1,
          },
          {
            seatTypeId: "ST2",
            seatTypeName: "商务舱",
            remain: 0,
            tot: 1,
            price: 1,
          },
          {
            seatTypeId: "ST3",
            seatTypeName: "头等舱",
            remain: 0,
            tot: 1,
            price: 1,
          },
        ],
      };
    },
    findAirlineInfoListByCompanyId() {
      findAirlineInfo({ companyId: this.$store.state.user.companyId }).then(
        (res) => {
          const { data } = res;
          this.airlineInfoList = data.data;
        }
      );
    },
    addAirlineSeat(subForm) {
      addAirlineSeat(subForm).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.findAirlineSeatByCompanyId();
          this.$Message.success({
            content: data.message,
          });
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    modifyAirlineSeat(subForm) {
      console.log("----modify");
      modifyAirlineSeat(subForm).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.findAirlineSeatByCompanyId();
          this.$Message.success({
            content: data.message,
          });
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    findAirlineSeatByCompanyId() {
      findAirlineSeat({ companyId: this.$store.state.user.companyId }).then(
        (res) => {
          const { data } = res;
          this.originTableData = data.data;
          this.tableData = data.data.map((airlineSeat) => {
            let ret = Object.assign({}, airlineSeat);
            ret.departureCity = airlineSeat.departureCity.cityName;
            ret.destinationCity = airlineSeat.destinationCity.cityName;
            return ret;
          });
        }
      );
    },
    resetForm(name) {
      this.$refs[name].resetFields();
    },
    modalClickSwitch(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let subForm = Object.assign({}, this.airlineSeatForm);
          subForm.millisecond = this.airlineSeatForm.hours * 1000 * 60 * 60;
          subForm.airlineDate = formatDate(
            this.airlineSeatForm.airlineDate,
            "yyyy-MM-dd hh:mm:ss"
          );
          console.log("[airline seat manage table]", "{form}", subForm);
          if (!this.isAdd) {
            this.modifyAirlineSeat(subForm);
          } else {
            this.addAirlineSeat(subForm);
          }
        } else {
          this.$Message.error("填写的参数出错");
        }
      });
    },
  },
  mounted() {
    this.findAirlineInfoListByCompanyId();
    this.findAirlineSeatByCompanyId();
  },
};
</script>

<style>
</style>