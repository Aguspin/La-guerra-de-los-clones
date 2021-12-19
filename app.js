const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templatedCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
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
   // console.log(data) accedemos a todos los datos 
    data.forEach(producto =>{
        templatedCard.querySelector('h5').textContent = producto.title
        templatedCard.querySelector('p').textContent = producto.precio
        templatedCard.querySelector('img').setAttribute("src", producto.thumbnailUrl) 
        templatedCard.querySelector('.btn-dark').dataset.id = producto.id //vinculamos el atributo id en cada boton 

        const clone = templatedCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
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

    pintarCarrito()
}

const pintarCarrito = () => {
    //console.log(carrito)
    items.innerHTML = ' ' //iniciamos el carrito vacio para que no se sobreescriba 
    
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)

    })
    items.appendChild(fragment)


    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0 )
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    //console.log(e.target)
    //accions de aumentar
    if(e.target.classList.contains('btn-info')){
        //console.log(carrito[e.target.dataset.id])
        //carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id] //eliminara solo el objeto que tien el indice 
        }
        pintarCarrito()

    }
    e.stopPropagation()
}