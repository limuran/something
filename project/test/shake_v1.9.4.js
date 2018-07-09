
var oFont = (oWidth*100/750) + '%';
$("html").css("font-size", oFont);

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext;
var context;
var audioSprite;
var audioData;
if (window.AudioContext) {//支持AudioContext的播放设置
	context = new window.AudioContext();
} else {//不支持AudioContext的使用audioSprite播放设置
	audioSprite = new Audio();
	audioSprite.src = cdn_url + '/elis_smp_als_dmz/static.cdn/draw/sound/shakeIt.mp3';
	audioSprite.preload  = 'auto';
	audioData = {
		shake : {
	        start: 0,
	        length: 0.75
	    },
	    win : {
	        start: 1,
	        length: 2
	    }
	}
}
var source = null;
var audioBuffer = null;
//加密的手机号
var cellNum = null;
var params = request.getParams();
var activityNo = params.activityNo;
var cv = params.cv;
var currentPrizeNum = null;
var receiveStauts = null;				//奖项类型
var options = [["没摇中","幸运女神下次会眷顾你~"],["差一点就摇到了","再接再厉吧~"],["手气欠佳","换个姿势再摇吧~"],["哎呀没中","可能摇得不够用力~"]];
var SHAKE_THRESHOLD = 1800;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;
var times = 0;
var isMultiActivity = false;//是否多流程活动
var isFinalStep = false;//是否多流程活动的最后一步
var iosAppv3_2cv = 120;//ios3.2版本cv号
var hasClickLotteryBtn = false;//是否已经点击抽奖按钮

$(function(){
	if ("wView" in window) {
	    window.wView.allowsInlineMediaPlayback = "YES";
	    window.wView.mediaPlaybackRequiresUserAction = "NO";
	}
	
	window.addEventListener('load', function() {
		FastClick.attach(document.body);
	}, false); //  ios点击事件加速
	
	$("img").each(function(index, item) {
		$(item).attr('src', cdn_url + $(item).attr('srcUrl'));
	});
	if(cv >= 62){
		var phone = sessionStorage.getItem("phone");
		if(typeof phone === "undefined" || phone == null) {
			Native.getUserPhoneForEncrypt('getPhoneCallback', getPhoneCallback);
		} else {
			getPhoneCallback(phone);
		}
	} else {
		showTip("您的APP未升级至最新版本，请升级APP后重新进入活动。");
		return;
	}
	
	$(".result-btn").on('click', function(){
		times = 0;
		$("#shakeSection").show();
		$("#congratulateSection").hide();
		$("#sorrySection").hide();
	});
	
	$(".check-btn").on("touchstart", function(){
		try{
			goPrize();
		} catch(e){
			showTip("请从我的活动-我的奖品进入查看！");return;
		}
	});
	
	$("#nextStep").on("click", function(){
		finishCurrStep();
	});
});

function initAction() {
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		showTip('抱歉，你的手机不支持摇一摇抽奖哦!');
	}
	$(".shake-btn1").on('click', function(){
		hasClickLotteryBtn = true;
		lottery();
		times++;
	});
}

function getPhoneCallback(data){
	cellNum = data;
	sessionStorage.setItem("phone", data);
	initAwards();
	if(context) {
		loadAudioFile(cdn_url + '/elis_smp_als_dmz/static.cdn/draw/sound/shakeIt.mp3', function(){
			initAction();
		});
	} else {
		initAction();
	}
}

function initAwards(){
	$.get("/elis_smp_als_dmz/do/elis.pa18.app.getLotteryInfo.visit",{
		activityNo: activityNo,
		CELL_NUM: cellNum,
		channelType: "02",
		jsonFlag: "Y",
		lotteryType : 'SHAKE'
	},function(data){
		if(data.CODE != "000"){
			showTip(data.MSG,function(){
				if(data.isMultiActivity && data.showNext) {
					showNextStep(data.isFinalStep);
				}
			});
			return;
		}
		currentPrizeNum = data.prizeNum;
		isMultiActivity = data.isMultiActivity;
		if(data.isFinalStep) {
			isFinalStep = data.isFinalStep;
		}
		//标题
		$("h3 label").text(data.title);
		//抽奖次数
		$("h3 span strong").text(data.prizeNum);
		
		if(isMultiActivity && data.prizeNum == 0) {
			showNextStep(isFinalStep);
		}
		
	});
}

