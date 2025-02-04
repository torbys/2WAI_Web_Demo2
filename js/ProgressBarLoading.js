    const speakButton = document.getElementById('speak-button');
	let progress = 0; // 初始化进度为0
	let pressTimer = null; // 定义定时器变量

	// 自动开始增加进度的函数
	function autoProgress() {
	    pressTimer = setInterval(() => {
	        if (progress < 100) {
	            progress += 10;
	            speakButton.style.background = `linear-gradient(to right, white ${progress}%, #ddd 0%)`;
	        } else {
	            clearInterval(pressTimer);
	        }
	    }, 100); // 每100毫秒增加5%
	}

	// 重置进度的函数
	function resetProgress() {
	    clearInterval(pressTimer);
	    progress = 0;
	    speakButton.style.background = '#ddd';
	}

	// 使用 MutationObserver 实时检测 speakButton 的类变化
	const observer = new MutationObserver((mutations) => {
	    mutations.forEach((mutation) => {
	        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
	            if (speakButton.classList.contains('hidden1')) {
	                // 如果有了 hidden 类，重置进度
	                resetProgress();
					progress = 0;
               		if (checkBgColorInterval) {
                  		  clearInterval(checkBgColorInterval);
               		}
                	checkBgColorInterval = setInterval(checkMicrophoneConnection, 1000); 
	            } else {
	                // 如果没有 hidden 类，自动开始增加进度
	                autoProgress();
	            }
	        }
	    });
	});

	// 配置观察器的选项
	const config = {
	    attributes: true, // 观察属性变化
	    attributeFilter: ['class'] // 只观察 class 属性的变化
	};

	// 开始观察 speakButton 的类变化
	observer.observe(speakButton, config);
