const AudioVisualizer = {
  audioContext: null,
  analyser: null,
  dataArray: null,
  animationId: null,
  canvas: null,
  canvasCtx: null,

  init(elementId, canvasId = "myCanvas") {
    // 创建音频上下文
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    
    // 配置分析器节点
    this.analyser.fftSize = 64;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    
    // 创建并替换canvas元素
    const originalImg = document.getElementById(elementId);
    this.canvas = document.createElement('canvas');
    this.canvas.id = canvasId; // 使用传入的 ID
    this.canvas.width = 70; // 宽度
    this.canvas.height = 30; // 高度
    originalImg.parentNode.replaceChild(this.canvas, originalImg);
    
    this.canvasCtx = this.canvas.getContext('2d');
    
    // 立即绘制静态基准线
    this.drawBaseLine();
  },

  drawBaseLine() {
    // 清空画布
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制基准线
    const centerY = this.canvas.height / 2;
    const barWidth = 4;  // 增加线条宽度
    const barGap = 4;    // 增加间距
    const barCount = 20; // 固定数量为20条
    
    // 计算总宽度并调整起始位置使其居中
    const totalWidth = barCount * (barWidth + barGap);
    const startX = (this.canvas.width - totalWidth) / 2;
    
    this.canvasCtx.fillStyle = '#525252';
    
    for (let i = 0; i < barCount; i++) {
      const x = startX + i * (barWidth + barGap);
      
      this.canvasCtx.beginPath();
      this.canvasCtx.roundRect(x, centerY - 1, barWidth, 2, 1);
      this.canvasCtx.fill();
    }
  },

  startVisualization(stream) {
    if (!this.audioContext) this.init('activeLine');
    
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    
    const draw = () => {
      this.animationId = requestAnimationFrame(draw);
      
      this.analyser.getByteFrequencyData(this.dataArray);
      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      const centerY = this.canvas.height / 2;
      const barWidth = 4;
      const barGap = 4;
      const barCount = 20;
      
      const totalWidth = barCount * (barWidth + barGap);
      const startX = (this.canvas.width - totalWidth) / 2;
      
      this.canvasCtx.fillStyle = '#525252';
      
      // 获取并处理频率数据
      let frequencyData = Array.from({ length: barCount }, (_, i) => {
        // 获取多个频率点的平均值，使数据更稳定
        const start = i * 2;
        const end = start + 2;
        let sum = 0;
        for (let j = start; j < end; j++) {
          sum += this.dataArray[j] || 0;
        }
        return sum / 2;
      });
      
      // 应用平滑处理
      for (let i = 1; i < frequencyData.length - 1; i++) {
        frequencyData[i] = (frequencyData[i - 1] + frequencyData[i] * 2 + frequencyData[i + 1]) / 4;
      }
      
      for (let i = 0; i < barCount; i++) {
        const value = frequencyData[i];
        
        // 调整振幅计算
        const distanceFromCenter = Math.abs(i - barCount/2) / (barCount/2);
        const amplitudeScale = Math.exp(-Math.pow(distanceFromCenter * 1.2, 2)); // 减小衰减速度
        
        // 增加基础振幅并应用非线性缩放
        let barHeight = (value / 255) * this.canvas.height * 2.5; // 增加基础振幅
        barHeight = Math.pow(barHeight, 1.2) * amplitudeScale; // 非线性缩放使小信号更明显
        barHeight = Math.max(2, Math.min(barHeight, this.canvas.height * 0.9)); // 限制最大高度
        
        const x = startX + i * (barWidth + barGap);
        
        this.canvasCtx.beginPath();
        this.canvasCtx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, 1.5);
        this.canvasCtx.fill();
      }
    };
    
    draw();
  },

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    // 停止后显示基准线
    this.drawBaseLine();
  }
};

window.AudioVisualizer = AudioVisualizer; 