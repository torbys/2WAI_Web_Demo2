	
	$(document).ready(function () {
		// var host = window.location.hostname
		// var ws = new WebSocket("ws://"+host+":8000/humanecho");
		// //document.getElementsByTagName("video")[0].setAttribute("src", aa["video"]);
		// ws.onopen = function() {
		// console.log('Connected');
		// };
		// ws.onmessage = function(e) {
		// console.log('Received: ' + e.data);
		// data = e
		// var vid = JSON.parse(data.data); 
		// console.log(typeof(vid),vid)
		// //document.getElementsByTagName("video")[0].setAttribute("src", vid["video"]);

		// };
		// ws.onclose = function(e) {
		// console.log('Closed');
		// };

		var submitBtn = $('button[type="submit"]');
		var messageTextarea = $('#message');
		var submitImg = './icon/submit.png'; // 绿色按钮的图片路径
		var baseSubmitImg = './icon/base_submit.png'; // 灰色按钮的图片路径


		// 监听textarea输入事件
		messageTextarea.on('input', function () {
			var message = $(this).val().trim();
			if (message === '') {
				// 如果textarea为空，设置flag为0，显示灰色图片，禁用按钮
				canSubmit = 0;
				submitBtn.prop('disabled', true);
				submitBtn.find('img').attr('src', baseSubmitImg);
			} else {
				// 如果textarea不为空，设置flag为1，显示绿色图片，启用按钮
				canSubmit = 1;
				submitBtn.prop('disabled', false);
				submitBtn.find('img').attr('src', submitImg);
			}
		});

		// 监听textarea回车键事件
		messageTextarea.on('keydown', function (e) {
			if (e.which === 13) { // 检查是否是回车键（键码为13）
				e.preventDefault(); // 阻止默认行为
				if (canSubmit === 1) {
					$('#echo-form').trigger('submit'); // 手动触发表单提交事件
				}
			}
		});

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

		$('#echo-form').on('submit', function (e) {
			e.preventDefault();
			if (canSubmit === 1) {

				$('#submitPlayer')[0].play();
				// 获取 audio-preview 元素
				var audioPreview = $('.audio-preview');

				

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

				var message = $('#message').val();
				// 添加用户消息到聊天框
				addMessage(message, true);

				console.log('Sending: ' + message);
				console.log('sessionid: ', sessionid);

				const audio = document.getElementById('audio');
        		audio.play().catch(error => {
        		    console.error('无法自动播放音频:', error);
        		});


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
		});

	});