
for(i=1;i<100;i++) {
	console.log('<function name="%%Device'+i+'%% LED - On" export="SetLEDIntegration:Device'+i+'_On" repeatrate="0" condition="$NumDevices >= '+i+'" >')
	console.log('\t<parameter name="DeviceID" type="string" default="%%Device'+i+'%%" hidden="true" />')
	console.log('\t<parameter name="LevelParameter" type="string" default="1" hidden="true" />')
	console.log('</function>')
	console.log('<function name="%%Device'+i+'%% LED - Off" export="SetLEDIntegration:Device'+i+'_Off" repeatrate="0" condition="$NumDevices >= '+i+'" >')
	console.log('\t<parameter name="DeviceID" type="string" default="%%Device'+i+'%%" hidden="true" />')
	console.log('\t<parameter name="LevelParameter" type="string" default="0" hidden="true" />')
	console.log('</function>')
}