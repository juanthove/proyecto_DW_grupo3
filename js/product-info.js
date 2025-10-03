// product-info.js — versión simplificada y funcional
const productId = localStorage.getItem("product-id");
if (!productId) {
  console.warn("No product-id en localStorage. Volviendo al index.");
  window.location.href = "index.html";
}

const PRODUCT_URL = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
const COMMENTS_URL = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;

let productInfo = null;
let comments = []; // siempre un array

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // obtener producto
    const prodResp = await getJSONData(PRODUCT_URL);
    if (prodResp.status !== "ok") throw new Error("No se pudo cargar el producto");
    productInfo = prodResp.data;

    // obtener comentarios
    const comResp = await getJSONData(COMMENTS_URL);
    if (comResp.status === "ok") {
      const d = comResp.data;
      // la API puede devolver [array] o array directo; normalizamos a array
      comments = Array.isArray(d) && Array.isArray(d[0]) ? d[0].slice() : (Array.isArray(d) ? d.slice() : []);
    } else {
      comments = [];
    }

    // si hay comentarios guardados localmente para este producto, los ponemos primero (opcional)
    try {
      const saved = JSON.parse(localStorage.getItem(`comentarios_local_${productId}`));
      if (Array.isArray(saved)) comments = saved.concat(comments);
    } catch (e) { /* ignore */ }

    // renderizar
    renderImages();
    renderProductInfo();
    renderRelated();
    renderComments();

    // inicializar formulario (si existe)
    initForm();

  } catch (err) {
    console.error("Error cargando datos:", err);
    const cont = document.getElementById("card-container");
    if (cont) cont.innerHTML = `<div class="alert alert-danger">No se pudo cargar la información del producto.</div>`;
  }
});

/* ---------- render functions (sencillas) ---------- */

function renderImages() {
  if (!productInfo || !productInfo.images) return;
  const el = document.getElementById("carousel-img-insert");
  if (!el) return;
  el.innerHTML = productInfo.images.map((src, i) =>
    `<div class="carousel-item ${i === 0 ? "active" : ""}"><img class="img-thumbnail d-block w-100" src="${escapeHtml(src)}" alt="img"></div>`
  ).join("");
}

function renderProductInfo() {
  if (!productInfo) return;
  setText("product-name", productInfo.name);
  setText("product-price", `${productInfo.currency} ${productInfo.cost}`);
  setText("product-sold-count", `Vendidos: ${productInfo.soldCount}`);
  setText("product-description", productInfo.description);
  setText("product-category", productInfo.category);
}

function renderRelated() {
  if (!productInfo || !productInfo.relatedProducts) return;
  const target = document.getElementById("productosRelacionados");
  if (!target) return;
  // simple: string HTML
  target.innerHTML = productInfo.relatedProducts.map(p =>
    `<div class="list-group-item text-center" style="cursor:pointer" onclick="selectProduct(${p.id})">
       <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="img-thumbnail" style="max-width:140px">
       <div class="mt-2">${escapeHtml(p.name)}</div>
     </div>`
  ).join("");
}

// función global para el onclick (muy simple)
window.selectProduct = function(id) {
  localStorage.setItem("product-id", id);
  window.location.href = "product-info.html";
};

function renderComments() {
  // si existe el contenedor moderno
  const list = document.getElementById("lista-comentarios");
  if (list) {
    if (!Array.isArray(comments) || comments.length === 0) {
      list.innerHTML = `<div class="text-muted">Aún no hay comentarios.</div>`;
      return;
    }
    list.innerHTML = comments.map(c => {
      const stars = "★".repeat(c.score || 0) + "☆".repeat(5 - (c.score || 0));
      return `<div class="card mb-2">
                <div class="card-body">
                  <div class="d-flex justify-content-between"><strong>${escapeHtml(c.user || "Usuario")}</strong><small class="text-muted">${escapeHtml(c.dateTime || "")}</small></div>
                  <div class="mb-2 text-warning">${stars}</div>
                  <p class="mb-0">${escapeHtml(c.description || "")}</p>
                </div>
              </div>`;
    }).join("");
    return;
  }

  // fallback: rellenar los 3 divs individuales si no se usa #lista-comentarios
  if (comments && comments.length > 0) {
    const c = comments[0];
    setText("comment-score", `Puntuación: ${c.score || ""}`);
    setText("comment-dateTime", c.dateTime || "");
    setText("comment-description", `${c.user || ""}: ${c.description || ""}`);
  } else {
    setText("comment-description", "Aún no hay comentarios.");
  }
}

/* ---------- formulario (opcional, solo si existe en tu HTML) ---------- */
function initForm() {
  const form = document.getElementById("comment-form");
  if (!form) return;
  const txt = document.getElementById("commentText");
  const sel = document.getElementById("commentScore");
  if (!txt || !sel) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = txt.value.trim();
    const score = parseInt(sel.value, 10);
    if (!text || !score) return;

    const nuevo = {
      user: "Anónimo",
      description: text,
      score: score,
      dateTime: new Date().toLocaleString()
    };

    comments.unshift(nuevo); // lo ponemos primero
    // persistir local por producto (opcional pero útil)
    try { localStorage.setItem(`comentarios_local_${productId}`, JSON.stringify(comments)); } catch (e) {}
    renderComments();
    form.reset();
  });
}

/* ---------- util helpers ---------- */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
