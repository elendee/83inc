import hal from './util/hal.js?v=6'
import * as lib from './util/lib.js?v=6'
import BROKER from './util/EventBroker.js?v=6'
import {
	handleDragStart,
	handleDragOver,
	handleDragEnter,
	handleDragLeave,
	handleDrop,
	handleDragEnd,
} from './util/dragndrop.js?v=6'
import STATE from './STATE.js?v=6'













// ------------------------------------------------------------------------
// lib
// ------------------------------------------------------------------------

// key moves
const key_directions = {
	38: [0, -1],
	39: [1, 0],
	40: [0, 1],
	37: [-1, 0],
}
const move_obj = ( keycode, shift, event ) => {
	const obj = fCanvas.getActiveObject()
	if( !obj ) return console.log('no obj found to move')
	// console.log('args?', keycode, shift )
	event.preventDefault()

	const set = key_directions[ keycode ]
	let horiz = set[0]
	if( shift ) horiz *= 8
	let vert = set[1]
	if( shift ) vert *= 8
	obj.left += horiz
	obj.top += vert
	fCanvas.requestRenderAll()
}
const debounced_move = lib.make_debounce( move_obj, 200, true, false )


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

// copy paste
function specialcopy(){

	fCanvas.getActiveObject().clone(function(cpy){ 
		
		cpy.set({
			left: cpy.left + 20,
			top: cpy.top + 20
		})

		if (cpy.type === 'activeSelection') {
			cpy.canvas = fCanvas

			cpy.forEachObject(function(obj) {
				fCanvas.add(obj)
			})
			cpy.setCoords()
		} else {
			fCanvas.add(cpy)
		}

		fCanvas.discardActiveObject()
			.setActiveObject(cpy)
			.requestRenderAll()

	})
		
}

const print_index = () => {
	const obj = fCanvas.getActiveObject()
	if( !obj ) return console.log('no object')
	const index = fCanvas._objects.indexOf( obj ) + 1
	const layers = fCanvas._objects.length
	hal('standard', 'object layer: ' + index + '/' + layers, 2000 )
}

const debounced_print_index = lib.make_debounce( print_index, 500, false, true )

const step_rotate_obj = ( dir, key ) => {
	if( !dir ){
		if( key === 37 ) dir = 'ccw'
		if( key === 39 ) dir = 'cw'
	}
	if( dir !== 'cw' && dir !== 'ccw') return console.log('invalid rotate', dir, key )

		console.log('r?')

	const obj = fCanvas.getActiveObject()
	let step = 15 
	if( dir === 'ccw') step *= -1
	obj.rotate( step + obj.angle )
	fCanvas.requestRenderAll()

}























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
setTimeout(() => {
	fCanvas.wrapperEl.style['max-width'] = init_width + 'px'
	fCanvas.wrapperEl.style['height'] = init_width + 'px'

	const obj = fCanvas._objects?.[0]
	if( obj ) fCanvas.setActiveObject( obj ).requestRenderAll()

}, 500)


// drop events
const gui = document.getElementById('gui')
gui.addEventListener('dragstart', handleDragStart)
window.addEventListener('dragend', handleDragEnd )
fCanvas.upperCanvasEl.addEventListener('dragenter', handleDragEnter)
fCanvas.upperCanvasEl.addEventListener('dragover', function( event ){ handleDragOver( event ) } )
fCanvas.upperCanvasEl.addEventListener('dragleave', handleDragLeave )
fCanvas.upperCanvasEl.addEventListener('drop', function(){ handleDrop( event ) } )




// keybinds
const key_up = e => {
	if( 0 ) console.log( e.keyCode )
	if( e.shiftKey ){

		if( e.altKey ){

			switch( e.keyCode ){

				case 37: // l
				case 39: // r
					step_rotate_obj( false, e.keyCode )
					e.preventDefault()
					break;

				default:
					break;
			}

		}else{

			switch( e.keyCode ){
				default:return

			}
		}

	}else if( e.ctrlKey ){

		switch( e.keyCode ){
			default:return
		}

	}

	switch( e.keyCode ){
		case 27:
			fCanvas.discardActiveObject().requestRenderAll()
			break;
		case 13: // enter
			break;
		case 8:
			const obj = fCanvas.getActiveObject()
			if( !obj ) return console.log('no obj to delete')
			BROKER.publish('GUI_ACTION', {
				type: 'delete'
			})
			break;
		default:return
	}
}

const key_down = e => {

	if( e.shiftKey ){

		if( e.altKey ){

			return

		}else{

			switch( e.keyCode ){
				case 38: // u
				case 39: // r
				case 40: // d 
				case 37: // l
					move_obj( e.keyCode, true, e )
					e.preventDefault()
					break;
				default:return
			}

		}

	}else if( e.ctrlKey ){

		switch( e.keyCode ){
			case 3:
				break;
			default:return
		}

	}

	switch( e.keyCode ){
		case 38: // u
		case 39: // r
		case 40: // d 
		case 37: // l
			move_obj( e.keyCode, false, e )
			e.preventDefault()
		default:return
	}
}

