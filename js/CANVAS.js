import hal from './util/hal.js?v=3'
import BROKER from './util/EventBroker.js?v=3'
import {
	handleDragStart,
	handleDragOver,
	handleDragEnter,
	handleDragLeave,
	handleDrop,
	handleDragEnd,
} from './util/dragndrop.js?v=3'













// ------------------------------------------------------------------------
// lib
// ------------------------------------------------------------------------

// canvas resizing

let lastX
let bounds
const update_resize = e => {
	const diffX = e.clientX - lastX
	bounds = fCanvas.wrapperEl.getBoundingClientRect()
	// const style = ( bounds.width + diffX ) + 'px !important'
	// fCanvas.wrapperEl.style.width = style
	fCanvas.wrapperEl.style['max-width'] = (bounds.width + diffX  ) + 'px'
	fCanvas.wrapperEl.style.height = bounds.width + 'px'
	// console.log( '?', style  )
	// console.log('resizer', diffX )
	lastX = e.clientX
}
const start_resize = e => {
	lastX = e.clientX
	window.addEventListener('mousemove', update_resize )
	window.addEventListener('mouseup', remove_resize )
}
const remove_resize = e => {
	window.removeEventListener('mousemove', update_resize )
}


// canvas binding listeners
const object_added = e => {

	BROKER.publish('GUI_UPDATE', { canvas: fCanvas })
}
const object_modified = e => {
	console.log('obj modified')
}
const selection_created = e => {
	BROKER.publish('GUI_UPDATE', { canvas: fCanvas })
}
const selection_cleared = e => {
	BROKER.publish('GUI_UPDATE', { canvas: fCanvas })
}
// const double_click = e => {

// }
















// ------------------------------------------------------------------------
// init canvas
// ------------------------------------------------------------------------

const fCanvas = window.fCanvas = new fabric.Canvas( document.getElementById('canvas'), {
	width: 1080,
	height: 1080,
	renderOnAddRemove: false, // performance gains; many functions need this though
	preserveObjectStacking: true
})

const resizer = document.createElement('div')
resizer.id = 'resizer'
resizer.innerHTML = '&rarr;'
resizer.addEventListener('mousedown', start_resize )
fCanvas.wrapperEl.append( resizer )


// init size
const init_width = window.innerWidth - 400
// ( if square )
setTimeout(() => {
	fCanvas.wrapperEl.style['max-width'] = init_width + 'px'
	fCanvas.wrapperEl.style['height'] = init_width + 'px'
}, 500)


// drop events
const gui = document.getElementById('gui')
gui.addEventListener('dragstart', handleDragStart)
window.addEventListener('dragend', handleDragEnd )
fCanvas.upperCanvasEl.addEventListener('dragenter', handleDragEnter)
fCanvas.upperCanvasEl.addEventListener('dragover', function( event ){ handleDragOver( event ) } )
fCanvas.upperCanvasEl.addEventListener('dragleave', handleDragLeave )
fCanvas.upperCanvasEl.addEventListener('drop', function(){ handleDrop( event ) } )


// dummy data for canvas
const add_dummy_data = () => {
	const rect = new fabric.Rect({
		width: window.innerWidth / 2,
		height: window.innerWidth / 2,
		top: 10,
		left: 10,
		fill: 'pink',
	})
	rect.rotate(20)

	fCanvas.add( rect )
	fCanvas.requestRenderAll()
}

add_dummy_data()


// bind events
fCanvas.on('object:added', object_added )
fCanvas.on('object:modified', object_modified )
fCanvas.on('selection:created', selection_created )
fCanvas.on('selection:updated', selection_created )
fCanvas.on('selection:cleared', selection_cleared )
// fCanvas.on('mouse:dblclick', double_click )// for text editing..


























// ------------------------------------------------------------------------
// subscribers
// ------------------------------------------------------------------------

const add_object = event => {
	const { type, object, top, left } = event

	switch( type ){
		case 'image':
			fCanvas.add( object )
			if( top ) object.set('top', top )
			if( left ) object.set('left', left )
			fCanvas.requestRenderAll()
			break;
		default:
			return console.log('unknown add object', type, object )
	}

}

const render_all = event => {
	fCanvas.requestRenderAll()
}

const add_image = event => {
	const {
		img, // data URL 
		width,
		height,
		left,
		top,
		e,
	} = event

	const image = new Image()
	image.src = img
	image.onload = ev => {

		const dropleft = e.layerX
		const droptop = e.layerY

		const fimg = new fabric.Image( image, {
			// width: 150,
			left: dropleft,
			top: droptop,
		})

		const LIMIT = 500 // px

		if( image.width > LIMIT ){
			const ratio = LIMIT / image.width
			fimg.scaleToWidth( image.width * ratio )
			fimg.scaleToHeight( image.height * ratio )
		}

		console.log('adding', fimg )

		fCanvas.add( fimg )
		fCanvas.requestRenderAll()

	}

	// console.log( e, e.layerY, e.layerX )
	// document.body.append( image )
	// event ? event.layerY - img.height/2 : 100,

}

const action = event => {

	const { type } = event

	switch( type ){

		case 'copy':
			hal('standard', 'action ' + type + ' in development', 3000 )
			break;

		case 'delete':
			hal('standard', 'action ' + type + ' in development', 3000 )
			break;

		case 'fill':
			hal('standard', 'action ' + type + ' in development', 3000 )
			break;

		case 'data':
			const obj = fCanvas.getActiveObject()
			if( !obj ) return hal('standard', 'no object selected', 3000 ) // should be impossible
			console.log( obj )
			// x, y, scale, position, alignment and keyboard nudging
			const fields = ['width', 'height', 'top', 'left', 'scaleX', 'scaleY', 'angle']
			const packet = {}
			for( const field of fields ){
				packet[ field ] = obj[ field ]
			}
			hal('standard', 'aCoords: <br><pre>' + JSON.stringify( obj.aCoords, false, 2 ) + '</pre>', 30 * 1000 )
			hal('standard', 'data: <br><pre>' + JSON.stringify( packet, false, 2 ) + '</pre>', 30 * 1000 )
			break;

		default: 
			return console.log('unknown gui action', type )
	}

}



BROKER.subscribe('CANVAS_ADD_OBJECT', add_object )
BROKER.subscribe('CANVAS_RENDER', render_all )
BROKER.subscribe('ADD_IMAGE', add_image )
BROKER.subscribe('GUI_ACTION', action )



export default {}