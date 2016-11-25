//
//  Startup Code
//

System.Print("Homeworks QS Driver: Initializing...\r\n");

var g_comm = new TCP(OnCommRX);
g_comm.OnConnectFunc = OnTCPConnect;
g_comm.OnDisconnectFunc = OnTCPDisconnect;
g_comm.OnConnectFailedFunc = OnConnectFailed;

var reconnnect_timer = new Timer();
var sync_keypad_led = new ScheduledEvent(On_sync_keypad_led,"Periodic","Minutes",Config.Get('SyncLEDInterval'));
var reconnect_interval = 500;
var LOGGED_IN = 0;

var LutronIP = Config.Get('LutronIP');
var LutronPort = Config.Get('LutronPort');
var LutronUsername = Config.Get('LutronUsername');
var LutronPassword = Config.Get('LutronPassword');
var NumDevices = Config.Get('NumDevices');

var DEVICES_MAP = {};
var ACTIONS_MAP = {};
const DEBUG = false;

// build events map
build_devices_map_from_config();

// build actions map
build_actions_map();

// open connection
g_comm.Open(LutronIP,LutronPort);
sync_keypad_led.Enable();

//
// Internal Functions
//

function build_actions_map(){
	// see lutron integration protocol
	ACTIONS_MAP['1'] = 'enable';
	ACTIONS_MAP['2'] = 'disable';
	ACTIONS_MAP['3'] = 'press';
	ACTIONS_MAP['4'] = 'release';
	ACTIONS_MAP['5'] = 'hold';
	ACTIONS_MAP['6'] = 'multitap';
	ACTIONS_MAP['32'] = 'holdrelease';
}

function build_devices_map_from_config() {
	for(i=1;i <= NumDevices; i++) {
		DEVICES_MAP[Config.Get('Device'+i)] = 'Device'+i;
	}
}

function whitespace_trim(old_str) {
    return old_str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  }

function OnCommRX(data){
	if(DEBUG){
		System.Print('HOMEWORKS QS DRIVER - Recieved: '+data+'\r\n');
	}
	if(data.indexOf('login') != -1) {
		g_comm.Write(LutronUsername+'\r\n');
	} else if(data.indexOf('password')!= -1 ){
		g_comm.Write(LutronPassword+'\r\n');
	} else if(LOGGED_IN == 0 && data.indexOf('QNET') != -1 ) {
		LOGGED_IN = 1;
		g_comm.Write('#MONITORING,3,1\r\n');
	} else if(data.indexOf('~DEVICE,') != -1) {
		process_device_actions(data.substr(8+data.indexOf('~DEVICE,')));
	}
}

function process_device_actions(data){
	var data_split = data.split(',');
	var device_id = whitespace_trim(data_split[0]);
	var component_number = whitespace_trim(data_split[1]);
	var action_number = whitespace_trim(data_split[2]);
	var device_str = device_id+":"+component_number;

	if((device_str in DEVICES_MAP) && (action_number in ACTIONS_MAP)){
		var event_tag = DEVICES_MAP[device_str] + '_' + ACTIONS_MAP[action_number];
		System.SignalEvent(event_tag);
	}

	// see if LED we monitor changed
	var num_component_number = parseInt(component_number);
	if(num_component_number >= 80 && num_component_number <= 89 ){
		var button_number = num_component_number - 80;
		device_str = device_id+":"+button_number;
		if(device_str in DEVICES_MAP && action_number == '9'){
			var led_state = data_split[3];
			if(led_state == '0'){
				SystemVars.Write('LUTRON_LED_'+DEVICES_MAP[DeviceID],false);
			}
			if(led_state == '1'){
				SystemVars.Write('LUTRON_LED_'+DEVICES_MAP[DeviceID],true);
			}
		}
	}
}

function GetLEDStatus(DeviceID){
	var dev_split = DeviceID.split(':');
	var component_number = parseInt(dev_split[1]);
	component_number = component_number+80; // see lutron integrators guide
	g_comm.Write('\r\n');
	g_comm.Write('?DEVICE,'+dev_split[0]+','+component_number+',9'+'\r\n');
}

function On_reconnect_timer(){
	System.LogInfo(1,'HOMEWORKS QS DRIVER - Trying to reconnect\r\n');
	g_comm.Open(LutronIP,LutronPort);
}

function On_sync_keypad_led(){
	System.LogInfo(1,'HOMEWORKS QS DRIVER - Syncing LEDs\r\n');
	for(var dev_id in DEVICES_MAP){
		GetLEDStatus(dev_id);
	}
}

function OnTCPConnect() {
	g_comm.SetTxInterMsgDelay(200);
}

function OnTCPDisconnect() {
	System.LogInfo(1,"HOMEWORKS QS DRIVER - Disconnected From Lutron System\r\n");
	g_comm.Close();
	LOGGED_IN = 0;
	g_comm.Open(LutronIP,LutronPort);
}

function OnConnectFailed() {
	System.LogInfo(3,"HOMEWORKS QS DRIVER - Did Not Connect to Lutron System\r\n");
	g_comm.Close();
	LOGGED_IN = 0;
	reconnnect_timer.Start(On_reconnect_timer,reconnect_interval);
}

//
// External Functions
//

function SetLEDIntegration(DeviceID,LevelParameter){
	var dev_split = DeviceID.split(':');
	var component_number = parseInt(dev_split[1]);
	component_number = component_number+80; // see lutron integrators guide
	g_comm.Write('\r\n');
	g_comm.Write('#DEVICE,'+dev_split[0]+','+component_number+',9,'+LevelParameter+'\r\n');
}

function SetDeviceLEDStateTrue(DeviceID){
	SystemVars.Write( 'LUTRON_LED_'+DEVICES_MAP[DeviceID],true);
}

function SetDeviceLEDStateFalse(DeviceID){
	SystemVars.Write('LUTRON_LED_'+DEVICES_MAP[DeviceID],false);
}