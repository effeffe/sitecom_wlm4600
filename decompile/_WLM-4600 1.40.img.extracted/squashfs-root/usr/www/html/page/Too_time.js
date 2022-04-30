/*  JavaScript Document */

function getInfo(){
/*  JavaScript Document */	
<?mget :InternetGatewayDevice.Time. "X_TWSZ-COM_Enable X_TWSZ-COM_Status X_TWSZ-COM_Type NTPServer1 CurrentLocalTime LocalTimeZone LocalTimeZoneName DaylightSavingsUsed X_TWSZ-COM_DateTime DaylightSavingsStart DaylightSavingsEnd"
`	G_Enable 		= "$01";
	G_Status 		= "$02";
	G_Type 			= "$03";
	G_NTPServer 		= "$04";
	G_CurrentLocalTime	= "$05";
	G_LocalTimeZone		= "$06";
	G_LocalTimeZoneName	= "$07";
	G_DaylightSavingsUsed 	= "$08";
	G_DateTime 		= "$09";
	G_DaylightStart        = "$0a";
	G_GaylightEnd          = "$0b";
`?>
}


//加载初始化
function uiOnload()
{
	getInfo();
	
//	$('timeShow').innerHTML = '<font color="#33CC66" >' + G_CurrentLocalTime  + '</font>'|| "N/A (Can't find NTP server)";
	//检查TimeZone值是否在范围内
	if (G_Status == 'Synchronized'){
		$('timeShow').innerHTML = '<font color="#33CC66" >' + G_CurrentLocalTime  + '</font>';
	}else{
		$('timeShow').innerHTML = '<font color="#ff0000" >' + G_CurrentLocalTime  + data_languages.Too_time.innerHTML.TIME004  + '</font>';
	}

	checkTimeZone();
	Form.Radio('RAD_Time', G_Type);
	var _date = G_DateTime.split('T')[0] || "0000-00-00";
	var _time = G_DateTime.split('T')[1] || "00:00:00";

	setJSONValue({
		'INPUT_NTPServer' 	: G_NTPServer,
		'SEL_TimeZone' 		: G_LocalTimeZone,
		'CHB_AutoEnable' 	: G_DaylightSavingsUsed,
		'INPUT_Year' 		: _date.split('-')[0],
		'INPUT_Month' 		: _date.split('-')[1],
		'INPUT_Date' 		: _date.split('-')[2],
		'INPUT_Hour' 		: _time.split(':')[0],
		'INPUT_Min' 		: _time.split(':')[1],
		'INPUT_Sec' 		: _time.split(':')[2]
	});

    setdlTime($('INPUT_dlsYear','INPUT_dlsMonth','INPUT_dlsDay', 'INPUT_dlsHour', 'INPUT_dlsMinute'), G_DaylightStart);
    setdlTime($('INPUT_dleYear','INPUT_dleMonth','INPUT_dleDay', 'INPUT_dleHour', 'INPUT_dleMinute'), G_GaylightEnd);

	onClkSynchron();
	uiclkDaylight();
	
	setTimeout('uiRefreshDate()',1000);
}

//
function onClkSynchron(xValue){
	//onload 初始化
	if(xValue == undefined){
		xValue = Form.Radio('RAD_Time');
	}
	var _ntp = _manual = "none";
	
	switch(xValue){
		case "NtpServer" :
			_ntp = "";
			if (G_Status == 'Synchronized'){
				$('timeShow').innerHTML = '<font color="#33CC66" >' + G_CurrentLocalTime  + '</font>';
			}else{
				$('timeShow').innerHTML = '<font color="#ff0000" >' + G_CurrentLocalTime  + data_languages.Too_time.innerHTML.TIME004  + '</font>';
			}
			break;
		case "PCClock" :
			//$('timeShow').innerHTML = '<font color="#33CC66" >' + Date() + '</font>'; 
			$('timeShow').innerHTML = '<font color="#33CC66" >' + G_CurrentLocalTime  + '</font>';
			break;
		case "Manually" :
			$('timeShow').innerHTML = '<font color="#33CC66" >' + G_CurrentLocalTime  + '</font>';
			_manual = "";
			break;
		default :
			alert(SEcode[9003]);
			return false;
	}
	
	$('tb_ntpserver').style.display = _ntp;
	$('tb_manualtime').style.display = _manual;
}

