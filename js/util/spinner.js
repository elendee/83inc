/* 

spinner

spinner is typically a gif used to block user input during an async fetch, wait, etc
if called with a particular target element, it will appear inside it 
( assuming it has a 'position' css declared )
otherwise it will fill the screen
you must call "new Spinner()" to build it - provide an img or a gif src for it.

example:

const mySpinner = new Spinner({
	src: './path/to/my/spinner-image.gif',
})

mySpinner.show( document.querySelector('#submit-form') )
// ....
mySpinner.hide()

*/


const style = `
.spinner{
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9;
	transition: .3s;
	background: rgba(0, 0, 0, .2);

    display: none;

}
.spinner>img{
	max-width: 90% !important;
}`

const ele = document.createElement('style')
ele.innerHTML = style
document.head.appendChild( ele )




let spinning = false

class Spinner{

	constructor( init ){
		init = init || {}
		this.ele = init.ele || document.createElement('div')
		this.ele.classList.add('spinner')
		this.img = init.img || document.createElement('img')
		this.img.src = this.img.src || init.src
		this.ele.appendChild( this.img )

		document.body.appendChild( this.ele )
	}

	show( ele ){
		if( ele ){
			if( getComputedStyle( ele ).position === 'static' ) ele.style.position = 'relative'
			this.ele.style.position = 'absolute'
			ele.prepend( this.ele )
		}else{
			this.ele.style.position = 'fixed'
			document.body.prepend( this.ele )
		}
		this.ele.style.display = 'flex'
		if( spinning ){
			clearTimeout(spinning)
			spinning = false
		}
		spinning = setTimeout(()=>{
			clearTimeout(spinning)
			spinning = false
		}, 10 * 1000)
	}

	hide(){
		this.ele.remove()
	}

}




export default Spinner