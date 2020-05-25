<template>
  <el-pagination
    small
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pageTotal"
  />
</template>
<script>
export default {
  props: {
    resetPageSize: {// 重置页面
      type: Boolean,
      default: false
    },
    dataTotal: {// 总条数
      type: [String, Number],
      default: 0
    },
    tableBegin: {// 总数据
      type: Array,
      default () {
        return []
      }
    },
    pageSizes: {// 分页条数：自定义[10,20,30]
      type: Array,
      default () {
        return [15, 25, 50, 100]
      }
    }
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 15
    }
  },
  computed: {
    pageTotal () { // 分页前总条数：后台读取或直接计算传入数据
      return this.dataTotal || this.tableBegin.length
    }
  },
  watch: {
    tableBegin: {
      immediate: true,
      handler () { // 加载数据:初始化、更新数据
        this.resetSize()
        this.updateData()
      }
    },
    resetPageSize: {
      immediate: false,
      handler () { // 切换路由等:重置分页
        this.resetSize()
      }
    }
  },
  methods: {
    // 跳转到第几页
    handleCurrentChange (val) {
      this.currentPage = val
      this.updateData()
    },
    // 设置分页条数
    handleSizeChange (val) {
      this.resetSize()
      this.pageSize = val
      this.updateData()
    },
    // 重置分页
    resetSize(){
      this.currentPage = 1
      this.pageSize = this.pageSizes[0] || 15
    },
    // 更新数据
    updateData(){
      const begin = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      const tableData = this.tableBegin.slice(begin, end)
      if (this.dataTotal) { // 后台请求：不返回数据
        this.$emit('table-pagination-update', this.currentPage, this.pageSize)
      } else {
        this.$emit('table-pagination-change', tableData, this.currentPage, this.pageSize)
      }
      this.$emit('change', tableData, this.currentPage, this.pageSize)
    }
  }
}
</script>