// Select elements from form
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Select list items
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")


// Capture input event to format valyue
amount.oninput = () => {
  // obtain current value of input and remove non numeric characters
  let value = amount.value.replace(/\D/g, "")
  
  // convert value to cents
  value = Number(value) / 100

  // update value
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL (value) {
  // format value to BRL 
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
  return value
}

// Capture event submit to obtain values
form.onsubmit = (event) => {
  // prevent default behavior of submit
  event.preventDefault()

  // creatte new object with info of expense
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date(),
  }

  // call function to add item to the list
  expenseAdd(newExpense)
}

// Add item to list
function expenseAdd(newExpense){
  try{
    // create li element to add to ul
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // create icon to category
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // create expense info
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // create expense name
    const expenseName = document.createElement("strong")
    expenseName.textContent =  newExpense.expense

    // create expense category
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Add name and category to expense div info
    expenseInfo.append(expenseName, expenseCategory)

    // create expense value
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
    .toUpperCase()
    .replace("R$", "")}`

    // create remove icon
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remove")
    
    // Add inside elements to Item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Add item to list
    expenseList.append(expenseItem)

    // clean forms to add new item
    formClear()

    // update totals
    updateTotals()

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

// Update total
function updateTotals(){
  try {
    // recover item (li) from list (ul)
    const items = expenseList.children
    
    // update quantity of items
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // variable to increment total
    let total = 0

    // goes through list items 
    for(let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      // removes non numeric characters and substitute , for .
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      // converts value to float
      value = parseFloat(value)

      if(isNaN(value)) {
        return alert ("Não foi possível calcular o total. O valor não parece ser um número")
      }

      // increments the total
      total += Number(value)
    }

    // create span to add R$ formated
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // format value and remove the R$ that will be displayed by the small with a style
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // clean the content of 
    expensesTotal.innerHTML = ""

    // Add symbol of currency and the total
    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
  }
}

// Event to capture clicks on list and remove item
expenseList.addEventListener("click", function(event) {
  // checks if the click was on the remove img
  if (event.target.classList.contains("remove-icon")) {
    // obtain the li father of the clicked element
    const item = event.target.closest(".expense")
    
    // remove item from list
    item.remove()

    // update the total
    updateTotals()
  }
})

// Function to clear the input 
function formClear(){
  // clean input
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}