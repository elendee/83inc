import BROKER from './util/EventBroker.js?v=1'




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


// init canvas

const fCanvas = window.fCanvas = new fabric.Canvas( document.getElementById('canvas'), {
	width: 1080,
	height: 1080,
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



// dummy data for canvas

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







// subscribers
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



BROKER.subscribe('CANVAS_ADD_OBJECT', add_object )



export default {}