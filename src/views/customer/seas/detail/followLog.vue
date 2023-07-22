<template>
  <div>
    <el-timeline v-if="followList.length"
                 class="follow">
      <el-timeline-item :timestamp="$moment(item.createTime).format('YYYY-MM')"
                        v-for="(item, index) in followList"
                        :key="index"
                        placement="top">
        <div class="box">
          <div class="follow-box">
            <div class="x-left">
              <label>{{ item.userName }}</label>
              <span>{{ $moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div class="x-right"
                 @click="followDelete(item.id,$index)">×</div>
          </div>
          <div class="tack_title"
               v-if="!item.content">
            <span class="el-timeline-item__timestamp">创建了任务：</span>
            <a class="link"
               @click="toTask('view',item.taskId)">{{item.taskName}}</a>
          </div>
          <div class="content"
               v-if="item.content"
               v-html="item.content">
            {{ item.content }}
          </div>
          <div class="content"
               v-if="item.followFiles">
            <el-image style="width: 100px; height: 100px;cursor: pointer;"
                      v-for="(child, i) in item.followFiles"
                      :src="child.fileUrl"
                      :key="i"
                      @click="showImg(child)"
                      fit="cover"></el-image>
          </div>
          <div class="content"
               v-if="item.followTypeStr">
            <el-tag type>{{ item.followTypeStr }}</el-tag>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div class="noFollow"
         v-else>
      暂无客户动态
    </div>
    <pagination v-show="total > 0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                class="text-right"
                @pagination="getCustomerFollow" />
    <my-dialog :visible.sync="imgDialogVisible"
               :append-to-body="true"
               top="10vh">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </my-dialog>
    <addTask :showDialog.sync="showAddDialog"
             :typeOptions="typeOptions" />
  </div>
</template>

<script>
import { getCustomerFollow, followDelete } from "@/api/customer/customer";
import addTask from '../../../work/addTask'
export default {
  props: {
    customerCrmId: {
      required: true,
      type: [Number, String],
      default: ""
    }
  },
  data () {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      total: 0,
      imgDialogVisible: false,
      dialogImageUrl: "",
      followList: [],
      typeOptions: {},
      showAddDialog: false
    };
  },
  components: {
    addTask
  },
  mounted () {
    this.getCustomerFollow();
  },
  methods: {
    // 公共提示窗
    hint (value) {
      return this.$confirm(value, "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "info"
      }).catch();
    },
    // 删除客户跟进记录
    followDelete (id, index) {
      this.hint("确定要删除该条跟进记录？").then(res => {
        if (res) {
          followDelete({
            customerCrmId: this.customerCrmId,
            ids: id
          }).then(res => {
            this.followList.splice(index, 1);
            this.$message({ message: res.resp_msg, type: 'success' });
          });
        }
      });
    },
    toTask (type, val) {
      this.typeOptions = {
        type: "1",
        optionType: type,
        option: { id: val }
      };
      this.showAddDialog = true;
    },
    getCustomerFollow () {
      getCustomerFollow({
        customerCrmId: this.customerCrmId,
        ...this.listQuery
      }).then(res => {
        const data = res.data;
        this.followList = data.data;
        this.total = data.count;
      });
    },
    showImg (value) {
      const { fileUrl } = value;
      if (fileUrl) {
        this.dialogImageUrl = fileUrl;
        this.imgDialogVisible = true;
      }
    }
  }
};
</script>

<style lang="scss" scope>
.content {
  padding: 10px 0;
  .el-image {
    margin-right: 10px;
  }
}
.el-timeline-item__timestamp {
  color: #333;
  font-size: 16px;
}
.el-timeline-item__content {
  margin-right: 30px;
}
.follow-box {
  display: flex;
  justify-content: space-between;
  label {
    margin-right: 20px;
  }
  .x-right {
    font-size: 30px;
    cursor: pointer;
  }
  .x-left {
    span {
      color: #999;
    }
  }
}
.text-right {
  margin-bottom: 20px;
}
.noFollow {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  height: 419px;
}
.box {
  border: 1px solid rgba(215, 232, 244, 1);
  padding: 10px;
  border-radius: 4px;
  background: rgba(247, 251, 254, 1);
}
</style>
