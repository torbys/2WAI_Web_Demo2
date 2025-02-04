
const media = document.getElementById('media');
const moblieZoom = document.querySelector('.moblieZoom');

let touchTimeout = null;
let resetTimeout = null; // 用于重置 left 属性的定时器

// 定义触摸开始事件的处理函数
const handleTouchStart = (event) => {
  // 清除之前的定时器
  
  if (touchTimeout) {
    clearTimeout(touchTimeout);
  }
  if (resetTimeout) {
    clearTimeout(resetTimeout);
  }

  // 设置一个新的定时器，2秒后执行
  touchTimeout = setTimeout(() => {
    // 更新 .moblieZoom 的 left 属性
    moblieZoom.style.left = '88%';
  }, 2000);

};

// 定义触摸结束事件的处理函数
const handleTouchEnd = (event) => {
  // 清除定时器，防止在2秒内松手时执行
  if (touchTimeout) {
    clearTimeout(touchTimeout);
  }

  // 无论用户在 .moblieZoom 内部还是外部松手，2秒后重置 left 属性
  resetTimeout = setTimeout(() => {
    moblieZoom.style.left = '120%';
  }, 2000);
  
};

// 定义媒体查询
const mediaQuery = window.matchMedia('(max-width: 1000px)');

// 根据屏幕宽度添加或移除事件监听器
const toggleEventListeners = (matches) => {
  if (matches) {
    
    // 屏幕宽度小于1000px，添加事件监听器
    media.addEventListener('touchstart', handleTouchStart);
    media.addEventListener('touchend', handleTouchEnd);
  } else {
    // 屏幕宽度大于1000px，移除事件监听器
    media.removeEventListener('touchstart', handleTouchStart);
    media.removeEventListener('touchend', handleTouchEnd);
    // 重置 .moblieZoom 的 left 属性
    
    moblieZoom.style.left = '88%';
    if (resetTimeout) {
      clearTimeout(resetTimeout);
    }

  }
};

// 初始检查
toggleEventListeners(mediaQuery.matches);

// 监听屏幕尺寸变化
mediaQuery.addListener(toggleEventListeners);




const hintButton = document.getElementById('hint-button');
const hintDiv = document.querySelector('.Hint');

// 检查是否已经显示过提示
if (!localStorage.getItem('hintShown')) {
  hintDiv.style.display = 'flex'; // 显示提示
  localStorage.setItem('hintShown', 'true'); // 标记提示已显示
}

// 监听按钮的点击事件
hintButton.addEventListener('click', function () {
  hintDiv.style.display = 'none'; // 隐藏提示
});
