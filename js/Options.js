	// 在现有的 JavaScript 代码中添加

	function updateSwiper(swiper) {
	    if (window.innerWidth < 1000) {
	        // 当屏幕宽度小于1000像素时，设置slidesPerView为3，spaceBetween为20
	        if (swiper.params.slidesPerView !== 3) {
	            swiper.params.slidesPerView = 3;
	            swiper.params.spaceBetween = 25;
	            swiper.update();
	        }
	    } else {
	        // 当屏幕宽度大于或等于1000像素时，恢复slidesPerView为5，spaceBetween为30
	        if (swiper.params.slidesPerView !== 3) {
	            swiper.params.slidesPerView = 5;
	            swiper.params.spaceBetween = 30;
	            swiper.update();
	        }
	    }
	}
	console.log("选项初始化链接开始")

	/*---------------------------动态调整轮播图数量-----------------------------*/
	async function loadOptions() {
		showLoading();

		const response = await fetch(host + '/options.json');
		const options = await response.json();
		window.appConfig = options;

		// 填充 Digital Human 选项框 人物切换
		const avatarSelect = document.getElementById('avatar-name');

		// 定义需要筛选的 value 值
		const targetValues = ["avatar5"];

		let avatars = '';
		let countAvatar = 0; // 用于跟踪已处理的元素数量 

		console.log(options.avatars);

		// 先单独处理 "avatar21"
		const avatar21 = options.avatars.find(avatar => avatar.value === "avatar21");
		if (avatar21) {
		  const imgSrc = `./icon/${avatar21.value}.png`;
		  console.log('create avatar', imgSrc);
		  avatars += `<div class="swiper-slide">  <img src="${imgSrc}" alt="${imgSrc}" />  </div>`;
		  countAvatar++;
		}

		// 从 targetValues 中移除 "avatar21"
		const remainingValues = targetValues.filter(value => value !== "avatar21");

		// 使用 filter 方法筛选出符合条件的其他 avatars
		const filteredAvatars = options.avatars.filter(avatar => remainingValues.includes(avatar.value));

		filteredAvatars.forEach(avatar => {
		  const imgSrc = `./icon/${avatar.value}.png`;
		  console.log('create avatar', imgSrc);
		  avatars += `<div class="swiper-slide">  <img src="${imgSrc}" alt="${imgSrc}" />  </div>`;
		  countAvatar++;
		});

		// 将 avatar21 添加到 filteredAvatars 的开头
		if (avatar21) {
			filteredAvatars.unshift(avatar21);
 		}

		// options.avatars.forEach(avatar => {
		// 	const imgSrc = `./icon/${avatar.value}.png`;
		// 	console.log('create avatar', imgSrc);
		// 	avatars += `<div class="swiper-slide">  <img src="${imgSrc}" alt="${imgSrc}" />  </div>`;
		// 	countAvatar++; 
		// });

		// 将筛选后的数据存储到 dataAvatars 中
		dataAvatars = filteredAvatars;
		datatVoices = options.ttsVoices;

		console.log(dataAvatars); // 输出筛选后的数据内容

		$('#swiper3 .swiper-wrapper').html(avatars);

		/*---------------------TTS-item条目创建--------------------------*/
		const ttsItemContainer = document.querySelector('.TTS-item');

		// 清空TTS-item容器中现有的选择项，避免重复添加
		ttsItemContainer.innerHTML = '';

		// 遍历ttsModules数组
		options.ttsModules.forEach(tts => {
			// 创建一个新的selection-item div
			const selectionItem = document.createElement('div');
			selectionItem.className = 'selection-item';
			selectionItem.textContent = tts.label; // 设置显示的文字描述
			console.log("创建了"+tts.label);
			selectionItem.setAttribute('data-value', tts.value); // 存储值，可以通过getAttribute('data-value')访问

			// 为选择项添加点击事件
			selectionItem.addEventListener('click', function () {
				const selectedValue = event.target.getAttribute('data-value');
   				console.log('选中的值是：', selectedValue);
				TVideoMask() 
				TTSitemHide()
				cancelSelection('TTS-item');
    			changeTtsSelection(selectedValue); // 传递获取到的值
			});

			// 将新创建的div添加到TTS-item容器中
			ttsItemContainer.appendChild(selectionItem);
		});



		// 填充 TTS Sound 选择框 音色的切换
		const voiceSelect = document.getElementById('avatar-voice');
		let ttsVoices = "";
		let vcolors = ['#dc4b4b', '#4bc05e', '#4b66c0', '#ffda48', '#aa6de8'], vindex = 0;
		options.ttsVoices.forEach(voice => {

			const nameInBrackets = voice.label.match(/\((.*?)\)/) ? voice.label.match(/\((.*?)\)/)[1] : '';
			console.log('Create sound: ' + voice.value + nameInBrackets);


			ttsVoices += `<div class="swiper-slide" data-voice="${voice.value}">
                               <div class="color_img" style="background-color: ${vcolors[vindex]};">
                                 <img src="./icon/voiceLine.png" alt="" />
                                 <div>${nameInBrackets}</div> <!-- 在这里插入括号里的名字 -->
                               </div>
                             </div>`;

			vindex += 1;
			if (vindex > 4) {
				vindex = 0;
			}
		});

		$('#swiper2 .swiper-wrapper').html(ttsVoices);

		initSwiper(countAvatar);

		// 设置默认选中项
		if (options.avatars.length > 0) {
			avatarName = dataAvatars[0].value;
		}
		if (options.ttsModules.length > 0) {
			ttsSelection = options.ttsModules[0].value;
		}
		if (options.ttsVoices.length > 0) {
			avatarVoice = options.ttsVoices[0].value;
		}

		/*选则填充好后再触发一次切换视频流*/
		console.log("选项初始化链接结束")
		
		function addThumbnailClickEvents(swiperInstance, selector) {
		console.log("click")
		var thumbnails = document.querySelectorAll(selector + ' .swiper-slide');
		thumbnails.forEach(function (slide, index) {
				// 添加鼠标悬停事件
				slide.addEventListener('mouseenter', function (e) {
					e.stopPropagation();
					// 鼠标悬停时改变鼠标样式
					e.target.style.cursor = 'pointer';
				});
				// 添加鼠标离开事件
				slide.addEventListener('mouseleave', function (e) {
					e.stopPropagation();
					// 鼠标离开时恢复鼠标样式
					e.target.style.cursor = 'default';
				});

				slide.addEventListener('click', function (e) {
					// 阻止事件冒泡
					e.stopPropagation();
					// 跳转到对应的幻灯片
					swiperInstance.slideTo(index);
				});
			});
		}

		// 调用函数为每个 Swiper 实例添加点击事件
		addThumbnailClickEvents(swiper1, '#swiper1');
		addThumbnailClickEvents(swiper2, '#swiper2');
		addThumbnailClickEvents(swiper3, '#swiper3');
		addThumbnailClickEvents(swiper4, '#swiper4');

		
		// 在窗口大小调整时调用 updateSwiper 函数
		window.addEventListener('resize', function() {
		    updateSwiper(swiper1);
		    updateSwiper(swiper2);
		    updateSwiper(swiper3);
		});

		// 页面加载时也调用一次，以确保初始状态正确
		updateSwiper(swiper1);
		updateSwiper(swiper2);
		updateSwiper(swiper3);

		start();
	}

	updateSwiper(swiper1);




	var button = document.querySelector('.Time-out button');
	var cancel = document.querySelector('.Tcancel');
	cancel.addEventListener('click', function () {
		document.querySelector(".Time-out").classList.remove('pop');
	})
	// 为按钮添加点击事件监听器
	button.addEventListener('click', function () {
		event.preventDefault(); // 阻止默认行为
		// 刷新网页
		location.reload();
	});

	// Initialize options
	loadOptions();

	