const css =`
.modal{
	position: fixed;
	z-index: 9999;
	top: 0px;
	left: 0px;
	font-size: 1rem;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	background: rgba(0, 0, 0, .5);
}
.modal-close{
	position: absolute;
	z-index: 9;
	top: 50px;
	right: calc( 50% - 300px);
	background: black;
	color: white;
	cursor: pointer;
	height: 30px;
	width: 30px;
	border: 1px solid rgb(50, 50, 50);
    font-size: 1.5rem;
}
.modal-close:hover{
	background: white;
	color: black;
}
.modal-content{
	background: black;
	position: absolute;
	padding: 30px;
	margin-top: 50px;
	width: 100%;
	max-width: 600px;
	overflow-y: auto;
	overflow-x: hidden;
	padding-top: 40px;
	max-height: 80vh;
	border: 1px solid grey;
}

.modal h1,
.modal h2,
.modal h3{
/*     color: white; */
}
.modal  .modal-header{
	color: #c1cafb;
	margin-bottom: 10px;
}
.modal .column h3.column-header{
	margin-top: 0;
}
/* .modal-row */
.modal .column{
	padding: 10px 10px 30px 10px;
	height: 90%;
}
.modal .left-panel{
}
.modal .right-panel{
}
.right-panel .button{
	margin: 5px 0;
	border: 1px solid grey;
}

.modal input{
    margin: 10px 0;
}
.modal label{
    text-align: left;
    font-weight: bold;
    width: 100%
}
.modal label,
.modal input[type=checkbox]{
	display: inline-block;
}
.modal input[type=checkbox]{
	width: 20px;
	height: 20px;
	vertical-align: middle;
	margin: 0 10px;
}

.modal input[type=submit]{
	display: inline-block;
	max-width: auto;
	width: auto;
}

.input-wrapper{
	text-align: left;
	margin: 15px 0;
}

/* submit */
.input-wrapper:last-of-type{
	text-align: center;
}

.modal option{
	color: black;
	font-weight: bold;
}

@media screen and (max-width: 800px){
	.modal-close{
		right: 0px;
	}
}`

const style = document.createElement('style')
style.innerHTML = css
document.body.appendChild( css )


class Modal {

	constructor( init ){
		// init.id
		init = init || {}
		if( !init.type ) console.log('modal missing type')

		const modal = this

		const ele = modal.ele = document.createElement('div')
		modal.ele.classList.add('modal')
		modal.ele.id = init.id

		const type = modal.type = init.type
		modal.ele.classList.add( type )
		modal.ele.setAttribute('data-type', type )

		modal.content = document.createElement('div')
		modal.content.classList.add('modal-content')

		modal.close = document.createElement('div')
		modal.close.classList.add('modal-close', 'flex-wrapper')
		modal.close.innerHTML = '&times;'
		modal.close.addEventListener('click', () => {
			modal.close()
		})
		modal.ele.appendChild( modal.content )
		modal.ele.appendChild( modal.close )

	}

	close(){
		modal.ele.remove()
		// BROKER.publish('MODAL_CLOSE', { type: init.type })
	}

	make_columns(){

		this.left_panel = document.createElement('div')
		this.left_panel.classList.add('column', 'column-2', 'left-panel')

		this.right_panel = document.createElement('div')
		this.right_panel.classList.add('column', 'column-2', 'right-panel')

		this.content.appendChild( this.left_panel )
		this.content.appendChild( this.right_panel )

		this.ele.classList.add('has-columns')
		
	}


}



export {
	Modal,
	// ModalTrigger,
	// StatusBar,
}

