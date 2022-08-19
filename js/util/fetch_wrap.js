/* 

fetch_wrap

fetch_wrap assumes you just want to make GET requests and POST's with JSON, and nothing else.
it simplifies the syntax required in your app.

example:
fetch_wrap('/my_endpoint', 'post', {
	myCustomField: 9999999,
})
.then( res => {
	console.log( 'this is the response: ', res')
})
.catch( err => {
	console.log( 'there was an error: ', err')
})

*/





// import a Spinner here if you want to run it on all fetches:
let spinner



export default ( url, method, body, no_spinner ) => {

	return new Promise( ( resolve, reject ) => {

		if( !no_spinner && spinner ) spinner.show()

		if( method.match(/post/i) ){

			fetch( url, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( body )
			})
			.then( res => {
				res.json()
				.then( r => {
					if( !no_spinner && spinner )  spinner.hide()
					resolve( r )
				}).catch( err => {
					if( !no_spinner && spinner )  spinner.hide()
					reject( err )
				})
			}).catch( err => {
				if( !no_spinner && spinner )  spinner.hide()
				reject( err )
			})
			.catch( err => {
				if( !no_spinner && spinner )  spinner.hide()
				reject( err )
			})

		}else if( method.match(/get/i) ){

			fetch( url )
			.then( res => {
				res.json()
				.then( r => {
					if( !no_spinner && spinner )  spinner.hide()
					resolve( r )
				}).catch( err => {
					if( !no_spinner && spinner )  spinner.hide()
					reject( err )
				})
			}).catch( err => {
				if( !no_spinner && spinner )  spinner.hide()
				reject( err )
			})
			.catch( err => {
				if( !no_spinner && spinner )  spinner.hide()
				reject( err )
			})

		}else{

			if( !no_spinner && spinner )  spinner.hide()
			reject('invalid fetch ' + url )
			
		}

	})


}

