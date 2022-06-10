const form = document.querySelector("form"),
  createBtn = document.getElementById("create-btn"),
  titleInp = document.getElementById("title"),
  priceInp = document.getElementById("price"),
  taxesInp = document.getElementById("taxes"),
  addsInp = document.querySelector("#adds"),
  discountInp = document.getElementById("discount"),
  countInp = document.getElementById("count"),
  categoryInp = document.getElementById("category"),
  total = document.getElementById("total"),
  table = document.getElementById("table"),
  tableBody = document.querySelector("#table-body"),
  deleteAll = document.getElementById("delete-all"),
  btns = document.querySelector(".btns");

class Product {
  constructor(id, title, price, taxes, adds, discount, category) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.taxes = taxes;
    this.adds = adds;
    this.discount = discount;
    this.category = category;
    this.total = +this.price + +this.taxes + +this.adds - +this.discount;
  }

  toLocalStorage() {
    let products = JSON.parse(localStorage.products);
    products.push(this);
    localStorage.products = JSON.stringify(products);
  }
}

// Disable Form
form.onsubmit = function (e) {
  let count = countInp.value || 1;
  for (let i = 0; i < count; i++) {
    let lastProducts = JSON.parse(localStorage.products);
    let lastProduct = lastProducts[lastProducts.length - 1];
    let id = null;
    if (lastProduct !== undefined) {
      id = lastProduct.id + 1;
    } else {
      id = 0;
    }
    // New Product Object
    let product = new Product(
      id,
      titleInp.value,
      priceInp.value,
      taxesInp.value,
      addsInp.value,
      discountInp.value,
      categoryInp.value
    );
    product.toLocalStorage();
  }
  // functions
  updateProducts();
  emptyInputs();
  setTotal();

  createBtn.setAttribute("value", "Create");
  return false;
};

// Check If Local Storage Has Products
if (localStorage.products === undefined) {
  localStorage.products = JSON.stringify([]);
} else {
  updateProducts();
}

// Delete All Products
deleteAll.addEventListener("click", function () {
  localStorage.products = JSON.stringify([]);
  updateProducts();
});

// Update Products Function
function updateProducts() {
  // Delete Products
  tableBody.innerHTML = "";
  // Add New Products
  let products = JSON.parse(localStorage.products);
  for (let i of products) {
    let LiEl = document.createElement("li");
    LiEl.className = "product";
    let total = +i.price + +i.adds + +i.taxes - +i.discount;
    LiEl.innerHTML = `
        <span>${i.id}</span>
        <span>${i.title}</span>
        <span>${i.price}</span>
        <span>${i.taxes}</span>
        <span>${i.adds}</span>
        <span>${i.discount}</span>
        <span>${total}</span>
        <span>${i.category}</span>
        <span>
          <button class="update" type="button">update</button>
        </span>
        <span><button class="delete" type="button">delete</button> </span>
        `;
    tableBody.append(LiEl);
  }

  updateDeleteAllValue();
  deleteProductOnClick();
  updateValues();
}

// Set Empty Values To Inputs
function emptyInputs() {
  form.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
}

// Set Total Element To Default
function setTotal() {
  total.textContent = "";
  total.parentNode.classList.remove("input");
}

// Update Num Inside Delete All Button
function updateDeleteAllValue() {
  deleteAll.firstElementChild.textContent = JSON.parse(
    localStorage.products
  ).length;
}

// Delete Product On Delete Button Click
function deleteProductOnClick() {
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.onclick = function () {
      let id = btn.parentNode.parentNode.firstElementChild.textContent;
      let products = JSON.parse(localStorage.products);
      let newProducts = products.filter((e) => e.id !== +id);
      localStorage.products = JSON.stringify(newProducts);
      updateProducts();
    };
  });
}

// Update Total Value
document.querySelectorAll(".price").forEach(function (inp) {
  inp.oninput = function () {
    let totalVal =
      +priceInp.value + +addsInp.value + +taxesInp.value - +discountInp.value;
    if (totalVal === 0) {
      total.textContent = "Free";
      total.parentNode.classList.remove("input");
    } else {
      total.textContent = totalVal;
      total.parentNode.classList.add("input");
    }
  };
});

// Update Products Values
function updateValues() {
  let updateBtns = document.querySelectorAll(".update");
  updateBtns.forEach((btn) => {
    btn.onclick = function () {
      let id = +btn.parentNode.parentNode.firstElementChild.textContent;
      let products = JSON.parse(localStorage.products);
      let obj = products.find((e) => e.id === id);
      let createBtnClone = createBtn.cloneNode();
      // Delete Update Btns
      document.querySelectorAll(".update-btn").forEach((e) => e.remove());

      let updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.className = "btn update-btn";
      btns.prepend(updateBtn);
      document.querySelectorAll("#create-btn").forEach((e) => e.remove());
      [
        titleInp.value,
        priceInp.value,
        taxesInp.value,
        addsInp.value,
        discountInp.value,
        categoryInp.value,
      ] = [
        obj.title,
        obj.price,
        obj.taxes,
        obj.adds,
        obj.discount,
        obj.category,
      ];
      updateBtn.onclick = function () {
        // Update Values
        [
          obj.title,
          obj.price,
          obj.taxes,
          obj.adds,
          obj.discount,
          obj.category,
        ] = [
          titleInp.value,
          priceInp.value,
          taxesInp.value,
          addsInp.value,
          discountInp.value,
          categoryInp.value,
        ];
        let newProducts = products.map((prod) => {
          if (prod.id === id) {
            return obj;
          }
          return prod;
        });
        // Update Products In Local Storage
        localStorage.products = JSON.stringify(newProducts);
        // functions
        updateProducts();
        emptyInputs();
        setTotal();

        // Replace Buttons
        form.append(createBtnClone);
        this.remove();
      };
    };
  });
}
