// 外部监听器，用于在视频播放结束后更换视频源
var videoElement = document.getElementById('video');

videoElement.addEventListener('ended', function () {
    // 视频播放结束后更换视频源为base.mp4并设置循环播放
    videoElement.src = './video/base.mp4';
    videoElement.loop = true;
    videoElement.play(); // 播放base.mp4    
});

/*---------------为单个板块添加监听器---------------------*/
document.addEventListener('DOMContentLoaded', function () {
    const clothesItem = document.getElementById("clothes_item");
    clothesItem.addEventListener('click', function () {
        $('#changeItemVoice')[0].play();
        changeAvatar('')
        // 隐藏所有swiper
        /* $('.img_container').removeClass('selected');
         
         [swiperBox1, swiperBox2, swiperBox3].forEach(function(swiper) {
             swiper.classList.remove('show');
         });
         prevButton.classList.remove('show');
         nextButton.classList.remove('show');
         
         if (swiperBox4.classList.contains('show')) {
             // 如果swiper4是显示的，隐藏它
             swiperBox4.classList.remove('show');
             prevButton4.classList.remove('show');
             nextButton4.classList.remove('show');
        } else {
             swiperBox4.classList.add('show');
             prevButton4.classList.add('show');
             nextButton4.classList.add('show');
        }*/
    });

    // 获取 #video-mask 元素
    var videoMask = document.getElementById('video-mask');
    // 获取 #tts-selection 元素
    var ttsSelection = document.getElementById('tts-selection');

    // 为 #tts-selection 添加点击事件监听器
    ttsSelection.addEventListener('click', function () {
        if (videoMask.style.height === '100%') {
            videoMask.style.height = '0px';
        } else {
            videoMask.style.height = '100%';
        }
    });

    document.querySelector('.btn_wrapper').addEventListener('click', function () {

        console.log("展开TTS");

        // 获取TTS-item元素
        var ttsItem = document.querySelector('.TTS-item');

        // 切换元素的expanded类
        if (ttsItem.classList.contains('expanded')) {
            ttsItem.classList.remove('expanded');
        } else {
            ttsItem.classList.add('expanded');
        }
    });

});


/*-------------------------------------隐藏框的展示-------------------------------------*/
$('.more').click(function () {


    $('#popVoice')[0].play();

    var optionItems = document.querySelectorAll('.img_container');
    optionItems.forEach(function(item) {
        item.classList.remove('selected'); //假设选中类名为selected
    });
    

    

    // 隐藏swiper1和对应的按钮
    hideSwiperAndButtons(swiperBox1, buttons1);
    // 隐藏swiper2和对应的按钮
    hideSwiperAndButtons(swiperBox2, buttons2);
    // 隐藏swiper3和对应的按钮
    hideSwiperAndButtons(swiperBox3, buttons3);

    var optionscontainer = document.getElementById('options-container');
    if (optionscontainer.classList.contains('open')) {
        optionscontainer.classList.remove('open');
    } else {
        optionscontainer.classList.add('open');
    }

    var chatContainer = document.querySelector('.chat-container');
    // 切换当前的最大高度
    if (chatContainer.classList.contains('active')) {
        chatContainer.classList.remove('active');
        chatContainer.style.maxHeight = `${chatContainerHeight}px`
    } else {
        chatContainer.classList.add('active');
        chatContainer.style.maxHeight = '';
    }

});

function setupHoverEvents(selector) {
    // 为指定选择器的元素绑定 hover 事件
    $(selector).hover(
        function () {
            // 改变鼠标样式
            $(this).css('cursor', 'pointer');
        },
        function () {
            // 鼠标离开时恢复鼠标样式
            $(this).css('cursor', 'default');
        }
    );
}

setupHoverEvents('.img_container');
setupHoverEvents('.more');
setupHoverEvents('.Tcancel');
setupHoverEvents('.voice_img');
setupHoverEvents('#record_wrapper');
setupHoverEvents('#stop_wrapper');
setupHoverEvents('#custom-player');
setupHoverEvents('#zoomIcon');
setupHoverEvents('.ZoomClick');
setupHoverEvents('.btn_wrapper');

// 封装检查和切换视频遮罩高度的函数
function TVideoMask() {
    // 获取 #video-mask 元素
    var videoMask = document.getElementById('video-mask');
    // 获取 #tts-selection 元素
    var ttsSelection = document.getElementById('tts-selection');
    if (videoMask.style.height === '100%') {
        videoMask.style.height = '0px';
    }
}

function TTSitemHide(){
    var ttsItem = document.querySelector('.TTS-item');
    ttsItem.classList.remove('expanded');
}



/*功能元素选中*/
$(document).ready(function () {

    // 功能元素选中
    $('.option-item').click(function () {
        /*整体获取和删除*/
        var imgContainer = $(this).find('.img_container');

        $('#optionsVoice')[0].play();

        var swiperBoxes = document.querySelectorAll('.swiper-container');
        // 选择所有的 .swiper-button-prev 元素
        var prevButtons = document.querySelectorAll('.swiper-button-prev');
        // 选择所有的 .swiper-button-next 元素
        var nextButtons = document.querySelectorAll('.swiper-button-next');
        // 遍历所有的 .swiper-container 元素，并移除 'show' 类
        swiperBoxes.forEach(function (box) {
            $(box).removeClass('show');
        });

        // 遍历所有的 .swiper-button-prev 元素，并移除 'show' 类
        prevButtons.forEach(function (button) {
            $(button).removeClass('show');
        });

        // 遍历所有的 .swiper-button-next 元素，并移除 'show' 类
        nextButtons.forEach(function (button) {
            $(button).removeClass('show');
        });


        if (imgContainer.hasClass('selected')) {
            imgContainer.removeClass('selected');
        } else {
            $('.img_container').removeClass('selected');
            imgContainer.addClass('selected');
            let dataname = $(this).data('name');
            var buttons;
            var swiperBox;
            if (dataname == 'avatar') {
                TVideoMask();
                buttons = document.querySelectorAll('.btn_3');
                swiperBox = document.getElementById('swiper3');
            } else if (dataname == 'tts') {

            } else if (dataname == 'voice') {
                TVideoMask();
                buttons = document.querySelectorAll('.btn_2');
                swiperBox = document.getElementById('swiper2');

            } else if (dataname == 'background') {
                TVideoMask();
                buttons = document.querySelectorAll('.btn_1');
                swiperBox = document.getElementById('swiper1');
            }
            if (swiperBox) {
                
                $(swiperBox).addClass('show')
                buttons.forEach(function (button) {
                    $(button).addClass('show');
                });
            }

        }

    });

});
