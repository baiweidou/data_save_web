// 创建Vue实例
new Vue({
  el: '#app',
  data() {
    return {
      // 表单数据
      form: {
        phoneNumber: ''
      },
      // 表单验证规则
      rules: {
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
        ]
      },
      // 表格数据
      tableData: [],
      // 加载状态
      loading: false,
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 图片预览对话框
      dialogVisible: false,
      currentImage: '',
      // 所有数据（用于前端分页）
      allData: []
    };
  },
  created() {
    // 页面加载时获取数据
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true;
      axios.get('/api/data')
        .then(response => {
          this.allData = response.data;
          this.total = this.allData.length;
          this.updateTableData();
          this.loading = false;
        })
        .catch(error => {
          console.error('获取数据失败:', error);
          this.$message.error('获取数据失败');
          this.loading = false;
        });
    },
    
    // 更新表格数据（前端分页）
    updateTableData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.tableData = this.allData.slice(start, end);
    },
    
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 如果没有使用上传组件，则直接提交表单
          axios.post('/api/data', { phoneNumber: this.form.phoneNumber })
            .then(response => {
              this.$message.success('添加成功');
              this.resetForm();
              this.fetchData();
            })
            .catch(error => {
              console.error('添加失败:', error);
              this.$message.error(error.response?.data?.message || '添加失败');
            });
        } else {
          return false;
        }
      });
    },
    
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
    },
    
    // 上传成功回调
    handleUploadSuccess(response, file) {
      this.$message.success('上传成功');
      this.resetForm();
      this.fetchData();
    },
    
    // 上传失败回调
    handleUploadError(error) {
      console.error('上传失败:', error);
      this.$message.error(error.response?.data?.message || '上传失败');
    },
    
    // 上传前验证
    beforeUpload(file) {
      // 验证手机号
      if (!this.form.phoneNumber) {
        this.$message.error('请先输入手机号');
        return false;
      }
      
      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.form.phoneNumber)) {
        this.$message.error('请输入有效的手机号码');
        return false;
      }
      
      // 验证文件类型
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片文件');
        return false;
      }
      
      // 验证文件大小
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('图片大小不能超过5MB');
        return false;
      }
      
      return true;
    },
    
    // 显示大图
    showLargeImage(imageUrl) {
      this.currentImage = imageUrl;
      this.dialogVisible = true;
    },
    
    // 删除数据
    handleDelete(row) {
      this.$confirm('确认删除该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(`/api/data/${row._id}`)
          .then(response => {
            this.$message.success('删除成功');
            this.fetchData();
          })
          .catch(error => {
            console.error('删除失败:', error);
            this.$message.error('删除失败');
          });
      }).catch(() => {
        // 取消删除
      });
    },
    
    // 刷新数据
    refreshData() {
      this.fetchData();
    },
    
    // 格式化日期
    formatDate(row, column) {
      const date = new Date(row.createdAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    },
    
    // 每页显示条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.updateTableData();
    },
    
    // 当前页变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.updateTableData();
    }
  }
}); 