function checkTimeZone(){
	var TimeZone = $('SEL_TimeZone').options;
	
	for(var i = 0; i < TimeZone.length; i++){
		if(G_LocalTimeZone == '' || TimeZone[i].value == G_LocalTimeZone){
			return;
		}
	}
	//对'+'与'-'的符号进行交换处理
	TimeZone[26] = new Option('(GMT' + (G_LocalTimeZone.indexOf('-') > -1 ? G_LocalTimeZone.replace(/\-/,'+') : G_LocalTimeZone.replace(/\+/,'-')) + ')');
	TimeZone[26].value = G_LocalTimeZone;
}

function searchTimeZoneName(){
	//TimeZoneName和TimeZone的对应关系图
	var timeZoneNameMap = {
		'-12:00':'IDLW',
		'-11:00':'UTC',
		'-10:00':'HST',
		'-09:00':'AKST',
		'-08:00':'PST',
		'-07:00':'MST',
		'-06:00':'CST',
		'-05:00':'EST',
		'-04:00':'AST',
		'-03:00':'BRT',
		'-02:00':'FNT',
		'-01:00':'WAT',
		'+00:00':'GMT',
		'+01:00':'MET',
		'+02:00':'EET',
		'+03:00':'EAT',
		'+04:00':'MUT',
		'+05:00':'TFT',
		'+05:30':'IST',
		'+06:00':'ALMT',
		'+07:00':'WAST',
		'+08:00':'CCT',
		'+09:00':'JST',
		'+10:00':'AEST',
		'+11:00':'AESST',
		'+12:00':'NZT'
	};
	for(var i in timeZoneNameMap){
		if(i == arguments[0]){
			return timeZoneNameMap[i];
		}
	}
	return G_LocalTimeZoneName;
}

//重组时间
function cbnationTime(){
	var _dateTime, 
	_Month = $('INPUT_Month').value || '00',
	_Date = $('INPUT_Date').value || '00',
	_Year = $('INPUT_Year').value || '0000',
	_Hour = $('INPUT_Hour').value || '00',
	_Min = $('INPUT_Min').value || '00',
	_Sec = $('INPUT_Sec').value || '00';
	_dateTime = _Year +'-'+ _Month +'-'+ _Date +'T'+ _Hour +':'+ _Min +':'+ _Sec;
	//alert(_dateTime);
	return _dateTime;
}

function setdlTime( eleArray, time ){

    if ( typeof(time) != undefined && typeof(time) == 'string'){
        var mdy = time.split('T')[0];
        var hm = time.split('T')[1];

        eleArray[0].value = mdy.split('-')[0]   || '0000'; //year
        eleArray[1].value = mdy.split('-')[1]   || '00'; //month
        eleArray[2].value = mdy.split('-')[2]   || '00'; //date
        eleArray[3].value = hm.split(':')[0]    || '00';  //hour
        eleArray[4].value = hm.split(':')[1]    || '00';  //minute

    }else{
        var _Year   = eleArray[0].value;
        var _Month  = eleArray[1].value;
        var _Date   = eleArray[2].value;
        var _Hour   = eleArray[3].value;
        var _Min    = eleArray[4].value;
        return( _Year +'-'+ _Month +'-'+ _Date +'T'+ _Hour +':'+ _Min +':00' );
    }

}

function uiclkDaylight(){
	if(Form.Checkbox('CHB_AutoEnable') == true){
		$('dlstart').style.display = "";
        $('dlend').style.display = "";
	}else{
		$('dlstart').style.display = "none";
        $('dlend').style.display = "none";
	}
}

