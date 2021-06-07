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
        >新增静态问题</Button
      >
      &nbsp;&nbsp;
      <Button type="error" @click="deleteQuestionByIds"> 批量删除 </Button>
    </Card>

    <Modal
      v-model="questionModal"
      title="航班详细信息"
      @on-ok="resetForm('questionForm')"
      @on-cancel="resetForm('questionForm')"
    >
      <Form
        :model="questionForm"
        :label-width="80"
        :rules="ruleValidate"
        ref="questionForm"
      >
        <FormItem label="标题" prop="qtitle">
          <Input
            v-model="questionForm.qtitle"
            placeholder="Enter something..."
          ></Input>
        </FormItem>
        <FormItem label="内容" prop="qcontent">
          <!-- <Input
            v-model="questionForm.qcontent"
            placeholder="Enter something..."
          ></Input> -->
          <Input
            v-model="questionForm.qcontent"
            type="textarea"
            placeholder="Enter something..."
          />
        </FormItem>
        <FormItem label="时间" prop="date">
          <DatePicker
            v-model="questionForm.date"
            type="datetime"
            placeholder="Select date and time"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="modalClickSwitch('questionForm')">
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
  findAllQuestion,
  addQuestion,
  deleteQuestion,
  modifyQuestion,
} from "@/api/question";
export default {
  name: "tables_page",
  components: {
    Tables,
  },
  data() {
    return {
      columns: [
        { key: "qid", type: "selection", width: 60, align: "center" },
        { title: "标题", key: "qtitle", sortable: true },
        { title: "内容", key: "qcontent" },
        { title: "时间", key: "date", sortable: true },
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
                    const qf = Object.assign({}, this.tableData[params.index]);
                    this.questionForm = qf;
                    this.questionModal = true;
                  },
                },
              });
            },
          ],
        },
      ],
      tableData: [],
      selectQIdList: [],
      isAdd: false,
      questionModal: false,
      inputMaxLenght: 200,
      questionForm: {
        qid: "",
        qcontent: "",
        date: "",
        qtitle: "",
      },
      ruleValidate: {
        qtitle: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        qcontent: [{ required: true, message: "不能为空", trigger: "blur" }],
        date: [
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
      this.selectQIdList = [this.tableData[params.index].qid];
      this.deleteQuestionByIds();
    },
    selectChange(selection) {
      this.selectQIdList = selection.map((question) => question.qid);
      console.log("select q id list", this.selectQIdList);
    },
    showAddModal() {
      this.isAdd = true;
      this.questionModal = true;
      //制空
      this.questionForm = {
        qid: "",
        qcontent: "",
        date: new Date(),
        qtitle: "",
      };
    },
    modalClickSwitch(name) {
      this.$refs[name].validate((valid) => {
        console.log(valid);
        if (valid) {
          let subForm = Object.assign({}, this.questionForm);
          console.log("submit form", subForm);
          subForm.date = formatDate(
            this.questionForm.date,
            "yyyy-MM-dd hh:mm:ss"
          );
          console.log("[question manage table]", "{form}", subForm);
          if (!this.isAdd) {
            this.modifyQuestion(subForm);
          } else {
            this.addQuestion(subForm);
          }
        } else {
          this.$Message.error("填写的参数出错");
        }
      });
    },
    modifyQuestion(subForm) {
      console.log("update form", subForm);
      modifyQuestion(subForm).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success({ content: data.message });
          this.findAllQuestion();
        } else {
          this.$Message.error({ content: data.message });
        }
      });
    },
    addQuestion(subForm) {
      console.log("add form", subForm);
      addQuestion(subForm).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success({ content: data.message });
          this.findAllQuestion();
        } else {
          this.$Message.error({ content: data.message });
        }
      });
    },
    findAllQuestion() {
      findAllQuestion({}).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          // this.$Message.success({
          //   content: data.message,
          // });
          this.tableData = data.data;
        } else {
          // this.$Message.error({
          //   content: data.message,
          // });
        }
      });
    },
    deleteQuestionByIds() {
      if (this.selectQIdList.length == 0) {
        this.$Message.error("未选中任何问题");
        return;
      }
      console.log("delete id list", this.selectQIdList);
      deleteQuestion({ qidList: this.selectQIdList }).then((res) => {
        const { data } = res;
        if (data.code === 0) {
          this.$Message.success(data.message);
          this.findAllQuestion();
        } else {
          this.$Message.error(data.message);
        }
      });
    },
    resetForm(name) {
      this.$refs[name].resetFields();
    },
  },
  mounted() {
    this.findAllQuestion();
  },
};
</script>

<style>
</style>