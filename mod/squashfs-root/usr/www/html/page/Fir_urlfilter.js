/*  ڴJavaScript  */
/*URL Filter*/
var G_URLFilterEnabled = "<?get :InternetGatewayDevice.X_TWSZ-COM_URL_Filter.Enable?>";
var G_URLFilterMode    = "<?get :InternetGatewayDevice.X_TWSZ-COM_URL_Filter.FilterMode?>";
var G_URLBlackList = [];
var G_BlackListNum = 0;
var option='';
var editIdx=0;

<?objget :InternetGatewayDevice.X_TWSZ-COM_URL_Filter.BlackList. "URL ScheduleMode SchedulePath EnableAllDays Days EnableAllTimes StartTime EndTime"
`	G_URLBlackList[G_BlackListNum] = [];
	G_URLBlackList[G_BlackListNum][0] = "InternetGatewayDevice.X_TWSZ-COM_URL_Filter.BlackList.$00.";  				//index
	G_URLBlackList[G_BlackListNum][1] = "$01";		//URL
	G_URLBlackList[G_BlackListNum][2] = "$02";		//ScheduleMode	
	G_URLBlackList[G_BlackListNum][3] = "$03";		//SchedulePath
	G_URLBlackList[G_BlackListNum][4] = "$04";		//EnableAllDays
	G_URLBlackList[G_BlackListNum][5] = "$05";		//Days
	G_URLBlackList[G_BlackListNum][6] = "$06";		//EnableAllTimes
	G_URLBlackList[G_BlackListNum][7] = "$07";		//StartTime
	G_URLBlackList[G_BlackListNum][8] = "$08";		//EndTime
	G_BlackListNum++;
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







function searchPath(Path){

	if(Path == 'Always')
		return 'Always';
	if(Path == 'Never')
		return 'Never';
	for(var i = 0; i < G_SchedEntry.length; i++){
		if(G_SchedEntry[i][0] == Path){
			return G_SchedEntry[i][1];
		}
	}
}


function createTable()
{	
	var array_URLAddrs = [];
	
	for(var i = 0; i < G_URLBlackList.length; i++)
	{
		array_URLAddrs[i] = [];
		array_URLAddrs[i].push(i+1); 
		array_URLAddrs[i].push(G_URLBlackList[i][1].ellipsis(40));	//URL
		if(G_URLBlackList[i][2]=='Select')
			array_URLAddrs[i].push(searchPath(G_URLBlackList[i][3]));		//Schedule
		else
		{
			var shed_list=0;
			shed_list=G_URLBlackList[i][5]+' time '+G_URLBlackList[i][7]+' '+G_URLBlackList[i][8];
			array_URLAddrs[i].push(shed_list);	
		}	
		array_URLAddrs[i].push('<img src="/html/skin/pen.gif" style="cursor:pointer;" title="Edit" onclick="doEditEntry('+ i +')"/>'); //Edit
		array_URLAddrs[i].push('<img src="/html/skin/cross.gif" style="cursor:pointer;" title="Delete" onclick="doRemoveEntry('+ i +')"/>'); //Delete
	}
	$T('TA_UrlList',array_URLAddrs);	

	for(var b = 0; b < G_URLBlackList.length; b++)
	{
		$('TA_UrlList_' + b + '1').title = G_URLBlackList[b][1];
	}
}

function uiOnload()
{
	Table.Clear('TA_UrlList');
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
	$('URL009').disabled=false;
	$S('SEL_schedule',Sched_text,Sched_value);
}
/*add a url filter entry*/
function uiAddEntry()
{
	option = 'add';
	editIdx = -1;
    	$('URL009').disabled=true;
	$('DIV_AddEntry').style.display='';
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

/*edit a urlfilter entry*/
function doEditEntry(Idx)
{
	option = 'edit';
	editIdx = Idx;
    	$('URL009').disabled=true;
	$('DIV_AddEntry').style.display='';
	$('TE_url').value = G_URLBlackList[Idx][1]; //url
	//schedule
	Form.Radio('RAD_schedule', G_URLBlackList[Idx][2]); 	
	
	if( G_URLBlackList[Idx][2]=='Select')
	{
		disCtrl('TA_ManualSche', false);
		$('SEL_schedule').disabled=false;
		$('SEL_schedule').value = G_URLBlackList[Idx][3];
	}
	else
	{
		disCtrl('TA_ManualSche', true);
		$('SEL_schedule').disabled=true;
		
		var SunEnable = MonEnable = TueEnable = WedEnable = ThuEnable = FriEnable = SatEnable = 0;
		var starttime= G_URLBlackList[Idx][7];
		var num=starttime.indexOf(':');
		var starttimeh=starttime.substring(0,num);
		var starttimem=starttime.substring(num+1,starttime.length+1);
		
		var endtime= G_URLBlackList[Idx][8];
		var num=endtime.indexOf(':');
		var endtimeh=endtime.substring(0,num);
		var endtimem=endtime.substring(num+1,endtime.length+1);
		
		
		var day=G_URLBlackList[Idx][5];
		
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
			 
		Form.Radio('RAD_SelectDay', G_URLBlackList[Idx][4]);
		
		setJSONValue({	
			'CHE_sunday'        : SunEnable,
			'CHE_monday'        : MonEnable,
			'CHE_tuesday'       : TueEnable,
			'CHE_wednesday'     : WedEnable,
			'CHE_thursday'      : ThuEnable,
			'CHE_friday'        : FriEnable,
			'CHE_saturday'      : SatEnable,
			'CHE_wholeday' 		: G_URLBlackList[Idx][6],
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
	if(!confirm(SEcode[1001]))
		return false;
			
	$H({
		'del-obj'		: G_URLBlackList[Idx][0],
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
		 
	var ScheduleMode=Form.Radio('RAD_schedule');
	
	if(option=='add')
    {
		$H({
			'add-obj' 	 		: 'InternetGatewayDevice.X_TWSZ-COM_URL_Filter.BlackList.',
			':URL'       		: $('TE_url').value,
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
	   //	'var:CacheLastData' : ViewState.Save()
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
        
		var path=':' + G_URLBlackList[editIdx][0];
		
		$F(path+'URL',$('TE_url').value);
		
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



