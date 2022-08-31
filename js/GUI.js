import hal from './util/hal.js?v=6'
import BROKER from './util/EventBroker.js?v=6'
import STATE from './STATE.js?v=6'








const gui = document.getElementById('gui')
const toggle = document.getElementById('gui-toggle')
const nav = document.getElementById('gui-nav')
const content = document.getElementById('gui-content')

const arrows = {
	up: '&uarr;',
	down: '&darr;'
}

const section_types = [
	'library',
	'upload',
	'save',
	'export',
	'keybinds',
]

const library_data = [
	'chocotaco.png',
]

const SECTIONS = {}


class GUI_Section {

	constructor( init ){
		init = init || {}
		this.type = init.type || '(missing type)'
		this.tab = build_button( this.type )

		if( this.type === 'upload' ){
			this.uploader = document.createElement('input')
			this.uploader.type = 'file'
			this.uploader.id = 'hidden-uploader'
			this.uploader.classList.add('hidden')
			this.uploader.addEventListener('change', e => {

				const file = this.uploader.files[0]

				const reader = new FileReader()
				reader.readAsDataURL( file )
				reader.onload = e => {
					const drop = build_drop_img()
					drop.querySelector('img').src = e.target.result
					SECTIONS.library.ele.append( drop )
					hal('success','img uploaded', 3000 )
				}
				reader.onerror =e => {
					console.log( e )
					hal('error', 'img load error', 5000 )
				}
				hal('standard', 'file chose... (in dev)', 3000 )
			})
			document.body.append( this.uploader )
		}

		this.tab.addEventListener('click', e => {

			if( this.type === 'upload'){

				this.uploader.click()

			}else{ // just sectional tabs; no actions
				for( const type in SECTIONS ){
					SECTIONS[ type ].ele.classList.add('hidden')
					SECTIONS[ type ].tab.classList.remove('selected')
				}
				this.ele.classList.remove('hidden')
				this.tab.classList.add('selected')
			}


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

			case 'upload':
				this.ele.append( 'upload...')
				break;

			case 'save':
				this.ele.innerText = '(save section)'
				break;

			case 'keybinds':
				for( const key in STATE.keybinds ){
					this.ele.append( build_key( key, STATE.keybinds[ key ] ) )
				}
				break;

			case 'export':
				this.ele.innerText = '(export section)'
				break;

			default: 
				console.log('unhandled init ele', type )
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
			// fill: {
			// 	allowed: ['rect', 'circle', 'path', 'text'],
			// },
			data: {
				allowed: true,
			},
			snaps: {
				allowed: true,
			},
			up: {
				allowed: true,
			},
			down: {
				allowed: true,
			}
		}

		let action
		for( const type in this.actions ){

			action = this.actions[ type ]
			action.ele = document.createElement('div')
			action.ele.setAttribute('data-type', type )

			if( type ==='snaps'){ // special case - build 9 grid buttons

				action.ele.classList.add('grid-container')
				for( let x = 0; x < 3; x++ ){
					const row = document.createElement('div')
					row.classList.add('grid-row')
					for( let y = 0; y < 3; y++ ){
						const cell = document.createElement('div')
						cell.classList.add('grid-cell')
						const index = (x * 3 ) + y
						// cell.innerText = index
						cell.addEventListener('click', e => {
							BROKER.publish('GUI_ACTION', {
								type: 'snap',
								e: e,
								index: index,
							})
						})
						row.append( cell )
					}
					action.ele.append( row )
				}

			}else{ // normal buttons

				// build DOM element / button
				action.ele.innerHTML = type
				if( type == 'up' || type == 'down' ) action.ele.innerHTML = arrows[ type ]
				action.ele.classList.add('button')
				// assign action (publish event to CANVAS)
				action.action = () => {
					BROKER.publish('GUI_ACTION', {
						type: type,
					})
				}
				action.ele.addEventListener('click', action.action )

			}
			this.wrapper.append( action.ele )
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


















// ------------------------------------------------------------------------------------
// lib
// ------------------------------------------------------------------------------------
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
	if( url ){
		img.src = './library/' + url
	}
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

const build_key = ( name, value ) => {
	const wrapper = document.createElement('div')
	wrapper.classList.add('keybind')
	const prefix = STATE.prefixes[ name ] ? STATE.prefixes[ name ] + ' + ' : ''
	wrapper.innerHTML = `<span>${ name.replace(/_/g,' ') }</span>: ${ prefix + STATE.keycodes[ value ] }`
	return wrapper
}

















// ------------------------------------------------------------------------------------
// init / bindings
// ------------------------------------------------------------------------------------
for( const type of section_types ){
	const btn = new GUI_Section({
		type: type,
	})
	nav.append( btn.tab )
	content.append( btn.ele )
}

nav.querySelector('.button').click()

toggle.addEventListener('click', () => {
	toggle.classList.toggle('toggled')
	gui.classList.toggle('toggled')
})













// ------------------------------------------------------------------------------------
// event subcribers
// ------------------------------------------------------------------------------------
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