//data schema
class MenuItem {
    constructor (id, name, image, price) {
        this.id = id
        this.name = name
        this.image = image
        this.price = price
    }
}
class Food extends MenuItem {
}
class Drink extends MenuItem {
}
// data
let data = {
    menu: {
        food: [
            new Food(1, "Pizza", "images/Pizza.jpeg", 100),
            new Food(2, "Salad", "images/Salad.jpeg", 50),
            new Food(3, "Soup", "images/Soup.jpeg", 25),
        ],
        drinks: [
            new Food(4, "Cola", "images/Cola.jpeg", 20),
            new Food(5, "Water", "images/Water.jpeg", 10),
            new Food(6, "Coffee", "images/Coffee.jpeg", 30),
        ]
    },
    order: {
        items: [

        ],
        total: 0
    },
    promotions: {
        freeDeliveryLimit: {
            limit: 200,
            cost: 0
        },
        discount: {
            limit: 5,
            cost: 0.9
        }
    }
}
//HW1: remove item by id when the checkbox is unckeched
const addItemToOrder = (id) => {
    let selectedItem = data.menu.food.find(
        item => item.id === id
    )
    data.order.items.push(
        {itemRef: data.menu.food[0], quantity: 1}
    )
    data.order.total += selectedItem.price
    renderOrder(footerSection, data.order)
}
//render
const renderMenuItem = (menuItem, parentElement, handler) => {
        let label = document.createElement('label')
        let input = document.createElement('input')
            input.setAttribute("type", "checkbox")
            input.setAttribute('data-id', menuItem.id)
        let labelText = document.createTextNode(`${menuItem.name} ${menuItem.price}`)

        let img = document.createElement('img')
        img.src = menuItem.image

        label.appendChild(input)
        label.appendChild(img)
        label.appendChild(labelText)

        parentElement.appendChild(label)
        
        input.addEventListener('change', handler)
}
const renderItemSet = (title) => {
    let fieldset = document.createElement('fieldset')
    let legend = document.createElement('legend')
    let labelText = document.createTextNode(title)
    legend.appendChild(labelText)
    fieldset.appendChild(legend)
    return fieldset
}
const renderMenuForm = (rootElement, menu) => {
    let form = document.createElement('form')
    let foodSet = renderItemSet('Food')
    let drinkSet = renderItemSet('Drinks')
    
    menu.food.forEach(foodData => renderMenuItem(foodData, foodSet, toggleMenuItemHandler))
    menu.drinks.forEach(drinkData => renderMenuItem(drinkData, drinkSet, toggleMenuItemHandler))

    form.appendChild(foodSet)
    form.appendChild(drinkSet)

    rootElement.appendChild(form)
}
const renderMenuItemQuantity = (id, decHandler, incHandler) => {
    let div = document.createElement('div')
    let btnDec = document.createElement('button')
        btnDec.addEventListener('click', decHandler)
        btnDec.innerText = "-"
        btnDec.setAttribute('data-id', id)
    let inputQ = document.createElement('input')
        inputQ.value = 1
        inputQ.type = "text"
        inputQ.setAttribute('data-id', id)
    let btnInc = document.createElement('button')
        btnInc.addEventListener('click', incHandler)
        btnInc.innerText = "+"
        btnInc.setAttribute('data-id', id)

    div.appendChild(btnDec)
    div.appendChild(inputQ)
    div.appendChild(btnInc)
    
    return div
}
const renderOrder = (rootElement, order) => {
    //HW:6 render in better format
    if(rootElement.children.length > 0) {
       rootElement.removeChild(rootElement.firstElementChild) 
    }
    let div = document.createElement('div')
    div.innerText = order.total
    rootElement.append(div)
}
//events
const toggleMenuItemHandler = (event) => {
    let toggledInput = event.target
    let label = toggledInput.parentElement
    let id = +toggledInput.dataset.id

    if (toggledInput.checked) {
        let menuItemQuantity = renderMenuItemQuantity(id, decQuantityHandler, incQuantityHandler)
        label.after(menuItemQuantity)

        addItemToOrder(+id)
    } else {
        removeItemFromOrder(id);
        label.parentElement.removeChild(label.nextElementSibling);
    }
}

const removeItemFromOrder = (id) => {
    let selectedItem = data.order.items.find((item) => item.itemRef.id === id);

    if (selectedItem) {
        data.order.total -= selectedItem.itemRef.price * selectedItem.quantity;
        data.order.items = data.order.items.filter((item) => item.itemRef.id !== id);
        renderOrder(footerSection, data.order);
    }
};

const decQuantityHandler = (event) => {
    event.preventDefault()
//HW5: optimize this code
//HW7: update and render the total
    let btnElement = event.target
    let id = +btnElement.dataset.id
    let selected = data.order.items.find(
        item => item.itemRef.id === id
    )
    if (selected.quantity > -5) {
        selected.quantity --
    }
    let input = document.querySelector(`input[data-id="${id}"][type="text"]`)
    input.value = selected.quantity
}
const incQuantityHandler = (event) => {
    event.preventDefault()
//HW5: optimize this code
//HW7: update and render the total
    let btnElement = event.target
    let id = +btnElement.dataset.id
    let selected = data.order.items.find(
        item => item.itemRef.id === id
    )
    if (selected.quantity < 5) {
        selected.quantity ++
    }
    let input = document.querySelector(`input[data-id="${id}"][type="text"]`)
    input.value = selected.quantity
}

const contentSection = document.getElementById("content")
const footerSection = document.getElementsByTagName("footer")[0]

renderMenuForm(contentSection, data.menu)
renderOrder(footerSection, data.order)