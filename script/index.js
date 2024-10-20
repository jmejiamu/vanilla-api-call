document.addEventListener("DOMContentLoaded", async () => {
  // Fetch and display products on page load
  try {
    const products = await fetchProducts();
    products.forEach(addProductToDOM);
    toggleNoProductsMessage();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
});

document
  .getElementById("productForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const image =
      document.getElementById("image").value || "https://picsum.photos/200/200";

    if (name && price && image) {
      // Call function to add product to the server
      try {
        const newProduct = await addProduct({ name, price, image });
        if (newProduct) {
          addProductToDOM(newProduct);
          toggleNoProductsMessage();
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }

      // Clear form fields
      document.getElementById("productForm").reset();
    }
  });

// Function to fetch products from the server
async function fetchProducts() {
  const response = await fetch("http://localhost:3000/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

// Function to add a product to the server
async function addProduct(product) {
  const response = await fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to add product");
  }

  return response.json();
}

// Function to add a product to the DOM
function addProductToDOM(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");

  productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <p>${product.name}</p>
          <p>$${product.price}</p>
          <button class="delete-btn" data-id="${product.id}">🗑️</button>
      `;

  document.querySelector(".products").appendChild(productCard);

  // Add delete functionality
  productCard
    .querySelector(".delete-btn")
    .addEventListener("click", async () => {
      try {
        await deleteProduct(product.id);
        productCard.remove();
        toggleNoProductsMessage();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    });
}

// Function to delete a product from the server
async function deleteProduct(productId) {
  console.log("🚀 ~ deleteProduct ~ productId:", productId);
  const response = await fetch(`http://localhost:3000/products/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
}

// Function to show or hide the "No products available" message
function toggleNoProductsMessage() {
  const productsContainer = document.querySelector(".products");
  const noProductsMessage = document.querySelector(".no-products-message");
  if (productsContainer.children.length === 0) {
    noProductsMessage.style.display = "block";
  } else {
    noProductsMessage.style.display = "none";
  }
}
