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


class Section {

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
	const btn = new Section({
		type: type,
	})
	nav.append( btn.tab )
	content.append( btn.ele )
}

nav.querySelector('.button').click()


export default {}