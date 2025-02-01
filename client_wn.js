var pc = null;
var isChange = false;

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
        // console.log(offer.sdp);
        return fetch(host+'/offer', {
            body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
                avatarName: avatarName,  
                ttsSelection: ttsSelection,            
                avatarVoice: avatarVoice,
                streamType:streamType
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

const timeoutElement = document.querySelector('.Time-out');
// 定义在全局作用域中
var intervalId;
var intervalconnecting;

 // 这个函数用于定期检查 pc 的状态
function checkConnectionState() {

    console.log("现在的链接状态"+pc.connectionState);

    if (isConnected /*|| pc.connectionState === "connected"*/) {
        console.log("连接成功取消loading");
        hideLoading(); // 隐藏 loading 提示
        clearInterval(intervalId);
    } else {
        console.log("连接有误继续loading");
        showLoading(); // 显示 loading 提示
    }
}

function checkConnectioning(){

    console.log("现在的链接状态"+pc.connectionState);
    
    if (pc.connectionState === "connecting" || pc.connectionState === "checking") {
        console.log("更换中loading");
        showLoading(); // 显示加载提示
    } else if(pc.connectionState === "connected"){
        console.log("连接完成或断开，隐藏loading");
        hideLoading(); // 隐藏加载提示
        clearInterval(intervalconnecting);
    }

}

function cheackTimeOut(intervalId){
    setTimeout(() => {
        clearInterval(intervalId); // 停止定时器
        if ( pc === null || pc.connectionState !== "connected") {
            hideLoading(); // 隐藏 loading 提示
            timeoutElement.classList.add('pop'); // 显示连接超时提示
        }
    },300000); //5分钟300000
}

function start() {


    var config = {
        sdpSemantics: 'unified-plan'
    };

    if (document.getElementById('use-stun').checked) {
       //aws1
        // config.iceServers=[
        //     {
        //         urls: "turn:35.89.226.131:3478",
        //         username: "webrtc.aws.com",
        //         credential: "repcun-xikdov-6kohdE",
        //     }
        // ]

        //aws2
        // config.iceServers=[
        //     {
        //         urls: "turn:35.153.157.142:3478",
        //         username: "webrtc.aws.com",
        //         credential: "repcun-xikdov-6kohdE",
        //     }
        // ]

        //1.13runpod
        // config.iceServers=[
        //     {
        //         urls: "turn:3.137.204.36:3478",
        //         username: "webrtc.aws.com",
        //         credential: "repcun-xikdov-6kohdE"
        //     }
        // ]

        //1.15日turn
        config.iceServers=[
            {
                urls: "turn:3.137.204.36:3478",
                username: "webrtc.aws.com",
                credential: "repcun-xikdov-6kohdE"
            }
        ]

    }

    pc = new RTCPeerConnection(config);    

    // connect audio / video
    pc.addEventListener('track', (evt) => {
        isConnected = true
        if (evt.track.kind == 'video') {
            console.log("视频被加载了")
			var videoElement = document.getElementById('video');
			        videoElement.srcObject = evt.streams[0];
			        videoElement.loop = false; 
            // document.getElementById('video').srcObject = evt.streams[0];
        } else {
            console.log("音频被加载了")
            document.getElementById('audio').srcObject = evt.streams[0];
        }
    });


    negotiate();

    console.log("Start现在的链接状态"+pc.connectionState);

    var textElement = document.querySelector('.Error-Dialog .text');
    if (!isConnected) {
        textElement.textContent = "Connection in progress...";
        console.log("初始化检查链接");
        checkConnectionState();
        intervalId = setInterval(checkConnectionState, 2000);
        cheackTimeOut(intervalId);
    } 

    if(isChange){
        var textElement = document.querySelector('.Error-Dialog .text');
        textElement.textContent = "Switching in progress...";    
        console.log("切换检查链接");
        checkConnectioning();
        intervalconnecting = setInterval(checkConnectioning, 2000);
        cheackTimeOut(intervalconnecting);
        isChange=false;
    }

}

// function stop() {
//     console.log("********************666***********************************");
//     // document.getElementById('stop').style.display = 'none';
//     console.log("********************777***********************************");

//     // close peer connection
//     setTimeout(() => {
//         pc.close();
//     }, 500);

//     console.log("********************888***********************************");
// }

function stop2() {

    console.log("********************stop***********************************");

    fetch(host+'/stop_current_avatar',{
            method: 'POST',
            body: JSON.stringify(
                {
                    sessionid: sessionid,    //parseInt(document.getElementById('sessionid').value),
                }
            )
        }
    );

    if (pc) {
        pc.close();
        pc = null; 
    }
    
    showLoading();

    // 如果你还需要清理音频/视频流等资源，可以在这里添加更多清理代码
    // document.getElementById('video').srcObject = null;
    // document.getElementById('audio').srcObject = null;
    // document.getElementById('stop').style.display = 'none';
    console.log("********************stop completed***********************************");
}

function resetSwiper1ToFirstSlide() {
    buttons = document.querySelectorAll('.btn_1');
	swiperBox = document.getElementById('swiper1'); 
    $(swiperBox).removeClass('show')
    $('#avatar-background').removeClass('selected');
    buttons.forEach(function(button) {
        $(button).removeClass('show');
    });
     setTimeout(function() {
        swiper1.slideTo(5, 1000, false); // 将 Swiper 滑动到第5个幻灯片
    }, 1000); // 延迟1000毫秒（即1秒）执行
}

// 映射关系

const avatarVoiceMapping = {
    'avatar1': 'voice1',
    'avatar5': 'voice1',
    'avatar2': 'voice2',
    'avatar3': 'voice3',
    'avatar4': 'voice4',
    'avatar8': 'voice4',
    'avatar11':' voice11',
    'avatar12':' voice12',
    'avatar13':' voice13',
    'avatar14':' voice14',
    'avatar15': 'voice15'
};


function updateAvatarVoice(avatarName) {

    const newVoice = avatarVoiceMapping[avatarName];
    if (avatarVoice === newVoice) {
        return;
    }

    avatarVoice = newVoice;
    console.log("re AvatarVoice is:", avatarVoice);

    const voiceIndex = datatVoices.findIndex(voice => voice.value === newVoice);
    if (voiceIndex !== -1) {
        // 切换到对应的声音 slide
        swiper2.slideTo(voiceIndex);
    }

    fetch(host + '/change_property', {
        method: 'POST',
        body: JSON.stringify(
            {
                sessionid:sessionid,
                ttsSelection: ttsSelection,
                avatarVoice: avatarVoice,
            }
        )
    })
    .then(response => response.json())
    .then(data => {
        console.log('请求成功，返回的数据是：', data);
    })
    .catch(error => {
        console.error('请求失败，错误信息是：', error);
    });
}

/*更换角色*/
function changeAvatar(val)
{ 
    if(!val){
        
        if (avatarName == 'avatar1' || avatarName == 'avatar5') {
            avatarName = avatarName == 'avatar1' ? 'avatar5' : 'avatar1';
            dataAvatars[0].value = avatarName;
        } else if (avatarName == 'avatar4' || avatarName == 'avatar8') {
            avatarName = avatarName == 'avatar4' ? 'avatar8' : 'avatar4';
            dataAvatars[3].value = avatarName;
        }
        
    }
    else if(avatarName == val){
        return;
    }else{ 
       avatarName = val;//'';
    }

    // 更新显示逻辑
    if (avatarName == 'avatar1' || avatarName == 'avatar5' || avatarName == 'avatar4' || avatarName == 'avatar8') {
        $('#clothes_item').show();
    } else {
        $('#clothes_item').hide();
    }

    stop2();
    resetSwiper1ToFirstSlide();
    updateAvatarVoice(avatarName); // 自动更新声音设置
    console.log("AvatarName is:", avatarName);
    isChange=true;
    start();
}

/*更换ttsSelection  如：changeTtsSelection('tts2')*/
function changeTtsSelection(val)
{
    if(ttsSelection == val){
        return;
    }

    // 获取TTS-item元素
	var ttsItem = document.querySelector('.TTS-item')

    // stop2();
    ttsSelection = val; 
    console.log("更换TtsSelection is:", ttsSelection);
    showLoading();

    // 请求数据
    const requestData = {
        sessionid: sessionid,
        ttsSelection: ttsSelection,
        avatarVoice: avatarVoice,
    };

    

    fetch(host+'/change_property',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(requestData)
        }
    ).then(response => response.json()) // 处理请求成功的情况
    .then(data => {
        console.log('请求成功，返回的数据是：', data);
        ttsItem.classList.remove('expanded');
        hideLoading(); 
    })
    .catch(error => {
        console.error('请求失败，错误信息是：', error);
        ttsItem.classList.remove('expanded');
        hideLoading(); 
    });
}


/*更换 声音*/
function changeAvatarVoice(val)
{
    
    if(avatarVoice == val){
        return;
    }

    // stop2();
    avatarVoice = val;//'';
    console.log("AvatarVoice is:", avatarVoice);

    showLoading();
    fetch(host+'/change_property',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                sessionid: sessionid,
                ttsSelection: ttsSelection,
                avatarVoice: avatarVoice,
            })
        }
    ).then(response => response.json()) // 处理请求成功的情况
    .then(data => {
        console.log('请求成功，返回的数据是：', data);
        hideLoading(); 
    })
    .catch(error => {
        console.error('请求失败，错误信息是：', error);
        hideLoading(); 
    });
} 

/*切换背景的请求*/
function changeBg(imgurl)
{

    let arr = imgurl.split('/');  
    console.log("切换到"+arr[arr.length - 1] );
    if(isConnected && sessionid){
        showLoading();
        fetch(host+'/background',{
            method: 'POST',
            body: JSON.stringify({
                sessionid: sessionid,
                img_url: 'web/backgrounds/'+arr[arr.length - 1] 
            })
        }
        )
        .then(response => {
            if (response.ok) {
                console.log('Request successful');
                hideLoading(); 
            } else {
                throw new Error('Request failed with status: ' + response.status);
            }
        })
        .catch(error => {
            hideLoading(); 
            console.error('Error:', error);
        });
    } 

}
