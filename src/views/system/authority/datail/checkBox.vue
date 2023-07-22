<template>
  <div class="class-two">
    <el-checkbox :indeterminate="isIndeterminateOne" v-model="checkAll">
    </el-checkbox>
    <div class="o-title">
      <span>{{ checkData.name }}</span>
    </div>
    <div class="o-content">
      <el-checkbox-group v-model="checkList" @change="handleCheckOneChange">
        <el-checkbox
          v-for="items in checkData.childrens"
          :key="items.id"
          :label="items.id"
          >{{ items.name }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "menuPermissionIds", "checkData", "list"],
  components: {},
  data() {
    return {
      checkList: [],
      isIndeterminateOne: false,
      isCheckAll: this.value,
    };
  },
  watch: {
    menuPermissionIds() {
      const arr = this.checkData.childrens.map((item) => item.id);
      this.checkList = this.value ? arr : [];
      this.$emit("update:list", this.checkList);
      this.isCheckAll = this.value;
    },
  },
  mounted() {
    this.checkList = this.checkData.childrens
      .filter((item) => this.menuPermissionIds.includes(item.id))
      .map((item) => item.id);
    this.$emit("update:list", this.checkList);
  },
  computed: {
    checkAll: {
      get() {
        return this.isCheckAll;
      },
      set(value) {
        const arr = this.checkData.childrens.map((item) => item.id);
        this.checkList = value ? arr : [];
        this.isCheckAll = value;
        this.$emit("update:list", this.checkList);
        this.$emit("input", value);
      },
    },
  },
  methods: {
    handleCheckOneChange() {
      this.isCheckAll = this.checkData.childrens.every((item) =>
        this.checkList.includes(item.id)
      );
      this.$emit("update:list", this.checkList);
      this.$emit("input", this.isCheckAll);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
