
function checkWindowSize() {
    const panelZoom = document.querySelector('.panel-zoom');
    const labels = document.querySelectorAll('.option-item label');
    if (window.innerWidth < 1000) {
        labels.forEach(label => {
            label.style.display = 'none';
        });
    } else {
        labels.forEach(label => {
            label.style.display = 'block'; // 或者使用 'inline' 或其他布局方式，根据你的具体需求
        });
    }
    
    
    
    if (window.innerWidth > 1000) {
        panelZoom.style.display = 'none';
    } else {
        panelZoom.style.display = 'flex'; // 或者使用 'flex' 等其他布局方式，根据你的具体需求
    }

}
// 初始检查
checkWindowSize();
// 监听窗口大小变化
window.addEventListener('resize', checkWindowSize);

function toggleFilter(event) {
        // 获取当前点击的 img_container
const container = event.target.closest('.img_container');
if (container) {
    // 获取当前点击的 img
    const currentImg = container.querySelector('img');
    
    // 移除除当前点击的 img 之外的所有 img 的 selected-filter 类
    document.querySelectorAll('.img_container img').forEach(img => {
        if (img !== currentImg) {
            img.classList.remove('selected-filter');
            
        }
    });

    // 切换当前点击的 img 的 selected-filter 类
    if (currentImg) {
        currentImg.classList.toggle('selected-filter');
    }
}
    }

    function updateEventListeners() {
        
        const imgContainers = document.querySelectorAll('.img_container');
        if (window.innerWidth < 1000) {
            imgContainers.forEach(container => {
                container.addEventListener('click', toggleFilter);
            });
        } else {
            imgContainers.forEach(container => {
                container.removeEventListener('click', toggleFilter);
            });
        }

        




    }

    // 初始检查
    updateEventListeners();

    // 监听窗口大小变化
    window.addEventListener('resize', updateEventListeners);

    function toggleVideoMaskHeight() {
        var videoMask = document.getElementById('video-mask');
        if (videoMask.style.height === '100%') {
            videoMask.style.height = '0px';
        } else {
            videoMask.style.height = '100%';
        }
    }

    function updatezoomListeners() {
        var ttsSelectionZoom = document.getElementById('tts-selection_zoom');

        if (window.innerWidth < 1000) {
           
            // 为 #tts-selection_zoom 添加事件监听器
            ttsSelectionZoom.addEventListener('click', toggleVideoMaskHeight);
            // 显示 #tts-selection_zoom
            ttsSelectionZoom.style.display = 'flex';
        } else {
            // 移除 #tts-selection_zoom 的事件监听器
            ttsSelectionZoom.removeEventListener('click', toggleVideoMaskHeight);
            // 隐藏 #tts-selection_zoom
            ttsSelectionZoom.style.display = 'none';
        }
        


    }

    

    // 初始检查
    updatezoomListeners();

    // 监听窗口大小变化
    window.addEventListener('resize', updatezoomListeners);

    const message2 = document.getElementById('message2');
    var voiceImage = document.getElementById('voice-image-zoom');
    const imageContainer = document.getElementById('image-container-zoom');



    function updateImageAndContainer() {
        voiceImage = document.getElementById('voice-image-zoom');
        if (message2.value.trim() !== '') {
            voiceImage.src = './icon/submitzoom.png';
            imageContainer.style.backgroundColor = '#1bb14f';
        } else {
            voiceImage.src = './icon/voice-zoom.png';
            imageContainer.style.backgroundColor = '#fff';
        }
    }

    function addInputListener() {
        message2.addEventListener('input', updateImageAndContainer);
    }

    function removeInputListener() {
        message2.removeEventListener('input', updateImageAndContainer);
    }

    function checkWindowSize2() {
        if (window.innerWidth < 1000) {
            addInputListener();
        } else {
            removeInputListener();
        }
    }

    // 初始检查
    checkWindowSize2();

    // 监听窗口大小变化
    window.addEventListener('resize', checkWindowSize2);

    const chatMessagesZoom = $('#chat-messages-zoom');

    function addMessageForZoom(message, isUser) {
        
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
        $('#chat-messages-zoom').append(messageDiv);

        // 获取消息区域的高度
        const chatAreaHeight = $('#chat-messages-zoom')[0].scrollHeight;
        // 获取刚刚发出的消息的高度
        const messageHeight = messageDiv[0].scrollHeight;
        // 计算滚动条需要滚动的距离
        const scrollPosition = chatAreaHeight - messageHeight;
        // 将滚动条滚动到刚刚发出的消息的顶部
        $('#chat-messages-zoom').scrollTop(scrollPosition);

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

    var imageContainerZoom = document.getElementById('image-container-zoom');

    imageContainerZoom.addEventListener('click', function() {
        // 获取容器内的 img 元素
        var voiceImage = imageContainerZoom.querySelector('img');

        // 获取图片的 src 属性
        var imgSrc = $('#voice-image-zoom').attr('src');

        // 检查图片的 src 是否为 voice.png
        if (imgSrc === './icon/voice-zoom.png') {
            $('#message2').addClass('hidden1');
            $('#speak-button').removeClass('hidden1');
        } else {
            $('#message2').removeClass('hidden1');
            $('#speak-button').addClass('hidden1');
        }
        // 检查当前图片的 src 属性
        if (voiceImage.src.includes('submitzoom.png')) {
            return;
        } else if (voiceImage.src.includes('voice-zoom.png')) {
            $('#chat-messages-zoom').addClass('hidden');
            voiceImage.style.width="60%";
            voiceImage.style.height="50%";
            voiceImage.style.borderRadius="0";
            voiceImage.src = './icon/pan.png';
        } else {
            $('#chat-messages-zoom').removeClass('hidden');
            voiceImage.style.width="50%";
            voiceImage.style.borderRadius="50%";
            voiceImage.src = './icon/voice-zoom.png';
        }

    });

    const imageContainerzoom = $('#image-container-zoom');
    
     // 监听image-container点击事件
     imageContainerzoom.on('click', function () {
        const voiceImage = $(this).find('img');
           const currentSrc = voiceImage.attr('src');
        if (currentSrc === './icon/submitzoom.png') {
            $('#submitPlayer')[0].play();

            var message = $('#message2').val();
            // 添加用户消息到聊天框
            addMessageForZoom(message, true);

            console.log('Sending: ' + message);
            console.log('sessionid: ', sessionid);

            const voiceImage1 = document.getElementById('voice-image-zoom');
            const imageContainer1 = document.getElementById('image-container-zoom');

            voiceImage1.src = './icon/voice.png';
            imageContainer1.style.backgroundColor = '#fff';

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
                    addMessageForZoom(llmResponse, false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    // 可选：显示错误消息
                    addMessageForZoom("Sorry, an error occurred. Please try again later.", false);
                });

            
            $('#message2').val('');

            
        }
    });

    function simulateZoomSubmit(message) {
        // 添加用户消息到聊天框
        addMessageForZoom(message, true);
        $('#submitPlayer')[0].play();
            
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
            addMessageForZoom(llmResponse, false);
        })
        .catch(error => {
            console.error('Error:', error);
            // 可选：显示错误消息
            addMessageForZoom("Sorry, an error occurred. Please try again later.", false);
        });
    
        // 清空入框
        $('#message2').val('');
    }


    // 设置 speak-button 的宽度与 message2 一致
	function syncWidth() {
	    speakButton.style.width = message2.offsetWidth + 'px';
	}

	// 初始化时同步宽度
	syncWidth();

	// 监听窗口大小变化，动态调整宽度
	window.addEventListener('resize', syncWidth);
