/*  ڴJavaScript  */
var array_MACAddrs = [];

var G_MacBlackList = [];
var G_BlackListNum = 0;
var array_MACAddrs ;
var G_ListNumber;
var option='';
var editIdx=-1;

var array_PassMACAddrs = [];
var G_MacWhiteList = [];
var G_WhiteListNum = 0;

var G_FilterMode = "<?get :InternetGatewayDevice.X_TWSZ-COM_MAC_Filter.FilterMode?>";

<?objget :InternetGatewayDevice.X_TWSZ-COM_MAC_Filter.BlackList. "MACAddress ScheduleMode SchedulePath EnableAllDays Days EnableAllTimes StartTime EndTime Description"
`	G_MacBlackList[G_BlackListNum] = [];
	G_MacBlackList[G_BlackListNum][0] = "InternetGatewayDevice.X_TWSZ-COM_MAC_Filter.BlackList.$00.";  				//index
	G_MacBlackList[G_BlackListNum][1] = "$01";		//MAC
	G_MacBlackList[G_BlackListNum][2] = "$02";		//ScheduleMode	
	G_MacBlackList[G_BlackListNum][3] = "$03";		//SchedulePath
	G_MacBlackList[G_BlackListNum][4] = "$04";		//EnableAllDays
	G_MacBlackList[G_BlackListNum][5] = "$05";		//Days
	G_MacBlackList[G_BlackListNum][6] = "$06";		//EnableAllTimes
	G_MacBlackList[G_BlackListNum][7] = "$07";		//StartTime
	G_MacBlackList[G_BlackListNum][8] = "$08";		//EndTime
	G_MacBlackList[G_BlackListNum][9] = "$09";		//UserName
	G_BlackListNum++;
`?>

<?objget :InternetGatewayDevice.X_TWSZ-COM_MAC_Filter.WhiteList. "MACAddress ScheduleMode SchedulePath EnableAllDays Days EnableAllTimes StartTime EndTime Description"
`	G_MacWhiteList[G_WhiteListNum] = [];
	G_MacWhiteList[G_WhiteListNum][0] = "InternetGatewayDevice.X_TWSZ-COM_MAC_Filter.WhiteList.$00.";  				//index
	G_MacWhiteList[G_WhiteListNum][1] = "$01";		//MAC
	G_MacWhiteList[G_WhiteListNum][2] = "$02";		//ScheduleMode	
	G_MacWhiteList[G_WhiteListNum][3] = "$03";		//SchedulePath
	G_MacWhiteList[G_WhiteListNum][4] = "$04";		//EnableAllDays
	G_MacWhiteList[G_WhiteListNum][5] = "$05";		//Days
	G_MacWhiteList[G_WhiteListNum][6] = "$06";		//EnableAllTimes
	G_MacWhiteList[G_WhiteListNum][7] = "$07";		//StartTime
	G_MacWhiteList[G_WhiteListNum][8] = "$08";		//EndTime
	G_MacWhiteList[G_WhiteListNum][9] = "$09";		//UserName
	G_WhiteListNum++;
`?>

var EntryNum=0;
var G_SchedEntry=[];
<?if lt 0 `<?get :InternetGatewayDevice.X_TWSZ-COM_SCHEDULES.SchedNumberOfEntries ?>`
`	<?objget :InternetGatewayDevice.X_TWSZ-COM_SCHEDULES.SchedEntry. "SchedName"
		`	G_SchedEntry[EntryNum] = [];
			G_SchedEntry[EntryNum][0] = "InternetGatewayDevice.X_TWSZ-COM_SCHEDULES.SchedEntry.$00.";    //path
			G_SchedEntry[EntryNum][1] = "$01";   	//ScheduleName
			++EntryNum;
	`?>
`?>

var LanHosts = [];               
var m = 0;
<?objget :InternetGatewayDevice.LANDevice. "Hosts.HostNumberOfEntries"
`	<?if gt $11 0
	`	<?objget :InternetGatewayDevice.LANDevice.$20.Hosts.Host. "IPAddress MACAddress"
		`	LanHosts[m] = [];
			LanHosts[m][0] = "$01";
			LanHosts[m][1] = "$02";
			++m;
		`?>
	`?>
`?>

var G_CurrentIP = "<?echo $var:sys_RemoteAddr ?>";
var G_CurrentMAC = GetMACByIP(G_CurrentIP);

/* Get Mac By IP */
function GetMACByIP(ip)
{
	for (var i=0; i<LanHosts.length; i++)
	{
		if (LanHosts[i][0] == ip)
		{
			return LanHosts[i][1];
		}
	}

	return "";
}

