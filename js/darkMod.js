const changeItem = document.getElementById('change_item');
	const themeIcon = changeItem.querySelector('i');
	var flag = false;

	// 检查本地存储中的主题设置
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'dark') {
		flag = true;
		document.body.classList.add('dark-mode');
		themeIcon.classList.replace('fa-moon', 'fa-sun');
	}

	changeItem.addEventListener('click', () => {

		$('#changeItemVoice')[0].play();
		document.body.classList.toggle('dark-mode');
		flag = !flag;
		changeImagedark()
	});


	function changeImagedark() {
		// 获取所有类名为 'voice_img' 的 img 元素
		var images = document.querySelectorAll('.voice_img');

		// 遍历这些 img 元素
		images.forEach(image => {
			// 检查每个 img 的 src 是否以 './icon/voice.png' 结尾
			if (image.src.endsWith('/voice.png') && flag) {
				// 替换 src 为 './icon/voice_dark.png'
				image.src = image.src.replace('/voice.png', '/voice_dark.png');
			}
			if (image.src.endsWith('/voice_dark.png') && !flag) {
				image.src = image.src.replace('/voice_dark.png', '/voice.png');
			}
		});

		images = document.querySelectorAll('#FeatureArea .Featureitem img');
		// 遍历这些 img 元素
		console.log('yes');
		images.forEach(image => {

			if (flag) {
				// 替换 src 为暗色模式的图片
				image.src = image.src.replace('.png', '_dark.png'); // 假设暗色图标的命名规则是在原图标名称后加 '_dark'
			} else {
				// 替换 src 为浅色模式的图片
				image.src = image.src.replace('_dark.png', '.png');
			}
		});
	}
