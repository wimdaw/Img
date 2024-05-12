new Vue({
  el: "#app",
  data() {
    return {
      selectedApi: "api",
      url: '',
      outputTypes: [
        { title: 'URL', key: 'URL', template: '#url#' },
        { title: 'Markdown', key: 'Markdown', template: '![image](#url#)' },
        { title: 'BBCode', key: 'BBCode', template: '[img]#url#[/img]' }
      ],
      currentOutputType: 'URL',
    };
  },
  computed: {
    uploadAction() {
      return `https://cdn.jsdelivr.net/gh/wimdaw/Img/api/${this.selectedApi}.php`;
    },
    result() {
      if (!this.url) return '';
      const template = this.outputTypes.find(type => type.key === this.currentOutputType)?.template;
      return template.replace('#url#', this.url);
    },
  },
  methods: {
    async handleSuccess(response) {
      if (response.status === "success") {
        this.url = response.url;
        await this.delayMessage("上传成功", 200, true);
      } else {
        await this.handleError(response);
      }
    },
    async handleError(response) {
      console.error("上传失败", response.message);
      this.url = '';
      await this.delayMessage(`上传失败：${response.message}`, 100, false);
    },
    async selectLinkType(type) {
      this.currentOutputType = type.key;
      await this.copy();
    },
    async copy() {
      if (!this.url) return;
      try {
        await navigator.clipboard.writeText(this.result);
        this.$message.success("链接已复制到剪贴板");
      } catch (err) {
        console.error('复制失败', err);
        this.$message.error("复制到剪贴板失败");
      }
    },
    async delayMessage(message, delay, isSuccess) {
      await new Promise(resolve => setTimeout(resolve, delay));
      isSuccess ? this.$message.success(message) : this.$message.error(message);
    }
  },
});