[![NPM](https://nodei.co/npm/postcss-jingoal.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/postcss-jingoal/)

## 用途
自动解决 
* 渐变 
* 透明
* css背景透明
* css3值前缀
* css3属性前缀
* inline-block 兼容

## 设计由来
* 自己开发一套css后处理规则，可根据每个公司自己的兼容方案，灵活调整
* 一次性处理完所有的规则，如果引入第三方插件的话，需要多次循环遍历

## 示例代码
参考example里面的文件
```
/* 
演示兼容ie的解决方案
.main_content .layout_left .left_panel .ielte10{}
转化后
.ielte10 .main_content .layout_left .left_panel{}
*/
.main_content {
	.layout_left {
		.left_panel {
			.ielte10 {
				margin-top:12px;
			}
		}
	}
}
/* 
演示自动添加css3值前缀以及属性前缀
*/
.animate {
	display:flex;
	transition:all .2s ease-out;
}

/*
演示自动兼容inline-block代码
*/
.animate-inline-block {
	display:inline-block;
}

/*
演示兼容ie的透明度
*/

.animate-opacity{
	opacity:.5;
}

/*
演示兼容ie的背景透明度
*/
.animate-rgba{
	background:rgba(112,112,112,.5);
}


/*
演示兼容ie的 线性渐变
*/
.animate-rgba{
	background:linear-gradient(#fff, #000);
}
```