//提交数据
function uiSubmit(){
	var _type = Form.Radio('RAD_Time');
	$H({
		':InternetGatewayDevice.Time.X_TWSZ-COM_Type' 		: _type,
		':InternetGatewayDevice.Time.X_TWSZ-COM_Enable' 	: _type == "NtpServer" ? "1" : "0",
		':InternetGatewayDevice.Time.NTPServer1' 		: _type == "NtpServer" ? $('INPUT_NTPServer').value : undefined,
		':InternetGatewayDevice.Time.LocalTimeZone' 		: _type == "NtpServer" ? Form.Select('SEL_TimeZone') : undefined,
		':InternetGatewayDevice.Time.LocalTimeZoneName' 	: _type == "NtpServer" ? searchTimeZoneName(Form.Select('SEL_TimeZone')) : undefined,
		':InternetGatewayDevice.Time.DaylightSavingsUsed' 	: _type == "NtpServer" ? Form.Checkbox('CHB_AutoEnable') : undefined,
        ':InternetGatewayDevice.Time.DaylightSavingsStart'    : _type == "NtpServer" ? setdlTime($('INPUT_dlsYear','INPUT_dlsMonth','INPUT_dlsDay', 'INPUT_dlsHour', 'INPUT_dlsMinute')) : undefined,
    
        ':InternetGatewayDevice.Time.DaylightSavingsEnd'      : _type == "NtpServer" ? setdlTime($('INPUT_dleYear','INPUT_dleMonth','INPUT_dleDay', 'INPUT_dleHour', 'INPUT_dleMinute')) : undefined,
		':InternetGatewayDevice.Time.X_TWSZ-COM_DateTime' 	: _type == "Manually" ? cbnationTime() : undefined,
		'obj-action' 		: 'set',
		'var:menu' 		: G_Menu,
		'var:page'  		: G_Page,
		'var:errorpage' 	: G_Page,
		'getpage' 		: 'html/index.html',
		'errorpage' 		: 'html/index.html',
		'var:CacheLastData' 	: ViewState.Save()
	}, true);
	
	if(_type == "PCClock"){
		var obj_date = new Date();
		var _TimezoneOffset = obj_date.getTimezoneOffset()/60;
		var _zone = reTurnZone(_TimezoneOffset);
		var _year = obj_date.getFullYear(),
		    _month= obj_date.getMonth() + 1,
		    _day  = obj_date.getDate(),
		    _hour = obj_date.getHours() < 10 ? "0"+obj_date.getHours() : obj_date.getHours(),
		    _minutes = obj_date.getMinutes() < 10 ? "0"+obj_date.getMinutes() : obj_date.getMinutes(),
		    _seconds  = obj_date.getSeconds() < 10 ? "0"+obj_date.getSeconds() : obj_date.getSeconds();
		    _datetime = _year +"-"+ _month +"-"+ _day +"T"+_hour+":"+_minutes+":"+_seconds;
		$F(':InternetGatewayDevice.Time.DaylightSavingsUsed', 	"0");
		$F(':InternetGatewayDevice.Time.LocalTimeZone', 	_zone);
		$F(':InternetGatewayDevice.Time.LocalTimeZoneName', 	searchTimeZoneName(_zone));
		$F(':InternetGatewayDevice.Time.X_TWSZ-COM_DateTime', 	_datetime);
	}
	
	$('uiPostForm').submit();
}

function reTurnZone(xValue){
	if(xValue == undefined){
		var xValue = -8;
	}
	if(xValue == 0){
		xValue = "+00:00";
	}else if(xValue > 0){
		if(xValue > 9)
			xValue = "-"+Math.abs(xValue)+":"+"00";
		else
			xValue = "-0"+Math.abs(xValue)+":"+"00";
	}else{
		if(xValue < -9)
			xValue = "+"+Math.abs(xValue)+":"+"00";
		else
			xValue = "+0"+Math.abs(xValue)+":"+"00";
	}
	
	return xValue;
}


function uiRefreshDate()
{
	getInfo();
	
	if (G_Status == 'Synchronized'){
		$('timeShow').innerHTML = '<font color="#33CC66" >' + G_CurrentLocalTime  + '</font>';
	}else{
		$('timeShow').innerHTML = '<font color="#ff0000" >' + G_CurrentLocalTime  + data_languages.Too_time.innerHTML.TIME004  + '</font>';
	}
	
	onClkSynchron();
}


//错误处理函数
function dealWithError(){
	if (G_Error != 1){ 
		return false;
	}
	var arrayHint = [];
	dealErrorMsg(arrayHint, G_Error_Msg);
}
//监听加载与错误处理函数
addListeners(uiOnload, dealWithError);