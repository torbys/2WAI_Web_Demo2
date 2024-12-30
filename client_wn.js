var pc = null;

function negotiate() {
	// 为WebRTC PeerConnection添加一个只接收视频的传输通道
    pc.addTransceiver('video', { direction: 'recvonly' });
	// 为WebRTC PeerConnection添加一个只接收音频的传输通道
    pc.addTransceiver('audio', { direction: 'recvonly' });
	// 创建一个offer（会话提议），表示想要建立连接的意愿，并设置本地描述
    return pc.createOffer().then((offer) => {
        return pc.setLocalDescription(offer);
    }).then(() => {
        // wait for ICE gathering to complete
	
        return new Promise((resolve) => {
            if (pc.iceGatheringState === 'complete') {
							// 如果ICE候选收集尚未完成，设置一个事件监听器来检查状态变化
                resolve();
            } else {
                const checkState = () => {
                    if (pc.iceGatheringState === 'complete') {
		
						    // 一旦ICE候选收集完成，移除事件监听器并解决Promise
                        pc.removeEventListener('icegatheringstatechange', checkState);
						
                        resolve();
                    }
                };
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        });
    }).then(() => {
		// 发送HTTP请求，将offer信息和一些附加数据（如头像名称、文本转语音选择、头像声音）发送到服务器
		
        var offer = pc.localDescription; 
        return fetch(host+'/offer', {
            body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
                avatarName: avatarName,  
                ttsSelection: ttsSelection,            
                avatarVoice: avatarVoice       
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }).then((response) => {
		// 将响应转换为JSON格式
        return response.json();
    }).then((answer) => {
		 // 从服务器接收到answer（会话应答），并设置为远程描述
		console.log("negotiate建立会话")
        sessionid = answer.sessionid	//获取sessionid
        return pc.setRemoteDescription(answer);
    }).catch((e) => {
        alert(e);
    });
}

function start() {
	
	
	/*PC初始化通过webrtc获得视频流*/
    var config = {
        sdpSemantics: 'unified-plan'
    };
	
	// var videoElement = document.getElementById('video');
	// videoElement.src='./video/active.mp4';
	// videoElement.loop = false; 

    if (document.getElementById('use-stun').checked) {
        config.iceServers = [{ urls: ['stun:stun.l.google.com:19302'] }];
    }

    pc = new RTCPeerConnection(config);

    // connect audio / video
    pc.addEventListener('track', (evt) => {
        isConnected = true
        if (evt.track.kind == 'video') {
			console.log("webrtc视频推流")
			var videoElement = document.getElementById('video');
			videoElement.srcObject = evt.streams[0];
			videoElement.loop = false; 
            // document.getElementById('video').srcObject = evt.streams[0];
        } else {
            document.getElementById('audio').srcObject = evt.streams[0];
        }
    });

    document.getElementById('start').style.display = 'none';
	/*获取视频流后建立连接*/
    negotiate();
    document.getElementById('stop').style.display = 'inline-block';
}

function stop() {
    console.log("********************666***********************************");
    // document.getElementById('stop').style.display = 'none';
    console.log("********************777***********************************");

    // close peer connection
    setTimeout(() => {
        pc.close();
    }, 500);
    console.log("********************888***********************************");
}

function stop2() {
    console.log("********************stop***********************************");

    if (pc) {
        pc.close();
        pc = null; 
    }

    // 如果你还需要清理音频/视频流等资源，可以在这里添加更多清理代码
    // document.getElementById('video').srcObject = null;
    // document.getElementById('audio').srcObject = null;

    document.getElementById('stop').style.display = 'none';

    console.log("********************stop completed***********************************");
}

document.getElementById('tts-selection').addEventListener('change', function () {
    stop2();

    var ttsSelection = this.value;
    console.log("Selected TTS:", ttsSelection);

    start();
});

document.getElementById('avatar-name').addEventListener('change', function () {
    stop2();

    var ttsSelection = this.value;
    console.log("Selected TTS:", ttsSelection);

    start();
});