//将Path的路径转换为Schedule的Name
function searchPath(Path){
	if(Path =='Always')
		return 'Always';
	if(Path =='Never')
		return 'Never';
	for(var i = 0; i < G_SchedEntry.length; i++){
		if(G_SchedEntry[i][0] == Path){
			return G_SchedEntry[i][1];
		}
	}
}


/*select the macfilter mode*/
function onMacfilterMode()
{
	if($('RAD_black').checked)
	{
		$('DIV_black').style.display = '';
		$('DIV_white').style.display = 'none';
		G_FilterMode = 'Deny';
	}
	else
	{
		$('DIV_black').style.display = 'none';
		$('DIV_white').style.display = '';
		G_FilterMode = 'Allow';
	}
	
}

function createTable(){	
	var array_MACAddrs = [];
	for(var i = 0; i < G_MacBlackList.length; i++){
		array_MACAddrs[i] = [];
		array_MACAddrs[i].push(i+1); 
		array_MACAddrs[i].push(G_MacBlackList[i][9].ellipsis(8));		    //UserName
		array_MACAddrs[i].push(G_MacBlackList[i][1]);						//MACAddress
		if(G_MacBlackList[i][2]=='Select')
			array_MACAddrs[i].push(searchPath(G_MacBlackList[i][3]));		//Schedule
		else
        {
			var shed_list=0;                                                //manual schedule
			shed_list=G_MacBlackList[i][5]+' time '+G_MacBlackList[i][7]+' '+G_MacBlackList[i][8];
			array_MACAddrs[i].push(shed_list);	
		}	
		array_MACAddrs[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="doEditEntry('+ i +')"/>'); //Edit
		array_MACAddrs[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="doRemoveEntry('+ i +')"/>'); //Delete
	}
	$T('TA_BlackList',array_MACAddrs);	

	var array_PassMACAddrs = [];
	for(var i = 0; i < G_MacWhiteList.length; i++){
		array_PassMACAddrs[i] = [];
		array_PassMACAddrs[i].push(i+1); 
		array_PassMACAddrs[i].push(G_MacWhiteList[i][9].ellipsis(8));						//UserName
		array_PassMACAddrs[i].push(G_MacWhiteList[i][1]);						//MACAddress
		if(G_MacWhiteList[i][2]=='Select')
			array_PassMACAddrs[i].push(searchPath(G_MacWhiteList[i][3]));		//Schedule
		else{
			var shed_list=0;													//manual schedule
			shed_list=G_MacWhiteList[i][5]+' time '+G_MacWhiteList[i][7]+' '+G_MacWhiteList[i][8];
			array_PassMACAddrs[i].push(shed_list);	
		}	
		array_PassMACAddrs[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="doEditEntry('+ i +')"/>'); //Edit
		array_PassMACAddrs[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="doRemoveEntry('+ i +')"/>'); //Delete
	}
	
	$T('TA_WhiteList',array_PassMACAddrs);	
	
	for(var b = 0; b < G_MacBlackList.length; b++)
	{
		$('TA_BlackList_' + b + '1').title = G_MacBlackList[b][9];
	}

	for(var i = 0; i < G_MacWhiteList.length; i++)
	{
		$('TA_WhiteList_' + i + '1').title = G_MacWhiteList[i][9];
	}
}

function uiOnload(){
	
	Table.Clear('TA_BlackList');
	Table.Clear('TA_WhiteList');


	if(G_FilterMode  == "Deny")
	{
		$('RAD_black').checked = true;
		$('DIV_black').style.display = '';
		$('DIV_white').style.display = 'none';
	}
	else if(G_FilterMode == "Allow")
	{
		$('RAD_white').checked = true;
		$('DIV_black').style.display = 'none';
		$('DIV_white').style.display = '';
	}
	
	createTable();
	//Schedule list
	var Sched_text = [], Sched_value = [];
	Sched_text.push('Always');
	Sched_value.push('Always');

	for(var j = 0; j < G_SchedEntry.length; j++){
		//Schedule
		Sched_text.push(G_SchedEntry[j][1]);
		Sched_value.push(G_SchedEntry[j][0]);
	}
	Sched_text.push('Never');
	Sched_value.push('Never');
	$S('SEL_schedule',Sched_text,Sched_value);

	$('MAC028').disabled=false;
}

/*submit macfilter mode*/
function uiRadioSubmit()
{
	//当过滤跳转至WHITE_LIST  Apply时添加警示信息 --majiangying 2012/10/19
	if($("RAD_white").checked == true)      //if ( Form.Radio('RAD_mode') == 0 )
	{
		if (confirm(SEcode[3000]) == false)
		{
			return false;
		}
	}
	
	$H({
		'obj-action'        : 'set',
		'var:menu'			: G_Menu,
		'var:page'			: G_Page,
		'var:errorpage'		: G_Page,
		'getpage'    		: 'html/index.html',
		'errorpage'  		: 'html/index.html',
		'var:url_belong'	: '0',
		'var:CacheLastData' : ViewState.Save()
	},true);

	var path=':InternetGatewayDevice.X_TWSZ-COM_MAC_Filter.FilterMode';		
	$F(path,G_FilterMode);

    if ((G_FilterMode == 'Allow') && (G_MacWhiteList.length == 0))
    {
        alert(SEcode[9887]);
        return 0;
    }
        		
	$('uiPostForm').submit();

}

/*add a macfilter entry*/
function uiAddEntry(){
	
	option = 'add';
	editIdx = -1;
	$('RAD_black').disabled = true;
	$('RAD_white').disabled = true;
    	$('MAC028').disabled=true;
	$('DIV_AddEntry').style.display='';
	changeMACSelect('0');
	$('TE_PC_mac').disabled=true;
	$('TE_PC_mac').value=G_CurrentMAC;
	
	changeScheduleMode('1');
	
}

function changeScheduleMode(value)
{
	if(value == '1')	
	{
		disCtrl('TA_ManualSche', false);
		$('SEL_schedule').disabled=false;
	}
	else
	{
		disCtrl('TA_ManualSche', true);
		$('SEL_schedule').disabled=true;
	}
}

function changeMACSelect(value)
{
	if(value == '1')
	{
		$('TE_other_mac').disabled = true;
	}
	else
	{
		$('TE_other_mac').disabled = false;
	}
	
}

function changeDaysSelect(value)
{
	if(value == '1')
	{
		$('CHE_sunday').disabled = true;
		$('CHE_monday').disabled = true;
		$('CHE_tuesday').disabled = true;
		$('CHE_wednesday').disabled = true;
		$('CHE_thursday').disabled = true;
		$('CHE_friday').disabled = true;
		$('CHE_saturday').disabled = true;
		
		$('CHE_sunday').checked = true;
		$('CHE_monday').checked = true;
		$('CHE_tuesday').checked = true;
		$('CHE_wednesday').checked = true;
		$('CHE_thursday').checked = true;
		$('CHE_friday').checked = true;
		$('CHE_saturday').checked = true;
	}
	else
	{
		$('CHE_sunday').disabled = false;
		$('CHE_monday').disabled = false;
		$('CHE_tuesday').disabled = false;
		$('CHE_wednesday').disabled = false;
		$('CHE_thursday').disabled = false;
		$('CHE_friday').disabled = false;
		$('CHE_saturday').disabled = false;
		
		$('CHE_sunday').checked = false;
		$('CHE_monday').checked = false;
		$('CHE_tuesday').checked = false;
		$('CHE_wednesday').checked = false;
		$('CHE_thursday').checked = false;
		$('CHE_friday').checked = false;
		$('CHE_saturday').checked = false;
	}
}

function setWholeDay(){
	if($('CHE_wholeday').checked)
	{
		$('TE_StartTime_H').value="00";
		$('TE_StartTime_M').value="00";
		$('TE_EndTime_H').value="00";
		$('TE_EndTime_M').value="00";
		$('TE_StartTime_H').disabled=true;
		$('TE_StartTime_M').disabled=true;
		$('TE_EndTime_H').disabled=true;
		$('TE_EndTime_M').disabled=true;
	}
	else
	{
		$('TE_StartTime_H').value="";
		$('TE_StartTime_M').value="";
		$('TE_EndTime_H').value="";
		$('TE_EndTime_M').value="";
		$('TE_StartTime_H').disabled=false;
		$('TE_StartTime_M').disabled=false;
		$('TE_EndTime_H').disabled=false;
		$('TE_EndTime_M').disabled=false;
	}
	return true;	
}


/*edit a macfilter entry*/
function doEditEntry(Idx)
{
	var G_MacList = G_FilterMode == "Deny" ? G_MacBlackList : G_MacWhiteList;
	
	option = 'edit';
	editIdx = Idx;
	$('RAD_black').disabled = true;
	$('RAD_white').disabled = true;
    	$('MAC028').disabled=true;
	$('DIV_AddEntry').style.display='';
	$('TE_username').value = G_MacList[Idx][9]; //username
	//mac address
	if(LanHosts.length >0 )
	{
		if(G_MacList[Idx][1]==G_CurrentMAC)
		{
			$('TE_PC_mac').value=G_CurrentMAC;
			$('RAD_PC_mac').checked=true;
			$('TE_PC_mac').disabled=true;
			$('TE_other_mac').disabled=true;
			$('TE_other_mac').value='';
		}
		else
		{
			$('TE_PC_mac').value=G_CurrentMAC;
			$('TE_PC_mac').disabled=true;
			$('TE_other_mac').value=G_MacList[Idx][1];	
			$('RAD_other_mac').checked=true;
		}
	}else
	{
		$('TE_other_mac').value=G_MacList[Idx][1];	
	}
	//schedule
	Form.Radio('RAD_schedule', G_MacList[Idx][2]); 	
	
	if( G_MacList[Idx][2]=='Select')
	{
		disCtrl('TA_ManualSche', false);
		$('SEL_schedule').disabled=false;
		$('SEL_schedule').value = G_MacList[Idx][3];
	}
	else
	{
		disCtrl('TA_ManualSche', true);
		$('SEL_schedule').disabled=true;
		
		var SunEnable = MonEnable = TueEnable = WedEnable = ThuEnable = FriEnable = SatEnable = 0;
		var starttime= G_MacList[Idx][7];
		var num=starttime.indexOf(':');
		var starttimeh=starttime.substring(0,num);
		var starttimem=starttime.substring(num+1,starttime.length+1);
		
		var endtime= G_MacList[Idx][8];
		var num=endtime.indexOf(':');
		var endtimeh=endtime.substring(0,num);
		var endtimem=endtime.substring(num+1,endtime.length+1);
		
		
		var day=G_MacList[Idx][5];
		
		if(day.indexOf('Sun')!=-1)
			 SunEnable=1; //Sun
		
		if(day.indexOf('Mon')!=-1)
			 MonEnable=1; //Mon

		if(day.indexOf('Tue')!=-1)
			 TueEnable=1; //Tue

		if(day.indexOf('Wed')!=-1)
			 WedEnable=1; //Wed

		if(day.indexOf('Thu')!=-1)
			 ThuEnable=1; //Thu

		if(day.indexOf('Fri')!=-1)
			 FriEnable=1; //Fri

		if(day.indexOf('Sat')!=-1)
			 SatEnable=1; //Sat
			 
		Form.Radio('RAD_SelectDay', G_MacList[Idx][4]);
		
		setJSONValue({	
			'CHE_sunday'        : SunEnable,
			'CHE_monday'        : MonEnable,
			'CHE_tuesday'       : TueEnable,
			'CHE_wednesday'     : WedEnable,
			'CHE_thursday'      : ThuEnable,
			'CHE_friday'        : FriEnable,
			'CHE_saturday'      : SatEnable,
			'CHE_wholeday' 		: G_MacList[Idx][6],
			'TE_StartTime_H' 	: starttimeh,
			'TE_StartTime_M' 	: starttimem,
			'TE_EndTime_H'		: endtimeh,
			'TE_EndTime_M'		: endtimem
		});
		
		if($('RAD_AllWeek').checked)
		{
			$('CHE_sunday').disabled = true;
			$('CHE_monday').disabled = true;
			$('CHE_tuesday').disabled = true;
			$('CHE_wednesday').disabled = true;
			$('CHE_thursday').disabled = true;
			$('CHE_friday').disabled = true;
			$('CHE_saturday').disabled = true;
		}
		
		if($('CHE_wholeday').checked)
		{
			$('TE_StartTime_H').disabled=true;
			$('TE_StartTime_M').disabled=true;
			$('TE_EndTime_H').disabled=true;
			$('TE_EndTime_M').disabled=true;
		}
	}
}
/*remove a macfilter entry*/
function doRemoveEntry(Idx)
{
	var G_MacList = G_FilterMode == "Deny" ? G_MacBlackList : G_MacWhiteList;
	
	if(!confirm(SEcode[1001]))
		return false;
			
	$H({
		'del-obj'		: G_MacList[Idx][0],
		'obj-action'	: 'del',
		'var:menu'		: G_Menu,
		'var:page'		: G_Page,
		'var:errorpage'	: G_Page,
		'getpage'		: 'html/index.html',
		'errorpage'		: 'html/index.html'
	});
	$('uiPostForm').submit();
}

/*submit a macfilter entry*/
function uiSubmit()
{	
	var _nodes = $('TE_StartTime_H','TE_StartTime_M','TE_EndTime_H','TE_EndTime_M');

	if( (!isNaN(_nodes[1].value)) && 
		( _nodes[3].value.length  == 1 ) &&
		(Number(_nodes[1].value) >= 0) &&
		( Number(_nodes[1].value) <= 9)){
		_nodes[1].value = '0' + _nodes[1].value;
	}

	if( (!isNaN(_nodes[3].value)) && 
		( _nodes[3].value.length == 1  ) &&
		(Number(_nodes[3].value) >= 0) &&
		( Number(_nodes[3].value) <= 9)){
		_nodes[3].value = '0' + _nodes[3].value;
	}

	var starttime=_nodes[0].value+':'+_nodes[1].value;
	var endtime=_nodes[2].value+':'+_nodes[3].value;
	var selectdays='';
	
	if(Form.Checkbox('CHE_sunday')=='1')
	     selectdays='Sun,';
	if(Form.Checkbox('CHE_monday')=='1')
	     selectdays+='Mon,';
	if(Form.Checkbox('CHE_tuesday')=='1')
	     selectdays+='Tue,';
	if(Form.Checkbox('CHE_wednesday')=='1')
	     selectdays+='Wed,';
	if(Form.Checkbox('CHE_thursday')=='1')
	     selectdays+='Thu,';
	if(Form.Checkbox('CHE_friday')=='1')
	     selectdays+='Fri,';
	if(Form.Checkbox('CHE_saturday')=='1')
	     selectdays+='Sat,';

	var MACAddress =0;

    if($('RAD_PC_mac').checked)
	{
	    MACAddress=$('TE_PC_mac').value;
	}
	else
	{
		MACAddress=$('TE_other_mac').value;
	}

	var ScheduleMode='';
	ScheduleMode=Form.Radio('RAD_schedule');
	
	if(option=='add')
    {
		$H({
			'add-obj' 	 		: G_FilterMode=='Deny'? 'InternetGatewayDevice.X_TWSZ-COM_MAC_Filter.BlackList.' : 'InternetGatewayDevice.X_TWSZ-COM_MAC_Filter.WhiteList.',
			':Description'      : $('TE_username').value,
			':MACAddress'       : MACAddress,
			':ScheduleMode' 	: ScheduleMode =='Select'?'Select':'Manual',
			':SchedulePath'		: ScheduleMode =='Select'? $('SEL_schedule').value : undefined,
			':EnableAllDays'   	: ScheduleMode=='Manual' ? Form.Radio('RAD_SelectDay')=='1'?1:0 :undefined ,
			':Days'      		: ScheduleMode=='Manual' ? selectdays : undefined,
			':EnableAllTimes'   : ScheduleMode=='Manual' ? Form.Checkbox('CHE_wholeday'): undefined,
			':StartTime' 		: ScheduleMode=='Manual' ? starttime : undefined,
			':EndTime'   		: ScheduleMode=='Manual' ? endtime : undefined,
			'obj-action' 		: 'add-set',
			'var:menu'			: G_Menu,
			'var:page'			: G_Page,
			'var:errorpage'		: G_Page,
			'getpage'    		: 'html/index.html',
			'errorpage'  		: 'html/index.html',
			'var:url_belong'	: '0'
			//'var:CacheLastData' : ViewState.Save()
		},true);
	}
    else if(option=='edit')
	{		
		$H({
			'obj-action'        : 'set',
			'var:menu'			: G_Menu,
			'var:page'			: G_Page,
			'var:errorpage'		: G_Page,
			'getpage'    		: 'html/index.html',
			'errorpage'  		: 'html/index.html',
			'var:url_belong'	: '0'
			//'var:CacheLastData' : ViewState.Save()
		},true);
        
		var pathTemp = G_FilterMode=='Deny' ? G_MacBlackList[editIdx][0] : G_MacWhiteList[editIdx][0];
		var path=':' + pathTemp;
		
		$F(path+'Description',$('TE_username').value);
		$F(path+'MACAddress',MACAddress);
		
		if(ScheduleMode == 'Select')
        {
			$F(path+'ScheduleMode','Select');
			$F(path+'SchedulePath',$('SEL_schedule').value);
		}
        else
        {
			$F(path+'ScheduleMode','Manual');
			$F(path+'EnableAllDays',Form.Radio('RAD_SelectDay')=='1'?1:0);
			$F(path+'Days',selectdays);
			$F(path+'EnableAllTimes',Form.Checkbox('CHE_wholeday'));
			$F(path+'StartTime',starttime);
			$F(path+'EndTime',endtime);
		}
	}
   
	$('uiPostForm').submit();
}

function dealWithError(){
         if (G_Error != 1){ return false; }
         var arrayHint = [];
         dealErrorMsg(arrayHint, G_Error_Msg);
}

addListeners(uiOnload, dealWithError);




