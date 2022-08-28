import hal from './util/hal.js?v=2'
import BROKER from './util/EventBroker.js?v=2'



const gui = document.getElementById('gui')
const nav = document.getElementById('gui-nav')
const content = document.getElementById('gui-content')

const section_types = [
	'library',
	'upload',
	'save',
	'export',
]

const library_data = [
	'chocotaco.png',
	'df.png',
]

const SECTIONS = {}


class GUI_Section {

	constructor( init ){
		init = init || {}
		this.type = init.type || '(missing type)'
		this.tab = build_button( this.type )
		this.tab.addEventListener('click', e => {
			for( const type in SECTIONS ){
				SECTIONS[ type ].ele.classList.add('hidden')
				SECTIONS[ type ].tab.classList.remove('selected')
			}
			this.ele.classList.remove('hidden')
			this.tab.classList.add('selected')
		})
		this.ele = document.createElement('div')
		this.ele.classList.add('section', 'hidden')
		SECTIONS[ this.type ] = this

		this.init_section( this.type )

	}

	init_section( type ){

		switch( type ){

			case 'library':
				for( const ele of library_data ){
					const drop = build_drop_img( ele )
					this.ele.append( drop )
				}
				break;

			default: 
				break;
		}

	}

}


class ActionBar {

	constructor( init ){

		this.wrapper = document.getElementById('action-bar')

		this.actions = { // true === show for all
			copy: {
				allowed: true,
			},
			delete: {
				allowed: true,
			},
			fill: {
				allowed: ['rect', 'circle', 'path', 'text'],
			},
			data: {
				allowed: true,
			}
		}

		let action
		for( const type in this.actions ){
			// build DOM element / button
			action = this.actions[ type ]
			action.ele = document.createElement('div')
			action.ele.setAttribute('data-type', type )
			action.ele.innerText = type
			action.ele.classList.add('button')
			this.wrapper.append( action.ele )
			// assign action (publish event to CANVAS)
			action.action = () => {
				BROKER.publish('GUI_ACTION', {
					type: type,
				})
			}
			action.ele.addEventListener('click', action.action )
		}

	}


	show(){
		this.wrapper.style.display = 'inline-block'
	}
	
	hide(){
		this.wrapper.style.display = 'none'
	}

}

const AB = new ActionBar()








// lib

const add_image = e => {
	const img = e.target.nodeName.match(/img/i) ? e.target : e.target.parentElement
	const image = new fabric.Image( img, {
		// width: 200,
		// height: auto
	})
	image.scaleToWidth(200)
	BROKER.publish('CANVAS_ADD_OBJECT', {
		type: 'image',
		object: image,
		top: 100,
		left: 100,
	})

}

const build_drop_img = url => {
	const drop = document.createElement('div')
	drop.classList.add('drop')
	const img = document.createElement('img')
	img.src = './library/' + url
	drop.addEventListener('click', add_image )
	drop.append( img )
	return drop
}
const build_button = type => {
	const wrapper = document.createElement('div')
	wrapper.classList.add('button')
	wrapper.innerText = type
	return wrapper
}





// init
for( const type of section_types ){
	const btn = new GUI_Section({
		type: type,
	})
	nav.append( btn.tab )
	content.append( btn.ele )
}

nav.querySelector('.button').click()





// event subscribers
const update_gui = event => {
	const { canvas } = event
	const active = canvas.getActiveObject()
	if( active ){
		AB.show()
	}else{
		AB.hide()
	}
}












BROKER.subscribe('GUI_UPDATE', update_gui )





export default {}