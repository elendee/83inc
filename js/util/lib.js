const middle = ( container, obj_bound ) => {
	/*
		return middle of canvas accounting for obj size
	*/

	return ( container / 2 ) - ( obj_bound / 2 )

}

const setBoundingBox = ( obj, prop, val) => {
	/*
		move fabric obj by bounding box instead of internal left / top coords
	*/
	
	var bbox = obj.getBoundingRect();
	obj.set(prop, (obj[prop] - bbox[prop]) + val);
	obj.setCoords();
}


const make_debounce = ( fn, time, immediate, delay ) => {
	/*
		immediate = run on first call
		punctuate = run on every interval ( as opposed to delaying exec til end )
	*/

    let buffer
    return (...args) => {
        if( !buffer && immediate ){
        	// console.log('first exec')
        	fn(...args)
        }
        if( delay )_clearTimeout( buffer )
        buffer = setTimeout(() => {
            fn(...args)
            buffer = false
            // console.log('-go-')
        }, time )
    }
}


export {
	make_debounce,
	setBoundingBox,
	middle,
}