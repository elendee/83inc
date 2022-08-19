/* 

hal 

hal is for alerts, taken from the 2001 space odyssey HAL. 

the duration is optional - leave empty for a permanent message ( user can still close with X )

example:
hal('success', 'the system is operational, captain', 5000 )
hal('error', 'the server encountered a fatal error, please refresh page' )

*/




const style = `
#alert-contain{
	position:fixed;
	z-index: 999999;
	bottom: 100px;
	right: 30px;
	text-align: right;
	width: 70%;
	pointer-events: none;
	padding-top: 10px;
}
.alert-wrap{
	transition: .5s;
}
.alert-msg{
	position: relative;
	background: rgba(0, 0, 0, .9);
	color: lightgrey;
	font-size: 13px;
	display: inline-block;
	margin: 1px 0;
	padding: 3px 40px 3px 20px;
    pointer-events: initial;
}
.alert-msg pre{
	max-height: 80vh;
    overflow-y: auto;
}
.alert-msg span{
	color: orange
}
.alert-icon, 
.alert-close{
	height: 100%;
	width: 30px;

	display: flex;
	justify-content: center;
	align-items: center;
}

.alert-icon{
	position: absolute;
	top: 0px;
	left: 0px;
	width: 12px;
}

.alert-close{
	position: absolute;
	right: 0px;
	top: 0px;
	pointer-events: initial;
	cursor: pointer;
	border-left: 1px solid grey;
	padding: 2px 5px 0px 5px;
	font-size: 1.5rem;
}
.alert-close:hover{
	background: rgba(250, 50, 55, .4);
}
.alert-icon{
	background: lightgrey;
}
.alert-icon.type-success{
	background: rgba(100, 245, 100, .7);
}
.alert-icon.type-error,
.alert-icon.type-warning{
	background: red;
}
.hal .alert-icon{
	background: rgb(255 235 0)
}
`


const alert_contain = document.createElement('div')
alert_contain.id = 'alert-contain'
document.body.appendChild( alert_contain )

const ele = document.createElement('style')
ele.innerHTML = style
document.head.appendChild( ele )



const hal = ( type, msg, time ) => {

	let icon = ''

	const alert_wrapper = document.createElement('div')
	const alert_msg = document.createElement('div')
	const close = document.createElement('div')

	if( !type ) type = 'standard'

	close.innerHTML = '&times;'
	close.classList.add('alert-close')

	icon = '<div></div>'

	alert_msg.innerHTML = `<div class='alert-icon type-${ type }'>${ icon }</div>${ msg }`
	alert_wrapper.classList.add('ui-fader')
	alert_msg.classList.add('alert-msg' ) // , 'hal-' + type
	alert_msg.appendChild( close )
	alert_wrapper.appendChild( alert_msg )

	alert_contain.appendChild( alert_wrapper )


	close.onclick = function(){
		alert_wrapper.style.opacity = 0
		setTimeout(function(){
			alert_wrapper.remove()
		}, 500)
	}

	if( time ){
		setTimeout(function(){
			alert_wrapper.style.opacity = 0
			setTimeout(function(){
				alert_wrapper.remove()
			}, 500)
		}, time)
	}
	
}




export default hal
