var pc = null;

function negotiate() {
    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });
    return pc.createOffer().then((offer) => {
        return pc.setLocalDescription(offer);
    }).then(() => {
        // wait for ICE gathering to complete
        return new Promise((resolve) => {
            if (pc.iceGatheringState === 'complete') {
                resolve();
            } else {
                const checkState = () => {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                };
                pc.addEventListener('icegatheringstatechange', checkState);
            }

          
        });
    }).then(() => {
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
        return response.json();
    }).then((answer) => {
        sessionid = answer.sessionid
        
        return pc.setRemoteDescription(answer);

    }).catch((e) => {
        alert(e);
    });


    
}

function start() {

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
			var videoElement = document.getElementById('video');
			        videoElement.srcObject = evt.streams[0];
			        videoElement.loop = false; 
            // document.getElementById('video').srcObject = evt.streams[0];
        } else {
            document.getElementById('audio').srcObject = evt.streams[0];
        }
    });

    
    document.getElementById('start').style.display = 'none';
    negotiate();
    document.getElementById('stop').style.display = 'inline-block';

    // 这个函数用于定期检查 pc 的状态
    function checkConnectionState() {
        if (!isConnected) {
            console.log("连接有误继续loading");
            showLoading(); // 显示 loading 提示
        } else {
            console.log("连接成功取消loading");
            hideLoading(); // 隐藏 loading 提示
        }
    }

    console.log("初始化检查链接");
    checkConnectionState()
    
    // 设置定时器，每2000毫秒（2秒）检查一次状态
    const intervalId = setInterval(checkConnectionState, 2000);
    const timeoutElement = document.querySelector('.Time-out');

    // 设置一个定时器，在40秒后停止重复检查
    setTimeout(() => {
        console.log("20秒后停止检查连接状态");
        clearInterval(intervalId); // 停止定时器
        hideLoading(); // 隐藏 loading 提示
        if (!isConnected)(
            timeoutElement.classList.add('pop') // 显示连接超时提示
        )
    }, 1000); // 40秒

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

    var textElement = document.querySelector('.Error-Dialog .text');
    if (textElement) {
        textElement.textContent = "Changing, please wait...";
    }

    showLoading();

    // 如果你还需要清理音频/视频流等资源，可以在这里添加更多清理代码
    // document.getElementById('video').srcObject = null;
    // document.getElementById('audio').srcObject = null;

    document.getElementById('stop').style.display = 'none';

    console.log("********************stop completed***********************************");
}

/*更换角色*/
function changeAvatar(val)
{ 
    if(!val){
        //换衣服
        avatarName = avatarName ==  'avatar5' ? 'avatar1' : 'avatar5'; 
        dataAvatars[0].value = avatarName;
    }
    else if(avatarName == val){
        return;
    }else{ 
       avatarName = val;//'';
    }
    if(avatarName ==  'avatar1' || avatarName ==  'avatar5'){
        $('#clothes_item').show();
    }else{
        $('#clothes_item').hide();
    } 

    stop2();
    console.log("AvatarName is:", avatarName);
    start();
}

/*更换ttsSelection  如：changeTtsSelection('tts2')*/
function changeTtsSelection(val)
{
    if(ttsSelection == val){
        return;
    }
    stop2();
    ttsSelection = val; 
    console.log("更换成功TtsSelection is:", ttsSelection);
    start();
}

/*更换 声音*/
function changeAvatarVoice(val)
{
    if(avatarVoice == val){
        return;
    }
    stop2();
    avatarVoice = val;//'';
    console.log("AvatarVoice is:", avatarVoice);
    start();
} 