function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime - last_update) > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        var status = document.getElementById("status");

        if (speed > SHAKE_THRESHOLD) {
            lottery();
			times++;
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}
    
function playSound(time, start, end) {
	if(audioBuffer == null) {
		return;
	}
    source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start(time, start, end);
}

function initSound(arrayBuffer) {
    context.decodeAudioData(arrayBuffer, function(buffer) { //解码成功时的回调函数
        audioBuffer = buffer;
    }, function(e) { //解码出错时的回调函数
        console.log('Error decoding file', e);
    });
}

function loadAudioFile(url, callback) {
    var xhr = new XMLHttpRequest(); //通过XHR下载音频文件
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) { //下载完成
        initSound(this.response);
        if(typeof callback == 'function') {
        	callback();
        }
    };
    xhr.onerror = function(e) {
    	console.log('获取' + url + '失败!', e);
    	if(typeof callback == 'function') {
        	callback();
        }
    };
    xhr.send();
}

//抽奖事件
function lottery(){
	if(times > 0){
		return false;
	}
	
	if(currentPrizeNum == "0"){
		shotPlay(function() {
			showTip("没有摇一摇机会咯！", function(){
				if(isMultiActivity) {
					showNextStep(isFinalStep);
				}
			});
		});
		return;
	}
	
	var shouldPlaySound = !isIOS() || (cv >= iosAppv3_2cv && isIOS()) || (hasClickLotteryBtn && cv < iosAppv3_2cv && isIOS());
	if(shouldPlaySound) {
		try{
			if(context) {
				playSound(0, 0, 1);
			} else {
				audioPlay(0);
			}
		}catch(e) {
		}
	}
	$("#shakeHand").attr('class', 'shake-hand');
	$(".light").addClass('spangle');
	
	$.get("/elis_smp_als_dmz/do/elis.pa18.app.lottery4All.visit",{
		activityNo: activityNo,
		tokenId: cellNum,
		channelType: "02",
		jsonFlag: "Y",
		lotteryType : 'SHAKE'
	},function(data){
		if(data.CODE != "000"){
			shotPlay(function() {
				showTip(data.MSG,function(){
					if(isMultiActivity && data.showNext) {
						showNextStep(isFinalStep);
					}
				});
			});
			return;
		}
		
		if(data.isFIFG && data.alreadyHasPrize) {
			shotPlay(function(){
				showTip("您已经得过奖啦，奖品君还要福利更多人呢~");
			});
			return;
		}
		
		if(data.isFIFG && data.IS_PRIZE == "N") {
			shotPlay(function(){
				showTip("活动太过火爆，完全超出了预估。今日奖品竟然都摇完了，小的赶紧补充库存，明天早点来吧~");
			});
			return;
		}
		
		if(shouldPlaySound) {
			try{
				if(context) {
					setTimeout(function() {
						playSound(0, 0, 1);
					}, 1500);
				} else {
					audioPlay(1500);
				}
			}catch(e) {
			}
		}
		setTimeout(function() {
			$("#shakeHand").removeAttr('class');
			$(".light").removeClass('spangle');
		}, 2500);
		
		receiveStauts = data.receiveStauts;
		setTimeout(function(){
			
			//剩余抽奖次数
			currentPrizeNum = data.currentPrizeNum;
			$("h3 span strong").text(data.currentPrizeNum);
			if(isMultiActivity && data.currentPrizeNum == 0) {
				showNextStep(isFinalStep);
			}
			
			setTimeout(function(){
				if(data.IS_PRIZE==="Y"){
					$("#shakeSection").hide();
					$("#sorrySection").hide();
					$("#congratulateSection").show();
					if(data.currentPrizeNum != 0) {
						$("#congratulateSection div[class=result-txt] p").text('').append("亲，您还有<strong>"+data.currentPrizeNum+"</strong>次摇一摇机会~");
						$("#congratulateSection div[class=result-txt] a[class=result-btn]").text('继续摇一摇');
					} else {
						$("#congratulateSection div[class=result-txt] p").text('亲，你的机会用完啦~');
						$("#congratulateSection div[class=result-txt] a[class=result-btn]").text('返回');
					}
					$("#congratulateSection div[class=result] p").text('恭喜你您获得' + data.PRIZE_NAME);
				} else {
					$("#congratulateSection").hide();
					$("#shakeSection").hide();
					$("#sorrySection").show();
					var num = Math.round(Math.random()*3);
					$("#sorrySection div[class=result] p").text(options[num][0] + ", " + options[num][1])
					if(data.currentPrizeNum != 0) {
						$("#sorrySection div[class=result-txt] p").text('').append("亲，您还有<strong>"+data.currentPrizeNum+"</strong>次摇一摇机会~");
						$("#sorrySection div[class=result-txt] a[class=result-btn]").text('继续摇一摇');
					} else {
						$("#sorrySection div[class=result-txt] p").text('亲，你的机会用完啦~');
						$("#sorrySection div[class=result-txt] a[class=result-btn]").text('返回');
					}
				}
				if(shouldPlaySound) {
					try{
						if(context) {
							playSound(0, 1, 2);
						} else {
							autoPlayed();
						}
					}catch(e){}
				}
			},500);
			
	    }, 2500);
	});
}

