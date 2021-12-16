const items = document.getElementById('items')
const templatedCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

items.addEventListener('click', e => {
    addCarrito(e)
})



const fetchData = async () => {
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        // console.log(data)
        pintarCards(data)

    } catch (error){
        console.log(error)
    }

}
    
const pintarCards = data => {
    console.log(data) //accedemos a todos los datos 
    data.forEach(producto =>{
        templatedCard.querySelector('h5').textContent = producto.title
        templatedCard.querySelector('p').textContent = producto.precio
        templatedCard.querySelector('img').setAttribute("src", producto.thumbnailUrl) 
        templatedCard.querySelector('.btn-dark').dataset.id = producto.id //vinculamos el atributo id en cada boton 
        

        const clone = templatedCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}

const addCarrito = e => {
    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement) //mandamos el elemento padre a setcarrito

        
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id, //accedemos al bton y escogemos solo el id
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1

    }
    if(carrito.hasOwnProperty(producto.id)){  //se pregunta si existe la propiedad producto.id
        producto.cantidad = carrito[producto.id].cantidad + 1 //accedemos al carrito en el elemento que se repite, una vez dentro
                                                              //accedemos solo a la cantidad y le sumamos 1
    }
    carrito[producto.id] = {...producto} //con los ... se adquiere la informacion de producto
                                         //y genera una copia del mismo producto

    console.log(carrito )

}
