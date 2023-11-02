const socket = io();

const productForm = document.getElementById("product-form");

productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("titleId");
    const description = document.getElementById("descriptionId");
    const price = document.getElementById("priceId");
    const code = document.getElementById("codeId");
    const stock = document.getElementById("stockId");
    const prod = {
        "title": title.value,
        "description": description.value,
        "price": price.value,
        "code": code.value,
        "stock": stock.value
    };
    socket.emit("product", prod);
    title.value = "";
    description.value = "";
    price.value = "";
    code.value = "";
    stock.value = "";
    alert(`Se creó el producto ${prod.title}. Puede chequearlo en la lista debajo.`);
});

socket.on("products", ({ products }) => {
    const productList = document.getElementById("product-list");
    productList.innerText = "";
    products.forEach((product) => {
        const productDiv = document.createElement("div");
        productList.appendChild(productDiv);
        const title = document.createElement("p");
        title.innerText = `Nombre: ${product.title}`;
        productDiv.appendChild(title);
        const description = document.createElement("p");
        description.innerText = `Descripción: ${product.description}`;
        productDiv.appendChild(description);
        const price = document.createElement("p");
        price.innerText = `Precio: $${product.price}`;
        productDiv.appendChild(price);
        const code = document.createElement("p");
        code.innerText = `Código: ${product.code}`;
        productDiv.appendChild(code);
        const stock = document.createElement("p");
        stock.innerText = `Stock: ${product.stock}`;
        productList.appendChild(stock);
        productList.appendChild(document.createElement("hr"));
    });
});