function shotPlay(fn) {
	$("#shakeHand").attr('class', 'shake-hand');
	$(".light").addClass('spangle');
	setTimeout(function(){
		times = 0;
		$("#shakeHand").removeAttr('class');
		$(".light").removeClass('spangle');
		if(typeof fn == 'function') {
			fn();
		}
	}, 700);
	
}

function showTip(msg, fn) {
	var millionSecond = 1500;
	var length = msg.length;
	if(length > 10 && length <= 30) {
		millionSecond = 2500;
	} else if(length > 30) {
		millionSecond = 4000;
	}
	$(".alert-box p").text(msg);
	$(".alert-box").fadeToggle();
	$(".alert-box").fadeToggle(millionSecond);
	
	if(typeof fn == 'function') {
		fn();
	}
}

//播放控制
function autoPlay(){
	audioSprite.addEventListener('timeupdate', shakeHandler, false);
	audioSprite.currentTime = audioData.shake.start;
	audioSprite.play();
	setTimeout(function () {
		audioSprite.currentTime = audioData.shake.start;
		audioSprite.play();
	}, 1500);
}

function audioPlay(time) {
	audioSprite.addEventListener('timeupdate', shakeHandler, false);
	setTimeout(function () {
		audioSprite.currentTime = audioData.shake.start;
		audioSprite.play();
	}, time);
}

function autoPlayed(){
	audioSprite.removeEventListener("timeupdate", shakeHandler, false);
	audioSprite.addEventListener('timeupdate', resultHandler, false);
	audioSprite.currentTime = audioData.win.start;
	audioSprite.play();
 }

var shakeHandler = function () {
	if (this.currentTime >= audioData.shake.start + audioData.shake.length) {
		audioSprite.pause();
	}
}

var resultHandler = function () {
	if (this.currentTime >= audioData.win.start + audioData.win.length) {
		audioSprite.pause();
	}
}

function goPrize(){
	var type = receiveStauts == "N" ? 0 : 1;
	Native.gotoPrizeList(type);
}

//多流程活动结束当前的活动并跳转至下一环节
function finishCurrStep() {
	$.get("/elis_smp_als_dmz/do/elis.pa18.app.lottery.getNextStep.visit",{
		activityNo: activityNo,
		clientphone: cellNum
	},function(data){
		var url = data.nextStepUrl;
		if(data.CODE == '000') {
			if(typeof url !== "undefined" || url != null) {
				if(url.indexOf('?') >= 0) {
					url += "&cv=62";
				}
				
				if(data.type == '04' && !isIOS()) {//锚点打开方式
					Native.executeUri(url);
				} else {
					window.location.href = url;
				}
			} else {
				Native.cancel();
			}
		}
	});
}

function showNextStep(isFinalStep) {
	if(isFinalStep) {
		$("#nextStep").text("返回活动详情");
	} else {
		$("#nextStep").text("下一步");
	}
	$("#nextStep").show();
}
