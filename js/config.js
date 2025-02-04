
//1.19日服务器
// const host='http://52.40.208.108:7862'

//1.31日服务器
const host = 'http://18.237.179.127:7862'

//var avatarName = "avatar1";  	//会话人物

var avatarName = "avatar5"		//Miami会话默认
var ttsSelection = "tts1";   	//会话模块
var avatarVoice = "voice1"; 	//会话声音

var sessionid = "";				//会话id
var isConnected = false;		//链接状态
var noticeFlag=false;			//Hint标志
var canSubmit = 0; 				// 提交标志，默认为0
var streamType = "AUDIO_VIDEO"     // 推流方式

//推流方式
// LLM_ONLY   
// AUDIO_ONLY 
// AUDIO_VIDEO
// AUDIO_VIDEO

var dataAvatars = [];			//获取的模型人物名字集合
var datatVoices = [];			//获取的声音集合

let mediaRecorder;
let audioChunks = [];
let isRecording = false;  // 添加录音状态标志
let audioStream; // 用于存储麦克风流的全局变量

// 获取轮播区域元素
var buttons1 = document.querySelectorAll('.btn_1');
var swiperBox1 = document.getElementById('swiper1');
var buttons2 = document.querySelectorAll('.btn_2');
var swiperBox2 = document.getElementById('swiper2');
var buttons3 = document.querySelectorAll('.btn_3');
var swiperBox3 = document.getElementById('swiper3');

// 检查并显示 Hint 的函数
function checkAndShowHint() {
	const mediaQuery = window.matchMedia('(max-width: 1000px)');
    if (mediaQuery.matches && !noticeFlag) {
        const hint = document.querySelector('.Hint');
        hint.style.display = 'flex';
		noticeFlag=true;
    } else {
        // 否则，隐藏 Hint
        const hint = document.querySelector('.Hint');
        hint.style.display = 'none';
    }
}

// 显示 loading 提示的函数
function showLoading() {
	var loadingElement = document.querySelector('.Error-Dialog');
	loadingElement.classList.add('pop');
	document.body.style.pointerEvents = 'none';
}

// 隐藏 loading 提示的函数
function hideLoading() {
	var loadingElement = document.querySelector('.Error-Dialog');
	loadingElement.classList.remove('pop');
	checkAndShowHint();
	document.body.style.pointerEvents = 'auto';
}

function hideSwiperAndButtons(swiperBox, buttons) {
	// 如果轮播区域显示，则隐藏轮播区域和所有按钮
	if (swiperBox.classList.contains('show')) {
		swiperBox.classList.remove('show');
		buttons.forEach(function (button) {
			button.classList.remove('show');
		});
	}
}