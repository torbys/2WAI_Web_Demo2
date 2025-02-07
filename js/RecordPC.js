	// 封装计时器功能的函数
	function createTimer(recordTimeElement) {
		let timer = null;
		let timeValue = 0;

		// 更新时间的函数
		function updateTime() {
			timeValue += 0.01;
			recordTimeElement.textContent = timeValue.toFixed(2); // 保留两位小数
		}

		// 计时器开始的函数
		function startTimer() {
			if (!timer) {
				timer = setInterval(updateTime, 1000); // 每 100 毫秒更新时间
			}
		}

		// 计时器停止并重置的函数
		function stopTimer() {
			if (timer) {
				clearInterval(timer);
				timer = null;
				timeValue = 0;
				recordTimeElement.textContent = '0.00';
			}
		}

		// 返回计时器的控制函数
		return {
			start: startTimer,
			stop: stopTimer
		};
	}

	/*-----------------------------录音图片切换----------------------*/
	var voiceFlag = true;

	function changeImage() {
		// 获取图片元素
		var image = document.getElementById('voice-image');
		console.log("change");

		voiceFlag = !voiceFlag;
		var newSrc = voiceFlag ? './icon/voice.png' : './icon/left.png'; // 根据 voiceFlag 的值选择图片

		// 添加过渡效果
		image.classList.add('changing');

		// 移除过渡效果类，这将在 CSS 中触发过渡
		setTimeout(function () {
			// 设置图片新源
			image.src = newSrc;
			image.classList.remove('changing');
		}, 300); // 300毫秒后移除，与 CSS 中的过渡时间相匹配

		var message = document.getElementById('message');
		var recordGroup1 = document.getElementById('recordGroup1');
		var recordGroup2 = document.getElementById('recordGroup2');
		var voiceImage = document.getElementById('voice-image');

		// 切换显示状态
		if (message.classList.contains('hidden')) {
			message.classList.remove('hidden');
			recordGroup1.classList.add('hidden');
			recordGroup2.classList.add('hidden');
		} else {
			message.classList.add('hidden');
			recordGroup1.classList.remove('hidden');
		}

	}

	// 获取计时器显示的元素
	const recordTime = document.getElementById('recordTime');
	const recordTime2 = document.getElementById('recordTime2');
	var messageTextarea = $('#message');
	var submitBtn = $('button[type="submit"]');
	var submitImg = './icon/submit.png'; // 绿色按钮的图片路径
	var baseSubmitImg = './icon/base_submit.png'; // 灰色按钮的图片路径

	// 创建两个计时器实例
	const timer1 = createTimer(recordTime);
	const timer2 = createTimer(recordTime2);

	function generateRandomFileName(extension) {
		// 获取当前时间戳
		const timestamp = Date.now();
		// 生成一个随机数
		const randomPart = Math.random().toString(36).substring(2, 15);
		// 返回文件名，格式为时间戳_随机数.扩展名
		return `${timestamp}_${randomPart}${extension}`;
	}

	function addMessage(message, isUser) {
		const messageDiv = $('<div>')
			.addClass('message')
			.addClass(isUser ? 'user-message' : 'bot-message')
			.css({
        		opacity: 0, // 初始透明度为0
        		transform: 'translateY(20px)', // 初始位置在下方20px
        		transition: 'opacity 0.5s, transform 0.5s' // 定义过渡动画
    		});
		// 确定头像路径
		let avatarPath = './icon/icon.png'; // 默认头像路径
		if (!isUser) {
			avatarPath = `./icon/${avatarName}.png`; // 设置为对应的头像路径
		}
		const avatar = $('<img>')
			.addClass('message-avatar')
			.attr('src', avatarPath)
			.attr('alt', isUser ? 'User' : 'Bot');
		const content = $('<div>')
			.addClass('message-content')
			.text(message);
		messageDiv.append(avatar).append(content);
		$('#chat-messages').append(messageDiv);
		$('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
		 // 使用CSS动画实现渐隐滑入效果
		 messageDiv.css({
    	    opacity: 1, // 透明度变为1
    	    transform: 'translateY(0)' // 位置回到初始位置
    	});
		if(!isUser){
			// 按字符分割消息内容
			const characters = message.split(""); // 将字符串分割成单个字符数组
			let currentCharIndex = 0;
			// 逐个字符动态显示消息内容
			const displayNextChar = () => {
			    if (currentCharIndex < characters.length) {
			        // 如果是第一个字符，直接设置内容；否则在现有内容后追加字符
			        if (currentCharIndex === 0) {
			            content.text(characters[currentCharIndex]);
			        } else {
			            content.text(content.text() + characters[currentCharIndex]);
			        }
				
			        currentCharIndex++;
			        // 使用 setTimeout 递归调用，实现逐个字符显示的效果
			        setTimeout(displayNextChar, 40); 
			    }
			};
			// 开始逐个字符显示消息内容
			displayNextChar();
		}
	}

	function simulateSubmit(message) {
	    if (canSubmit === 1) {
	        // 获取 audio-preview 元素
	        var audioPreview = $('.audio-preview');

			$('#submitPlayer')[0].play();

	        // 检查 audio-preview 是否没有 hidden 类
	        if (!audioPreview.hasClass('hidden')) {
	            // 如果没有 hidden 类，则添加 hidden 类
	            audioPreview.addClass('hidden');
	            messageTextarea.removeClass('hidden');
	            // 获取 voice-image 元素
	            var image = document.getElementById('voice-image');

	            // 设置 voiceFlag 为 true，以便将图标更换为 voice.png
	            voiceFlag = true;

	            // 设置图片新源为 voice.png
	            var newSrc = './icon/voice.png';

	            // 添加过渡效果
	            image.classList.add('changing');

	            // 移除过渡效果类，这将在 CSS 中触发过渡
	            setTimeout(function () {
	                // 设置图片新源
	                image.src = newSrc;
	                image.classList.remove('changing');
	            }, 300); // 300毫秒后移除，与 CSS 中的过渡时间相匹配
	        }

	        // 添加用户消息到聊天框
			console.log("添加");
	        addMessage(message, true);

	        console.log('Sending: ' + message);
	        console.log('sessionid: ', sessionid);

	        /*网络获取机械人回复*/
	        fetch(host + '/human', {
	            body: JSON.stringify({
	                text: message,
	                type: 'chat',
	                interrupt: true,
	                sessionid: sessionid,
	                avatarName: avatarName,
	                ttsSelection: ttsSelection,
	                avatarVoice: avatarVoice,
	                chunkSize: "10"
	            }),
	            headers: {
	                'Content-Type': 'application/json'
	            },
	            method: 'POST'
	        })
	        .then(response => response.json())
	        .then(data => {
	            // 添加机器人的回复消息
	            const llmResponse = data.res || "No valid response was returned！";
	            addMessage(llmResponse, false);
	        })
	        .catch(error => {
	            console.error('Error:', error);
	            // 可选：显示错误消息
	            addMessage("Sorry, an error occurred. Please try again later.", false);
	        });

	        // 清空入框并将焦点重新放在输入框上
	        $('#message').val('');
	        canSubmit = 0;
	        submitBtn.find('img').attr('src', baseSubmitImg);
	    }
	}

	const visualizerPC = window.AudioVisualizer;
	
	$('#record_wrapper').click(function () {
    	if (isRecording) return; // 如果已经在录制中，直接返回
		
	    // 检查是否已经获取了媒体流
	    if (!audioStream) {
	        // 请求麦克风权限并获取媒体流
	        navigator.mediaDevices.getUserMedia({ audio: true })
	            .then(stream => {
	                audioStream = stream; // 存储媒体流
	                startRecording(); // 开始录音
	            })
	            .catch(error => {
	                console.error('Error accessing microphone:', error);
	                alert('Unable to access microphone. Please ensure microphone permissions are granted.');
	                isRecording = false; // 重置录制状态
	            });
	    } else {
			
	        startRecording(); // 直接开始录音
	    }

	});

	let isinitPC = false;
	
	function startRecording() {

		if(!isinitPC){
			visualizerPC.init('activeLinePC',"PCcanves");
			isinitPC=true;
		}
		
		visualizerPC.startVisualization(audioStream)

	    if (audioStream) {
	        mediaRecorder = new MediaRecorder(audioStream);
	        mediaRecorder.ondataavailable = (event) => {
	            audioChunks.push(event.data); // 将音频数据添加到数组中
	            console.log('Audio chunk received:', event.data);
	            console.log('Audio chunks length:', audioChunks.length);
	        };
		
	        mediaRecorder.start(); // 开始录音
	        audioChunks = []; // 初始化音频数据数组
	        isRecording = true; // 设置录制状态为true
		
	        // 更新按钮状态和文本
	        $('#record_wrapper').prop('disabled', true); // 禁用开始录制按钮
	        $('#stop_wrapper').prop('disabled', false); // 启用停止录制按钮
		
	        // 隐藏和显示相关元素
	        var recordGroup1 = document.getElementById('recordGroup1');
	        var recordGroup2 = document.getElementById('recordGroup2');
	        recordGroup1.classList.add('hidden');
	        recordGroup2.classList.remove('hidden');
	        timer1.start();
	    } else {
	        console.warn('未允许麦克风权限');
	    }
	}
	
	$('#stop_wrapper').click(function () {
		console.log("yes im into")
		if (!isRecording) return; // 如果不在录制中，直接返回
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop(); // 停止录音
			// 更新按钮状态
			$(this).prop('disabled', true); // 禁用停止录制按钮
			$('#record_wrapper').prop('disabled', false) // 启用开始录制按钮

			visualizerPC.stop();

			// 保存录音文件
			mediaRecorder.onstop = () => {
				console.log("录音结束....");
				var recordGroup2 = document.getElementById('recordGroup2');
				recordGroup2.classList.add('hidden');
				timer1.stop();
				$('.audio-preview').removeClass('hidden');

				const audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // 将音频数据转换为 Blob 对象
				const fileName = generateRandomFileName('.wav'); // 生成随机文件
				const formData = new FormData(); // 创建 FormData 对象

				// 设置音频播放器的源为刚刚的音频文件' 
				const audioUrl = URL.createObjectURL(audioBlob);

				// 设置音频播放器的源为刚刚的音频文件
				$('#audio-player').attr('src', audioUrl);
				// 设置文件名显示为上传的文件名
				$('#file-name').text(fileName);

				formData.append('audioFile', audioBlob, fileName); // 将音频 Blob 添加到 

				// 获取提交按钮元素
				const loading = document.querySelector('.btn.btn-default');

				// 在发送请求前替换为加载动画
				const loaderDiv = document.createElement('div');
				loaderDiv.className = 'loader2';
				loading.innerHTML = ''; // 清空按钮内的内容
				loading.appendChild(loaderDiv); // 添加加载动画

				fetch('https://www.2wai-demo.com/api-s/uploadAudio', {
					method: 'POST',
					body: formData
				})
				.then(response => response.json())
				.then(data => {
					console.log('返回的数据是:', data); // 打印保存结果
					// 请求完成后换回原来的图片
					loading.innerHTML = '<img class="submit" src="./icon/base_submit.png" alt="submit" />'; // 恢复原来的图片
					// // 将返回的 res 文字设置到 #message 文本框中
					messageTextarea.val(data.res);
					canSubmit = 1; // 设置可发送标志为1
					// 自动调用 simulateSubmit 函数发送消息
					simulateSubmit(data.res);
					$('#message').val('');
					isRecording = false; // 重置录制状态
				})
				.catch(error => {
					loading.innerHTML = '<img class="submit" src="./icon/base_submit.png" alt="submit" />'; // 恢复原来的图片
					var audioPreview = document.querySelector('.audio-preview');
					var message = document.getElementById('message');
					audioPreview.classList.add('hidden');
					message.classList.remove('hidden');
					// 获取 voice-image 元素
					var image = document.getElementById('voice-image');
					// 设置 voiceFlag 为 true，以便将图标更换为 voice.png
					voiceFlag = true;
					// 设置图片新源为 voice.png
					var newSrc = './icon/voice.png';
					// 添加过渡效果
					image.classList.add('changing');
					// 移除过渡效果类，这将在 CSS 中触发过渡
					setTimeout(function () {
						// 设置图片新源
						image.src = newSrc;
						image.classList.remove('changing');
					}, 300); // 300毫秒后移除，与 CSS 中的过渡时间相匹配

					$('#message').val('');

					console.error('Error saving audio:', error); // 打印保存错误信息
					alert('Failed to upload audio file'); // 弹出提示框，提示用户保存音频文件失败

					isRecording = false; // 确保在错误情况下也重置状态	
				});

			};
		}
	});


	var audioPlayer = document.getElementById('audio-player');

	document.getElementById('custom-player').addEventListener('click', function () {

		if (audioPlayer.paused) {
			audioPlayer.play();
			timer2.start();
		}
	});

	// 添加 ended 事件监听器
	audioPlayer.addEventListener('ended', function () {
		timer2.stop(); // 音频播放结束时停止计时器
		audioPlayer.pause(); // 确保音频暂停
	});

	// 处理音频文件上传	用户自己上传的文件
	// $('#audio-file-input').change(function(e) {
	//     const file = e.target.files[0];
	//     if (file) {
	//         const extension = file.name.substring(file.name.lastIndexOf('.'));
	//         const newFileName = generateRandomFileName(extension);

	//         const formData = new FormData();
	//         formData.append('audio', file, newFileName);

	//         fetch('/save-audio', {
	//             method: 'POST',
	//             body: formData
	//         })
	//         .then(response => response.json())
	//         .then(data => {
	//             console.log('File saved:', data);
	//             // 修改这里的路径
	//             $('#audio-preview').show();
	//             $('#audio-player').attr('src', `/tmp/${newFileName}`);
	//             $('#file-name').text(newFileName);
	//             $('#delete-audio').show();
	//         })
	//         .catch(error => {
	//             console.error('Error saving file:', error);
	//             alert('Failed to save audio file');
	//         });
	//     }
	// });

	// 处理删除音频
	$('#delete-audio').click(function () {

		// 获取 audio-preview 和 message 元素
		var audioPreview = document.querySelector('.audio-preview');
		var message = document.getElementById('message');

		// 给 audio-preview 添加 hidden 类
		audioPreview.classList.add('hidden');

		// 移除 message 的 hidden 类
		message.classList.remove('hidden');
		// 清空入框并将焦点重新放在输入框上
		$('#message').val('').focus(); // 清空输入框内容并设置焦点
		canSubmit = 0; // 设置可发送标志为0
		submitBtn.prop('disabled', true); // 禁用提交按钮
		submitBtn.find('img').attr('src', baseSubmitImg); // 更换按钮的箭头为灰色的
		// 获取 voice-image 元素
		var image = document.getElementById('voice-image');

		// 设置 voiceFlag 为 true，以便将图标更换为 voice.png
		voiceFlag = true;

		// 设置图片新源为 voice.png
		var newSrc = './icon/voice.png';

		// 添加过渡效果
		image.classList.add('changing');

		// 移除过渡效果类，这将在 CSS 中触发过渡
		setTimeout(function () {
			// 设置图片新源
			image.src = newSrc;
			image.classList.remove('changing');
		}, 300); // 300毫秒后移除，与 CSS 中的过渡时间相匹配
	});
