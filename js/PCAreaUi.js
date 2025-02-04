
	function cancelSelection(id) {
	    var $selectedItem = $('#' + id);
		$('.img_container').removeClass('selected');
		$('.img_container img').removeClass('selected-filter'); // 移除所
	}

	function setHeightToVideo() {
	    var video = document.getElementById('video');
	    if (video) { // 确保视频元素存在
	        var videoHeight = video.clientHeight;
	        var videoWidth = video.clientWidth; // 获取视频宽度
	        console.log("小屏视频高度：" + videoHeight + ", 宽度：" + videoWidth);
		
	        if (window.innerWidth <= 1100) {
	            // 设置html和body的高度和宽度为视频的尺寸
	            document.documentElement.style.height = videoHeight + 'px';
	            document.documentElement.style.width = videoWidth + 'px';
	            document.body.style.height = videoHeight + 'px';
	            document.body.style.width = videoWidth + 'px';
	            document.body.style.overflow = 'hidden'; // 隐藏滚动条
	        }else{
				document.documentElement.style.height = '';
	            document.documentElement.style.width = '';
	            document.body.style.height = '';
	            document.body.style.width ='';
	            document.body.style.overflow = ''; // 隐藏滚动条
			}
	    }
	}
	
	window.addEventListener('resize', setHeightToVideo);
	window.addEventListener('load', setHeightToVideo);


	// 获取视频元素
	const video = document.getElementById('video');
	const chatContainer = document.querySelector('.chat-container');
	const form = document.getElementById('echo-form');
	var chatContainerHeight;

	// 定义一个函数来设置 chat-container 的高度
	function setChatContainerHeightToVideo() {
	    // 获取视频的实际显示高度
	    const videoHeight = video.offsetHeight;

	    // 获取 form 的高度
	    const formHeight = form.offsetHeight;

	    // 计算 chat-container 的高度（视频高度减去 form 高度）
	    chatContainerHeight = videoHeight - formHeight;

	    console.log("视频高度: " + videoHeight);
	    console.log("表单高度: " + formHeight);
	    console.log("聊天容器高度: " + chatContainerHeight);

	    // 设置 chat-container 的高度
	    chatContainer.style.maxHeight = `${chatContainerHeight}px`;
	}

	// 监听页面加载完成事件
	window.addEventListener('DOMContentLoaded', () => {
	    // 确保视频已加载元数据
	    if (video.readyState > 0) {
	        setChatContainerHeightToVideo();
	    } else {
	        video.addEventListener('loadedmetadata', setChatContainerHeightToVideo);
	    }
	});

	/*max滑块的更改*/
	const chunkSize = document.getElementById('chunk-size');
    const chunkSizeInput = document.getElementById('chunk-size-input');
    const numberBoxContainer = document.querySelector('.number-box-container');
    const sliderContainer = document.querySelector('.slider-container');

    // 处理滑块移动事件
    chunkSize.addEventListener('input', function(e) {
    	  const value = e.target.value;
    	  numberBoxContainer.style.display = 'block';
		
    	  // 获取滑块的实际位置
    	  const rect = e.target.getBoundingClientRect();
    	  const thumbWidth = 18; // 滑块的宽度
    	  const containerRect = sliderContainer.getBoundingClientRect();
		
    	  // 计算滑块中心点的位置
    	  const percentage = (value - e.target.min) / (e.target.max - e.target.min);
    	  const thumbLeft = percentage * (rect.width - thumbWidth) + thumbWidth / 2;
		
    	  // 设置数值框的位置，使其对齐滑块中心
    	  numberBoxContainer.style.left = `${thumbLeft}px`;
    	  numberBoxContainer.textContent = value;

    	  if (numberBoxContainer.timeoutId) {
    	    clearTimeout(numberBoxContainer.timeoutId);
    	  }

    	  numberBoxContainer.timeoutId = setTimeout(() => {
    	    numberBoxContainer.style.display = 'none';
    	  }, 500);
    });
    // 同步滑块和输入框的值
    chunkSize.addEventListener('input', function(e) {
    	  chunkSizeInput.value = e.target.value;
    });

    chunkSizeInput.addEventListener('input', function(e) {
    	let value = parseInt(e.target.value);
    	if (value < 0) value = 0;
    	if (value > 30) value = 30;
    	if (!isNaN(value)) {
    	  chunkSize.value = value;
    	}
    });

	/*PC端的滑轮缩放*/
	document.addEventListener('DOMContentLoaded', function () {
		const media = document.getElementById('video');
  		const zoomClick = document.querySelector('.ZoomClick');
  		const moveWrapper = document.querySelector('.moveWrapper');
  		const zoomIcon = document.getElementById('zoomIcon');

  		let resetTimeout = null;

  		// 绑定点击事件，点击 moveWrapper 时将 ZoomClick 的 left 设置为 90%
  		moveWrapper.addEventListener('click', function () {
  		//   zoomClick.style.left = '92%';
  		  zoomClick.style.left = '90%';
  		  clearTimeout(resetTimeout);
		
  		  // 禁用 zoomIcon 的滚轮事件
  		  zoomIcon.removeEventListener('wheel', handleWheel);
		
  		  // 重置定时器
  		  resetTimeout = setTimeout(() => {
  		    zoomClick.style.left = '120%';
  		    // 重新启用 zoomIcon 的滚轮事件
  		    zoomIcon.addEventListener('wheel', handleWheel);
  		  }, 3000);
  		});
	
  		// 绑定操作事件，当用户在 ZoomClick 内部进行操作时重置定时器
  		zoomClick.addEventListener('click', function () {
  		  clearTimeout(resetTimeout);
  		  resetTimeout = setTimeout(() => {
  		    zoomClick.style.left = '120%';
  		    // 重新启用 zoomIcon 的滚轮事件
  		    zoomIcon.addEventListener('wheel', handleWheel);
  		  }, 3000);
  		});
	
  		// 滚轮事件处理函数
  		const handleWheel = (event) => {
  		  	event.preventDefault(); // 阻止默认的滚动行为
			
  		  	const scaleFactor = 1.1; // 缩放因子
  		  	let currentScale = media.style.transform ? parseFloat(media.style.transform.match(/scale\(([^)]+)\)/)[1]) : 1;
			
  		  	// 根据滚轮方向更新缩放比例
  		  	if (event.deltaY < 0) {
  		  	  currentScale *= scaleFactor;
  		  	} else {
  		  	  currentScale /= scaleFactor;
  		  	  // 防止缩放过小导致视频不可见
  		  	  if (currentScale < 0.1) currentScale = 0.1;
  		  	}
		  
  		  	// 应用缩放变换，设置缩放原点为顶部 10% 的位置
  		  	media.style.transformOrigin = 'center 10%'; 
  		  	media.style.transform = `scale(${currentScale})`;
  		};
	
  		// 初始绑定滚轮事件
  		zoomIcon.addEventListener('wheel', handleWheel);
	});

	/*移动端zoom的点击事件*/
	document.addEventListener('DOMContentLoaded', function () {
		const media = document.getElementById('video');
        const zoomOutButton = document.getElementById('Zoom-out2');
        const zoomInButton = document.getElementById('Zoom-in2');
		const zoomGroup = document.querySelector('.ZoomGroup2');

        const scaleLevels = [0.5, 0.75, 1.0, 1.5, 2.0]; // 缩放挡位
        let currentScaleIndex = 2; // 初始索引为2，对应100%
		let tem=(currentScaleIndex / (scaleLevels.length - 1)) * 100;
      
        // 初始化缩放比例
        media.style.transformOrigin = 'center 10%'; 
        media.style.transform = `scale(${scaleLevels[currentScaleIndex]})`;
    
         // 更新 .ZoomGroup 的背景颜色
		 const updateZoomGroupBackground = () => {
  		  const percentage = (currentScaleIndex / (scaleLevels.length - 1)) * 100;
				
  		  // 逐步更新背景颜色
  		  const step = 1; // 每次变化的百分比
  		  const interval = 10; // 每次变化的间隔时间（毫秒）
				
  		  const intervalId = setInterval(() => {
  		    if (tem < percentage) {
  		      tem += step;
  		      if (tem > percentage) tem = percentage;
  		    } else if (tem > percentage) {
  		      tem -= step;
  		      if (tem < percentage) tem = percentage;
  		    }
		
  		    const gradient = `linear-gradient(to bottom, #e1e1e1 ${100 - tem}%, white ${100-tem}%)`;
  		    zoomGroup.style.background = gradient;
		
  		    if (tem === percentage) {
  		      clearInterval(intervalId);
  		    }
  		  }, interval);
  		};

	
  		// 监听 Zoom-out 按钮的点击事件
  		zoomOutButton.addEventListener('click', function (event) {
  		  if (currentScaleIndex < scaleLevels.length - 1) {
  		    currentScaleIndex++;
  		    media.style.transform = `scale(${scaleLevels[currentScaleIndex]})`;
  		    updateZoomGroupBackground();
  		  }
  		});
	
  		// 监听 Zoom-in 按钮的点击事件
  		zoomInButton.addEventListener('click', function (event) {
  		  if (currentScaleIndex > 0) {
  		    currentScaleIndex--;
  		    media.style.transform = `scale(${scaleLevels[currentScaleIndex]})`;
  		    updateZoomGroupBackground();
  		  }
  		});
	
  		// 初始背景更新
  		updateZoomGroupBackground();
	});

	/*PC端zoom的点击事件*/
	document.addEventListener('DOMContentLoaded', function () {
		const media = document.getElementById('video');
        const zoomOutButton = document.getElementById('Zoom-out');
        const zoomInButton = document.getElementById('Zoom-in');
		const zoomGroup = document.querySelector('.ZoomGroup');

        const scaleLevels = [0.5, 0.75, 1.0, 1.5, 2.0]; // 缩放挡位
        let currentScaleIndex = 2; // 初始索引为2，对应100%
		let tem=(currentScaleIndex / (scaleLevels.length - 1)) * 100;
      
        // 初始化缩放比例
        media.style.transformOrigin = 'center 10%'; 
        media.style.transform = `scale(${scaleLevels[currentScaleIndex]})`;
    
         // 更新 .ZoomGroup 的背景颜色
		 const updateZoomGroupBackground = () => {
  		  const percentage = (currentScaleIndex / (scaleLevels.length - 1)) * 100;
				
  		  // 逐步更新背景颜色
  		  const step = 1; // 每次变化的百分比
  		  const interval = 10; // 每次变化的间隔时间（毫秒）
				
  		  const intervalId = setInterval(() => {
  		    if (tem < percentage) {
  		      tem += step;
  		      if (tem > percentage) tem = percentage;
  		    } else if (tem > percentage) {
  		      tem -= step;
  		      if (tem < percentage) tem = percentage;
  		    }
		
  		    const gradient = `linear-gradient(to bottom, #e1e1e1 ${100 - tem}%, white ${100-tem}%)`;
  		    zoomGroup.style.background = gradient;
		
  		    if (tem === percentage) {
  		      clearInterval(intervalId);
  		    }
  		  }, interval);
  		};

	
  		// 监听 Zoom-out 按钮的点击事件
  		zoomOutButton.addEventListener('click', function (event) {
  		  if (currentScaleIndex < scaleLevels.length - 1) {
  		    currentScaleIndex++;
  		    media.style.transform = `scale(${scaleLevels[currentScaleIndex]})`;
  		    updateZoomGroupBackground();
  		  }
  		});
	
  		// 监听 Zoom-in 按钮的点击事件
  		zoomInButton.addEventListener('click', function (event) {
  		  if (currentScaleIndex > 0) {
  		    currentScaleIndex--;
  		    media.style.transform = `scale(${scaleLevels[currentScaleIndex]})`;
  		    updateZoomGroupBackground();
  		  }
  		});
	
  		// 初始背景更新
  		updateZoomGroupBackground();
	});
