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
        @on-save-edit="changeTickeTypeName"
      />
    </Card>
  </div>
</template>

<script>
import Tables from "_c/tables";
import { findAllTicketType, modifyTicketType } from "@/api/ticket";
export default {
  name: "tables_page",
  components: {
    Tables,
  },
  data() {
    return {
      columns: [
        {
          type: "index",
          key: "ticketTypeId",
          // align: "center",
          title: "机票类型编号",
          sortable: true,
        },
        {
          title: "机票类型名",
          key: "ticketTypeName",
          sortable: true,
          editable: true,
        },
      ],
      tableData: [],
    };
  },
  methods: {
    handleDelete(params) {
      console.log(params);
    },
    findAllTicketType() {
      findAllTicketType().then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.tableData = data.data;
        }
      });
    },
    changeTickeTypeName(param) {
      const supEntity = this.tableData[param.index];
      modifyTicketType(supEntity).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success({
            content: data.message,
          });
          this.findAllTicketType();
        } else {
          this.$Message.error({
            content: data.message,
          });
        }
      });
    },
  },
  mounted() {
    this.findAllTicketType();
  },
};
</script>

<style >
</style>