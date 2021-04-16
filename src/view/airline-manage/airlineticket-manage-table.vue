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
      <Button style="margin: 10px 0" type="primary" @click="cancelOrder"
        >批量取消订单</Button
      >
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findAirlineTicket, cancelOrder } from "@/api/ticket";
export default {
  name: "tables_page",
  components: {
    Tables,
  },
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          key: "ticketId",
          title: "机票编号",
        },
        { title: "身份证号", key: "username", sortable: true },
        { title: "姓名", key: "userNickname", sortable: true },
        { title: "航班编号", key: "airlineSeatId", sortable: true },
        { title: "出发时间", key: "airlineDate", sortable: true },
        { title: "订单状态", key: "status", sortable: true },
        {
          title: "Handle",
          key: "handle",
          options: [],
          button: [
            (h, params, vm) => {
              return h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    title: "确定取消订单?",
                  },
                  on: {
                    "on-ok": () => {
                      if (this.originTableData[params.index].status == 2) {
                        this.$Message.error("该订单已取消，请勿重复取消");
                        return;
                      }
                      vm.$emit("on-delete", params);
                    },
                  },
                },
                [
                  h("Button", {
                    props: {
                      type: "error",
                      shape: "circle",
                      icon: "ios-trash",
                    },
                  }),
                ]
              );
            },
          ],
        },
      ],
      tableData: [],
      originTableData: [],
      selectTicketList: [],
    };
  },
  methods: {
    handleDelete(params) {
      console.log(params);
      this.selectTicketList = [this.originTableData[params.index].ticketId];
      console.log(this.selectTicketList);
      this.cancelOrder();
    },
    findTicketByCompanyId() {
      findAirlineTicket({
        companyId: this.$store.state.user.companyId,
      }).then((res) => {
        const { data } = res.data;
        console.log(data);
        this.originTableData = data;
        this.tableData = data.slice(0, data.length).map((ticket) => {
          let ret = Object.assign({}, ticket);
          switch (ret.status) {
            case 0:
              ret.status = "未支付";
              break;
            case 1:
              ret.status = "已支付";
              break;
            case 2:
              ret.status = "已取消";
              break;
            case 3:
              ret.status = "等票已支付";
              break;
            case 4:
              ret.status = "等票未支付";
              break;
            case 5:
              ret.status = "机票已使用";
              break;
            default:
              break;
          }
          return ret;
        });
      });
    },
    cancelOrder() {
      const cancelData = { ticketIdList: this.selectTicketList };
      console.log("cancel data", cancelData);
      cancelOrder(cancelData).then((res) => {
        console.log("cancel res", res);
        const { data } = res;
        if (data.code == 0) {
          this.findTicketByCompanyId();
          this.$Message.success({
            content: data.message,
          });
        }
      });
    },
    selectChange(selection) {
      console.log("selection", selection);
      this.selectTicketList = selection.map((ticket) => {
        return ticket.ticketId;
      });
    },
  },
  mounted() {
    this.findTicketByCompanyId();
  },
};
</script>

<style>
</style>