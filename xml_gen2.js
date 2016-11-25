    // <category name="Button Press Events">
    //     <function name="Button X" tag="ButtonXpress" />
    // </category>


for(i=1;i<100;i++) {
	console.log('<category name="Device %%Device'+i+'%%" condition="$NumDevices >= '+i+'">')
	console.log('   <event name="Enable" tag="Device'+i+'_enable" />')
	console.log('   <event name="Disable" tag="Device'+i+'_disable" />')
	console.log('   <event name="Press/Close/Occupied" tag="Device'+i+'_press" />')
	console.log('   <event name="Release/Open/Unoccupied" tag="Device'+i+'_release" />')
	console.log('   <event name="Hold" tag="Device'+i+'_hold" />')
	console.log('   <event name="Multi Tap" tag="Device'+i+'_multitap" />')
	console.log('   <event name="Hold/Release" tag="Device'+i+'_holdrelease" />')
	console.log('</category>')
}