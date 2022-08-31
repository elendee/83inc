import BROKER from './EventBroker.js?v=6'
// import CANVAS from './CANVAS.js'
// 
// import USER from '../USER.js'
// what is this ... ?
// let drag_images = document.querySelectorAll('#images img');
// [].forEach.call(drag_images, function (img) {
// 		img.addEventListener('dragstart', handleDragStart, false);
// 		img.addEventListener('dragend', handleDragEnd, false);
// });

	


// DRAG AND DROP

function handleDragStart( e ) {
	// [].forEach.call(images, function (img) {
	// 	 img.classList.remove('img_dragging')
	// })
	const drop = e.target.classList.contains('drop') ? e.target : e.target.parentElement
	drop.classList.add('img_dragging')
	console.log( e.target )
}
	
function handleDragOver( e ) {
	if (e.preventDefault ) {
		e.preventDefault() 
		// e.dataTransfer.dropEffect = 'copy'; 
	}	 
	if(e.dataTransfer){
		e.dataTransfer.dropEffect = 'copy'
	}
	// dlog('log', e)
	return false
}
	
function handleDragEnter( e ) {
	this.classList.add('over')
}
	
function handleDragLeave( e ) {
	this.classList.remove('over') // this / e.target is previous target element.
}
	
function handleDrop( event ) {

	event.preventDefault()
	if( event.stopPropagation ) event.stopPropagation()

	// handle desktop images

	if( event.dataTransfer.files.length > 0 ){

		// dlog('log', '1 inbound drop')

		var files = event.dataTransfer.files
		// for (var i = 0, f; f = files[i]; i++) {
		if( files.length > 1 ){

			// console.log('only 1 image at a time currently', 3000)
			// alert('too many filezzzzz in one drop (5<)')
		}else{

			for( let i = 0 ; i < files.length; i++ ){

				let the_file = files[i]

				if ( the_file.type.match('image.*') ) {

					let mb = Number( (the_file.size / 1000000 ).toFixed(3) )
					//blorb
					console.log( 'mb: ', mb )

					if( mb < 10 ){

						if( the_file.type.match(/svg/i) ){
	
							console.log('svg drops currently unsupported', 3000 )
	
						}else{
										
							// console.log('the drop image:', the_file )

							var reader = new FileReader()
							console.log('saving image to server...', 2000)
							reader.readAsDataURL( the_file )
							reader.onloadend = function( evt ) {

								console.log('Reader result: ', evt )

								const img = evt.target.result

								BROKER.publish('ADD_IMAGE', {
									img: img,
									width: img.width,
									height: img.height,
									left: 100,
									top: 100,
									e: event, // the drop event, not img load event
								})

								// CANVAS.save_image( evt.target.result, the_file, event )
							}

						}

					}else{

						console.log('filesize too large: ' + mb + 'mb out of ' + dpk.config.upload.mb[dpk.USER._level] + 'mb limit', 2500)
	
					}

				}

			}

	 	}
		// }
	}else{// dataTransfer.files.length <= 0

		// dlog('log', 'dataTransfer  files < 0', JSON.stringify(e))
		if( event.dataTransfer ){

			console.log('cross browser images not supported yet', 2000)

			// let source = e.dataTransfer.getData('URL')
	
			// if(source.match(/(jpg|gif|png)$/i)){
	
			// if(!CANVAS.flags.img_processing){

			// try{

			// 	// let url = e.dataTransfer.getData('URL')

			// 	let img = document.createElement('img')
			// 	img.onload = function(event){
			// 		let bindings = {
			// 			top: 50,
			// 			left: 50,
			// 			id: depikt_id(),
			// 			timestamp: new Date().getTime(),
			// 			src: source,
			// 			crossOrigin: 'Anonymous'//,
			// 		}
										
			// 		// CANVAS._canvas.requestRenderAll();
			// 		unSave();
			// 		// dlog('log', 'i: ', i)						

			// 	}
			// 	img.src = source

			// }catch(err){

			// 	dlog('log', 'err: ', err)

			// }
	
			// }else{
			// 	console.log('try again in a few seconds; image processing.', 1500)
			// }

		}else{
			event.preventDefault()
		}

	}
	
	BROKER.publish('CANVAS_RENDER')

	return false

} // end handleDrop()
	
	
	
function handleDragEnd(e) {
		
	// [].forEach.call(images, function (img) {
	// 	img.classList.remove('img_dragging')
	// })
	for( const drop of document.querySelectorAll('.drop')){
		drop.classList.remove('img_dragging')
	}
			 
}



export {
	handleDragStart,
	handleDragOver,
	handleDragEnter,
	handleDragLeave,
	handleDrop,
	handleDragEnd,
}

