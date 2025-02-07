// 定义全局变量

isRecording=false;
let Record_flag = true; //判断是停止还是录音
const longPressThreshold = 500; // 长按阈值，单位为毫秒
// 长按定时器
let longPressTimer = null;
let isVisualizerInitialized = false; // 初始化标志
const visualizer = window.AudioVisualizer;


// 绑定录音事件
function bindRecordEvents() {
    console.log("绑定录音事件");

	const media = document.getElementById('media');

    $('#speak-button').on('touchstart', function (event) {
	    console.log("触摸开始....");
	    event.preventDefault(); // 防止默认行为

		// 添加按下效果
		$(this).addClass('pressed');

	    // 如果已经在录制中，直接返回
	    if (isRecording) return;

		// 移除之前的触摸事件监听器
		media.removeEventListener('touchstart', handleTouchStart);
    	media.removeEventListener('touchend', handleTouchEnd);

	    // 设置长按定时器
	    longPressTimer = setTimeout(() => {
	        // 如果已经获取了麦克风流，则直接使用这个流，否则再次请求权限
	        if (audioStream) {
	            mediaRecorder = new MediaRecorder(audioStream);
	            mediaRecorder.ondataavailable = (event) => {
	                audioChunks.push(event.data);
	            };
	            mediaRecorder.start(); // 开始录制
	            audioChunks = []; // 初始化音频数据数组
	            isRecording = true; // 设置录制状态为 true
				if (!isVisualizerInitialized) {
                	visualizer.init('activeLineZoom', "myCanvas"); // 初始化可视化
                	isVisualizerInitialized = true; // 标记为已初始化
          		}
				  $('#myCanvas').removeClass('hidden1');
				visualizer.startVisualization(audioStream); // 启动可视化
	        } 
	    }, longPressThreshold);
	});

	$('#speak-button').on('touchend', function (event) {
	    console.log("触摸结束....");
	    event.preventDefault(); // 防止默认行为

		// 移除按下效果
		$(this).removeClass('pressed');

	    // 清除长按定时器
	    if (longPressTimer) {
	        clearTimeout(longPressTimer);
	        longPressTimer = null;
	    }

		// 重新添加触摸事件监听器
		media.addEventListener('touchstart', handleTouchStart);
    	media.addEventListener('touchend', handleTouchEnd);

	    // 如果正在录制中，停止录制
	    if (isRecording) {
	        mediaRecorder.stop(); // 停止录音

	        // 保存录音文件
	        mediaRecorder.onstop = () => {
	            console.log("收集开始....");

	            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // 将音频数据转换为 Blob 对象
	            const fileName = generateRandomFileName('.wav'); // 生成随机文件名
	            const formData = new FormData(); // 创建 FormData 对象

	            // 设置音频播放器的源为刚刚的音频文件
	            const audioUrl = URL.createObjectURL(audioBlob);
	            $('#zoomVoice').attr('src', audioUrl);

	            formData.append('audioFile', audioBlob, fileName); // 将音频 Blob 添加到 FormData 中

	            // 获取 voice-image-zoom 元素
	            const voiceImageZoom = document.getElementById('voice-image-zoom');
	            const voiceImageZoomParent = voiceImageZoom.parentNode;

	            // 在发送请求前替换为加载动画
	            const loaderDiv = document.createElement('div');
	            loaderDiv.className = 'loader2';
	            loaderDiv.style.width = '50%'; // 设置加载动画的宽度
	            loaderDiv.style.height = '50%'; // 设置加载动画的高度
	            voiceImageZoomParent.replaceChild(loaderDiv, voiceImageZoom); // 用加载动画替换图片

				$('#myCanvas').addClass('hidden1');
				visualizer.stop();

	            fetch('https://www.2wai-demo.com/api-s/uploadAudio', {
	                method: 'POST',
	                body: formData
	            })
	            .then(response => response.json())
	            .then(data => {
	                console.log('返回的数据是:', data); // 打印保存结果
	                // 请求成功后恢复原来的图片
	                const newVoiceImageZoom = document.createElement('img');
	                newVoiceImageZoom.id = 'voice-image-zoom';
	                newVoiceImageZoom.className = 'voice_img';
	                newVoiceImageZoom.src = './icon/pan.png';
	                newVoiceImageZoom.alt = 'voice';
	                newVoiceImageZoom.style.width = '50%';
	                newVoiceImageZoom.style.height = '50%';
	                voiceImageZoomParent.replaceChild(newVoiceImageZoom, loaderDiv); // 用原来的图片替换加载动画

	                simulateZoomSubmit(data.res);
	                isRecording = false; // 重置录制状态
	            })
	            .catch(error => {
	                console.error('Error saving audio:', error); // 打印保存错误信息
	                alert('Failed to upload audio file'); // 弹出提示框，提示用户保存音频文件失败

					//错误时也换回来
					const newVoiceImageZoom = document.createElement('img');
	                newVoiceImageZoom.id = 'voice-image-zoom';
	                newVoiceImageZoom.className = 'voice_img';
	                newVoiceImageZoom.src = './icon/pan.png';
	                newVoiceImageZoom.alt = 'voice';
	                newVoiceImageZoom.style.width = '50%';
	                newVoiceImageZoom.style.height = '50%';
	                voiceImageZoomParent.replaceChild(newVoiceImageZoom, loaderDiv); // 用原来的图片替换加载动画


	                isRecording = false; // 确保在错误情况下也重置状态
	            });
	        };
	    }
	});
}


function removeRecordEvents() {
	console.log("remove");
    $('#speak-button')
        .off('mousedown')
        .off('mouseup')
        .off('touchstart')
        .off('touchend');
}

// 获取麦克风流
async function getMediaStream() {
    if (audioStream) {
        // 如果已经获取了麦克风流，直接返回
        return audioStream;
    } else {
        try {
            // 请求麦克风权限并获取媒体流
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStream = stream; // 存储麦克风流
            return audioStream;
        } catch (error) {
            console.error('Error accessing microphone:', error);
			alert('Unable to access microphone. Please ensure microphone permissions are granted. Additionally, the recording feature has been disabled.');
            throw error;
        }
    }
}

function checkMicrophoneConnection() {

    if (progress >= 100) {
		console.log("add speak");
		getMediaStream().then(() => {
            bindRecordEvents();
        }).catch(() => {
           
        });
		clearInterval(checkBgColorInterval)
    }else{
		removeRecordEvents()
	}

}

// 初始检查背景颜色
checkMicrophoneConnection();

checkBgColorInterval = setInterval(checkMicrophoneConnection, 1000); // 每秒检查一次