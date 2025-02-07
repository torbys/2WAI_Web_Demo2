
let isFirstEnter1 = true;
let isFirstEnter2 = true;
let isFirstEnter3 = true;
let isFirstEnter4 = true;

effect = 1
var swiper1 = new Swiper('#swiper1', {
    loop: true,
    speed: 1500,
    slidesPerView: 5,
    spaceBetween: 30,
    centeredSlides: true,
    watchSlidesProgress: true,
    on: {
        setTranslate: function () {
            slides = this.slides
            for (i = 0; i < slides.length; i++) {
                slide = slides.eq(i)
                progress = slides[i].progress
                //slide.html(progress.toFixed(2)); 看清楚progress是怎么变化的
                slide.css({ 'opacity': '', 'background': '' }); slide.transform('');//清除样式

                if (effect == 1) {
                    slide.transform('scale(' + (1 - Math.abs(progress) / 8) + ')');
                } else if (effect == 2) {
                    slide.css('opacity', (1 - Math.abs(progress) / 6));
                    slide.transform('translate3d(0,' + Math.abs(progress) * 20 + 'px, 0)');
                }
                else if (effect == 3) {
                    slide.transform('rotate(' + progress * 30 + 'deg)');
                } else if (effect == 4) {
                    slide.css('background', 'rgba(' + (255 - Math.abs(progress) * 20) + ',' + (127 + progress * 32) + ',' + Math.abs(progress) * 64 + ')');
                }

            }
        },
        setTransition: function (transition) {
            for (var i = 0; i < this.slides.length; i++) {
                var slide = this.slides.eq(i)
                slide.transition(transition);
            }
        },
        slideChangeTransitionStart: function () {
            // 检查是否是第一次进入
            if (isFirstEnter1) {
                isFirstEnter1 = false;
            } else {
                $('#ScrollVoice')[0].play();
            }
        },
        slideChangeTransitionEnd: function () {
            // 获取当前激活的slide的索引
            var activeIndex = this.activeIndex;
            for (var i = 0; i < this.slides.length; i++) {
                this.slides[i].classList.remove('swiper-slide-active');
            }
            
            

            this.slides[this.activeIndex].classList.add('swiper-slide-active');

            // 获取当前激活的slide元素
            var activeSlide = this.slides[activeIndex];

            // 获取当前激活的slide中的图片元素
            var activeImage = activeSlide.querySelector('img');

            hideSwiperAndButtons(swiperBox1, buttons1);
            cancelSelection('avatar-background');
            // 打印图片的src属性
            console.log("执行切换" + activeImage.src);
            changeBg(activeImage.src); 
        }
    },
    navigation: {
        nextEl: '#next1',
        prevEl: '#prev1',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    
});

effect = 1
swiper4 = new Swiper('#swiper4', {
    loop: true,
    speed: 1500,
    slidesPerView: 5,
    spaceBetween: 30,
    centeredSlides: true,
    watchSlidesProgress: true,
    on: {
        setTranslate: function () {
            slides = this.slides
            for (i = 0; i < slides.length; i++) {
                slide = slides.eq(i)
                progress = slides[i].progress
                //slide.html(progress.toFixed(2)); 看清楚progress是怎么变化的
                slide.css({ 'opacity': '', 'background': '' }); slide.transform('');//清除样式

                if (effect == 1) {
                    slide.transform('scale(' + (1 - Math.abs(progress) / 8) + ')');
                } else if (effect == 2) {
                    slide.css('opacity', (1 - Math.abs(progress) / 6));
                    slide.transform('translate3d(0,' + Math.abs(progress) * 20 + 'px, 0)');
                }
                else if (effect == 3) {
                    slide.transform('rotate(' + progress * 30 + 'deg)');
                } else if (effect == 4) {
                    slide.css('background', 'rgba(' + (255 - Math.abs(progress) * 20) + ',' + (127 + progress * 32) + ',' + Math.abs(progress) * 64 + ')');
                }

            }
        },
        setTransition: function (transition) {
            for (var i = 0; i < this.slides.length; i++) {
                var slide = this.slides.eq(i)
                slide.transition(transition);
            }
        },
        slideChangeTransitionStart: function () {
            if (isFirstEnter2) {
                isFirstEnter2 = false;
            } else {
                $('#ScrollVoice')[0].play();
            }
        },
        slideChangeTransitionEnd: function () {

            for (var i = 0; i < this.slides.length; i++) {
                this.slides[i].classList.remove('swiper-slide-active');
            }
            // 给当前选中的滑块添加边框样式
            this.slides[this.activeIndex].classList.add('swiper-slide-active');

            console.log("切换衣服", this.activeIndex)
        }
    },
    navigation: {
        nextEl: '#next4',
        prevEl: '#prev4',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

var swiper2;
var swiper3;

function initSwiper() {
    // 声音选择部分
    effect = 1
    swiper2 = new Swiper('#swiper2', {
        loop: true,
        speed: 1500,
        slidesPerView: 5,
        spaceBetween: 30,
        centeredSlides: true,
        watchSlidesProgress: true,
        on: {
            setTranslate: function () {
                slides = this.slides
                for (i = 0; i < slides.length; i++) {
                    slide = slides.eq(i)
                    progress = slides[i].progress
                    slide.css({ 'opacity': '', 'background': '' }); slide.transform('');//清除样式
                    if (effect == 1) {
                        slide.transform('scale(' + (1 - Math.abs(progress) / 8) + ')');
                    } else if (effect == 2) {
                        slide.css('opacity', (1 - Math.abs(progress) / 6));
                        slide.transform('translate3d(0,' + Math.abs(progress) * 20 + 'px, 0)');
                    } else if (effect == 3) {
                        slide.transform('rotate(' + progress * 30 + 'deg)');
                    } else if (effect == 4) {
                        slide.css('background', 'rgba(' + (255 - Math.abs(progress) * 20) + ',' + (127 + progress * 32) + ',' + Math.abs(progress) * 64 + ')');
                    }
                }
            },
            setTransition: function (transition) {
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i)
                    slide.transition(transition);
                }
            },
            slideChangeTransitionStart: function () {
                if (isFirstEnter3) {
                       isFirstEnter3 = false;
                } else {
                    $('#ScrollVoice')[0].play();
                }
            },
            slideChangeTransitionEnd: function () {
                console.log("切换音色", this.realIndex);

                const slidesArray = Array.from(this.slides);

                slidesArray.forEach(slide => {
                  slide.classList.remove('swiper-slide-active');
                });

                // 计算有效索引（处理循环模式）
                const effectiveIndex = this.realIndex % datatVoices.length;

                // 精准定位目标元素
                const targetSlide = slidesArray.find(slide => 
                  parseInt(slide.dataset.swiperSlideIndex) === effectiveIndex
                );

                // 添加激活状态
                if (targetSlide) {
                  targetSlide.classList.add('swiper-slide-active');
                  console.log('当前激活元素索引:', effectiveIndex, targetSlide);
                }

                hideSwiperAndButtons(swiperBox2, buttons2);
                cancelSelection('avatar-voice');

                // 执行音色切换
                if (isConnected && datatVoices.length > 0 && datatVoices[effectiveIndex]) {
                  changeAvatarVoice(datatVoices[effectiveIndex].value);
                  
                }
            }
        },
        navigation: {
            nextEl: '#next2',
            prevEl: '#prev2',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    /*人物选择部份*/
    swiper3 = new Swiper('#swiper3', {
        loop: true,
        speed: 1500,
        slidesPerView: 5,
        spaceBetween: 30,
        centeredSlides: true,
        watchSlidesProgress: true,
        on: {
            setTranslate: function () {
                slides = this.slides
                for (i = 0; i < slides.length; i++) {
                    slide = slides.eq(i)
                    progress = slides[i].progress
                    slide.css({ 'opacity': '', 'background': '' }); slide.transform('');//清除样式

                    if (effect == 1) {
                        slide.transform('scale(' + (1 - Math.abs(progress) / 8) + ')');
                    } else if (effect == 2) {
                        slide.css('opacity', (1 - Math.abs(progress) / 6));
                        slide.transform('translate3d(0,' + Math.abs(progress) * 20 + 'px, 0)');
                    }
                    else if (effect == 3) {
                        slide.transform('rotate(' + progress * 30 + 'deg)');
                    } else if (effect == 4) {
                        slide.css('background', 'rgba(' + (255 - Math.abs(progress) * 20) + ',' + (127 + progress * 32) + ',' + Math.abs(progress) * 64 + ')');
                    }

                }
            },
            setTransition: function (transition) {
                for (var i = 0; i < this.slides.length; i++) {
                    var slide = this.slides.eq(i)
                    slide.transition(transition);
                }
            },
            slideChangeTransitionStart: function () {
                if (isFirstEnter4) {
                       isFirstEnter4 = false;
                } else {
                    $('#ScrollVoice')[0].play();
                }
            },
            slideChangeTransitionEnd: function () {
                // 将 slides 转换为数组
                const slidesArray = Array.from(this.slides);

                // 移除所有激活状态
                slidesArray.forEach(slide => {
                  slide.classList.remove('swiper-slide-active');
                });
            
                // 添加当前激活状态
                const effectiveIndex = this.realIndex % dataAvatars.length;
                const targetSlide = slidesArray.find((slide, index) => 
                  parseInt(slide.dataset.swiperSlideIndex) === effectiveIndex
                );
            
                if (targetSlide) {
                  targetSlide.classList.add('swiper-slide-active');
                }
            
                hideSwiperAndButtons(swiperBox3, buttons3);
                cancelSelection('avatar-name');
                
                // 后续业务逻辑
                if (dataAvatars.length > 0 && dataAvatars[effectiveIndex] && isConnected) {
                  changeAvatar(dataAvatars[effectiveIndex].value);
                }
            },
        },
        navigation: {
            nextEl: '#next3',
            prevEl: '#prev3',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
}
