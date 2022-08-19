console.log("init")

// const c1 = document.createElement('canvas')
// document.body.append( c1 )

const fCanvas = new fabric.Canvas( document.getElementById('canvas'), {
	width: 1080,
	height: 1080,
})

const rect = new fabric.Rect({
	width: 100,
	height: 100,
	fill: 'blue',
})

fCanvas.add( rect )
fCanvas.requestRenderAll()