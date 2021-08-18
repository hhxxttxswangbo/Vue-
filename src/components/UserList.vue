<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>

    <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名。-->
    <!-- 用户的表格 -->
    <el-table :data="userList" stripe border>
      <!-- 索引列 -->
      <el-table-column type="index" label="#"></el-table-column>
      <!-- 用户名这一列 -->
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="年龄" prop="age"></el-table-column>
      <el-table-column label="头衔" prop="position"></el-table-column>
      <!-- 自定义创建时间格式 -->
      <el-table-column label="创建时间">
        <!-- 里面放一个模板结构渲染到el-table-column里的默认插槽里 -->
        <!-- 添加作用域插槽 -->
        <!-- 用v-slot:default接收组件el-table-column传递出来的数据，用scope接收 -->
        <template v-slot:default="scope">
          <!-- dateFormat对时间进行格式化,在main.js中配置 -->
          <!-- scope.row拿到当前行的数据 -->
          {{ scope.row.addtime | dateFormat }}
        </template>
      </el-table-column>

      <el-table-column>
        <template v-slot:default="{ row }">
          <router-link :to="'/users/' + row.id">详情</router-link>&nbsp;
          <!-- 删除操作需要知道id -->
          <a href="#" @click.prevent="onRemove(row.id)">删除</a>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="onDialogClosd"
    >
      <!-- 添加用户的表单 -->
      <el-form
        :model="form"
        label-width="80px"
        :rules="formRules"
        ref="myaddForm"
      >
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="用户年龄" prop="age">
          <el-input v-model.number="form.age"></el-input>
        </el-form-item>
        <el-form-item label="用户头衔" prop="position">
          <el-input v-model="form.position"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddNewUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserList",
  data() {
    //声明检验年龄的函数
    var checkAge = (rule, value, callback) => {
      if (!Number.isInteger(value)) {
        return callback(new Error("请填写整数"));
      }

      if (value > 100 || value < 1) {
        return callback(new Error("年龄在1-100之间"));
      }

      callback();
    };

    return {
      userList: [],
      //控制添加对话框的显示与隐藏
      dialogVisible: false,
      //要采集的用户的信息对象
      form: {
        name: "",
        age: "",
        position: "",
      },
      //表单的验证规则
      formRules: {
        name: [
          { required: true, message: "姓名是别填项目", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
        age: [
          { required: true, message: "年龄是别填项目", trigger: "blur" },
          { validator: checkAge, trigger: "blur" },
        ],
        position: [
          { required: true, message: "头衔是别填项目", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("/api/users");
      if (res.status !== 0) return console.log("用户列表数据获取失败！");
      this.userList = res.data;
      console.log(this.userList);
    },
    onDialogClosd() {
      this.$refs.myaddForm.resetFields();
    },
    onAddNewUser() {
      this.$refs.myaddForm.validate(async (valid) => {
        if (!valid) return;
        //需要执行添加的业务处理
        const { data: res } = await this.$http.post("/api/users", this.form);
        // console.log(res);
        if (res.status !== 0) return this.$message.error("添加失败");
        this.$message.success("添加成功！");
        this.dialogVisible = false;
        //重新发送请求，刷新列表数据
        this.getUserList();
      });
    },
    async onRemove(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmResult);
      if (confirmResult != "confirm") return this.$message.info("取消了删除");
      const { data: res } = await this.$http.delete("/api/users/" + id);
      if (res.status != 0) return this.$message.error("删除失败");
      this.$message.success("删除成功！");
      this.getUserList();
    },
  },
};
</script>

<style>
</style>