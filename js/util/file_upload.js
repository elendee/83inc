/* 
form must contain a file input
*/

const bind_form = ( form, UPLOAD_SIZE, error_function, spinner ) => {

	const uploader = form.querySelector('input[type=file]')

	form.onsubmit = e => {

		e.preventDefault()

		if( !uploader ){
			console.log('invalid form element found for binding')
			return
		}

		if( !UPLOAD_SIZE ){
			console.log('invalid form binding, no upload size')
			return	
		}

		if( !uploader.files || !uploader.files.length ){
			console.log('must choose an image to upload')
			return false
		}

		const file = uploader.files[0]
		// const description = document.querySelector('#upload textarea').value.trim()
		// const title = document.querySelector('#upload-title').value.trim()

		// if ( !file || !file.type.match('image.*') ) {
		// 	console.log('invalid file - images only')
		// 	return false
		// }

		if( file.size > UPLOAD_SIZE ){
			console.log('file too big - ' + ( file.size / 1000 ).toFixed(2) + '/' + ( UPLOAD_SIZE / 1000 ).toFixed(2) )
			return false
		}

		if( file.type.match(/gif/) ){
			// meh
			// console.log('gifs can be uploaded but will not currently animate', 8 * 1000 )
		}

		if( spinner ) spinner.show()

		const reader = new FileReader()

		reader.readAsDataURL( file )

		reader.onloadend = function( evt ) {

			xhr_file( file, params )
			.then( res => {
				console.log( res )
			})
			.catch( err => {
				console.log( err )
			})

			/* 

			////// FANCY IMG LOADER - show image locally during upload:

			const img = document.createElement('img')
			img.src = evt.target.result								 

			img.onload = function(){

				xhr_file(  file, USER.handle, piece_title.value.trim(), get_radio_value('small', document.querySelectorAll('input[name=size]') ), description.value.trim(), anon.checked, pillar_mesh.userData.pillar_uuid, pillar_mesh.userData.slot_index )
				.then( res => {
					if( !res.success ){
						console.log(res.msg || 'failed to upload piece' )
					}
					if( spinner ) spinner.hide()

					console.log('xhr_file res: ', res )
				})
				.catch( err => {
					if( spinner ) spinner.hide()
					console.log('err xhr_file', err )
				})
				window.focus()
			}

			img.onerror = (a, b) => {
				console.log('img upload err: ', a, b )
			}

			*/

		}

	}

}





const xhr_file = async( file, data ) => {

	const formData = new FormData()
	formData.enctype = 'multipart/form-data'
	formData.append('upload', file ) // post value, file, name  // 'some-' + lib.random_hex( 6 ) // filename should be serverside
	for( const key in data ){
		formData.append( key, data[ key ] )
	}

	const xhr = new XMLHttpRequest()

	const res = await new Promise((resolve, reject) => {

		xhr.open('POST', '/file_handler', true)

		xhr.onreadystatechange = function() {

			if( this.readyState == XMLHttpRequest.DONE ){

				try{

					// console.log( 'file_handler res: ', this.response )

					const response = JSON.parse( this.response )

					resolve( response )

				}catch(e){
					console.log( this.response )
					// if( this.response.match(/too large/i)){
						// ...
					// }
					reject( e )
				}

			}else{
				// data chunks here  // console.log('xhr readyState: ', this.readyState ) [ 0, 1, 2, ... ]
			}

		}

		xhr.send( formData )

		xhr.onerror = err => {
			console.log( err )
			reject( err )
		}

	})

	return res

}

export {
	xhr_file,
	bind_form,
}