window.addEventListener('keyup', key_up )
window.addEventListener('keydown', key_down )



// dummy data for canvas
const add_dummy_data = () => {
	const rect = new fabric.Rect({
		width: window.innerWidth / 4,
		height: window.innerWidth / 4,
		top: window.innerWidth / 4,
		left: window.innerHeight / 4,
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
			object.setCoords()
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

		fimg.setCoords()

		fCanvas.requestRenderAll()

	}

	// console.log( e, e.layerY, e.layerX )
	// document.body.append( image )
	// event ? event.layerY - img.height/2 : 100,

}

const action = event => {

	const { type, e, index } = event

	const obj = fCanvas.getActiveObject()

	switch( type ){

		case 'copy':
			hal('standard', 'action ' + type + ' in development', 3000 )
			if( !obj ) return console.log('no obj to copy')
			// if( obj.type.match(/active/i)){
				// return hal('error', 'group copies not currently supported', 5000 )
			// }
			specialcopy()
			break;

		case 'delete':
			if( !obj ) return console.log('no obj to delete')
			if( obj.type.match(/active/i)){
				for( const o of obj._objects ){
					fCanvas.remove( o) 
				}
			}
			fCanvas.remove( obj )
			fCanvas.discardActiveObject()
			break;

		case 'fill':
			hal('standard', 'action ' + type + ' in development', 3000 )
			break;

		case 'data':
			if( !obj ) return hal('standard', 'no object selected', 3000 ) // should be impossible
			console.log( obj )
			// x, y, scale, position, alignment and keyboard nudging
			const fields = ['width', 'height', 'top', 'left', 'scaleX', 'scaleY', 'angle']
			const packet = {}
			for( const field of fields ){
				packet[ field ] = obj[ field ]
			}
			hal('standard', 'aCoords (the 4 corners): <br><pre>' + JSON.stringify( obj.aCoords, false, 2 ) + '</pre>', 30 * 1000 )
			hal('standard', 'data: <br><pre>' + JSON.stringify( packet, false, 2 ) + '</pre>', 30 * 1000 )
			break;

		case 'snap':
			// console.log( e.target, index )
			if( !obj ) return hal('error', 'no object to snap', 3000 )

			// could split this into several types of snap
			// - by bounding rect
			// - by object corner positions
			// - by object center

			// bounding rect for now...

			const bounds = obj.getBoundingRect()

			const cwidth = fCanvas.getWidth()
			const cheight = fCanvas.getHeight()

			const mid = {
				x: lib.middle( cwidth, bounds.width ),
				y: lib.middle( cheight, bounds.height )
			}

			switch( index ){
				case 0: // tl
					obj.left -= bounds.left
					obj.top -= bounds.top
					break;
				case 1:
					lib.setBoundingBox( obj, 'left', mid.x )
					obj.top -= bounds.top
					break;
				case 2:
					lib.setBoundingBox( obj, 'left', cwidth - bounds.width )
					obj.top -= bounds.top
					break;
				case 3: // ml
					obj.left -= bounds.left
					lib.setBoundingBox( obj, 'top', mid.y )
					break;
				case 4:
					lib.setBoundingBox( obj, 'left', mid.x )
					lib.setBoundingBox( obj, 'top', mid.y )
					break;
				case 5:
					lib.setBoundingBox(obj, 'top', mid.y )
					lib.setBoundingBox( obj, 'left', cwidth - bounds.width )
					break;
				case 6:
					obj.left -= bounds.left
					lib.setBoundingBox( obj, 'top', cheight - bounds.height )
					break;
				case 7:
					lib.setBoundingBox( obj, 'left', mid.x )
					lib.setBoundingBox( obj, 'top', cheight - bounds.height )
					break;
				case 8:
					lib.setBoundingBox( obj, 'left', cwidth - bounds.width )
					lib.setBoundingBox( obj, 'top', cheight - bounds.height )
					break;
			}

			break;

			case 'up':
				if( !obj ) return hal('error', 'no obj selected', 2000 )
				obj.bringForward()
				debounced_print_index()
				break;

			case 'down':
				if( !obj ) return hal('error', 'no obj selected', 2000 )
				obj.sendBackwards()
				debounced_print_index()
				break;

		default: 
			return console.log('unknown gui action', type )
	}

	fCanvas.requestRenderAll()

}




BROKER.subscribe('CANVAS_ADD_OBJECT', add_object )
BROKER.subscribe('CANVAS_RENDER', render_all )
BROKER.subscribe('ADD_IMAGE', add_image )
BROKER.subscribe('GUI_ACTION', action )



export default {}