const products = [
  {id:1,name:"Cloud Sofa",category:"Seating",detail:"Olive weave · 3 seater",price:849,art:"sofa",tag:"Bestseller"},
  {id:2,name:"Sunday Lounge Chair",category:"Seating",detail:"Natural oak · Soft linen",price:329,art:"chair",tag:"Slow living"},
  {id:3,name:"Forma Coffee Table",category:"Tables",detail:"Warm oak · Round",price:189,art:"table",tag:""},
  {id:4,name:"Arc Floor Lamp",category:"Lighting",detail:"Sand shade · Oak base",price:129,art:"lamp",tag:"New"},
  {id:5,name:"Everyday Sideboard",category:"Storage",detail:"Natural oak · Two doors",price:459,art:"storage",tag:""},
  {id:6,name:"Gather Dining Table",category:"Tables",detail:"Solid oak · Seats four",price:549,art:"dining",tag:"Made for moments"}
];
const money = value => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(value);
let category="All", cart={};
try {const saved=JSON.parse(localStorage.getItem("haven-cart")||"{}");for(const p of products)if(Number.isInteger(saved[p.id])&&saved[p.id]>0&&saved[p.id]<=99)cart[p.id]=saved[p.id];}catch{}
const $ = id=>document.getElementById(id);
function renderProducts(){
  let list=products.filter(p=>(category==="All"||p.category===category)&& (p.name+" "+p.detail+" "+p.category).toLowerCase().includes($("search").value.toLowerCase()));
  if($("sort").value==="low")list.sort((a,b)=>a.price-b.price);
  if($("sort").value==="high")list.sort((a,b)=>b.price-a.price);
  $("empty").hidden=list.length>0;
  $("products").innerHTML=list.map(p=>`<article class="product"><div class="product-art"><img src="${p.art}.svg" alt="Illustration of ${p.name}">${p.tag?`<span class="tag">${p.tag}</span>`:""}</div><div class="product-info"><div><h3>${p.name}</h3><p>${p.detail}</p></div><button class="add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div><span class="price">${money(p.price)}</span></article>`).join("");
}
function renderCart(){
  const items=products.filter(p=>cart[p.id]);
  $("count").textContent=items.reduce((sum,p)=>sum+cart[p.id],0);
  $("total").textContent=money(items.reduce((sum,p)=>sum+p.price*cart[p.id],0));
  $("cart-items").innerHTML=items.length?items.map(p=>`<div class="cart-row"><img src="${p.art}.svg" alt=""><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity"><button data-change="${p.id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button><span>${cart[p.id]}</span><button data-change="${p.id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button></div></div><button class="remove" data-remove="${p.id}">Remove</button></div>`).join(""):"<p>Your bag is empty. Find something you love.</p>";
  $("checkout").disabled=!items.length;
  $("order-message").textContent="";
  try{localStorage.setItem("haven-cart",JSON.stringify(cart));}catch{}
}
let toastTimer;
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");
  if(add){const id=add.dataset.add;cart[id]=Math.min(99,(cart[id]||0)+1);renderCart();$("toast").textContent="Added to your bag";$("toast").classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>$("toast").classList.remove("visible"),1800);}
  const filter=e.target.closest("[data-category]");
  if(filter){category=filter.dataset.category;document.querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b===filter));renderProducts();}
  const change=e.target.closest("[data-change]");
  if(change){const id=change.dataset.change;cart[id]=Math.min(99,cart[id]+Number(change.dataset.delta));if(cart[id]<=0)delete cart[id];renderCart();}
  const remove=e.target.closest("[data-remove]");if(remove){delete cart[remove.dataset.remove];renderCart();}
});
$("search").addEventListener("input",renderProducts);
$("sort").addEventListener("change",renderProducts);
$("cart-open").addEventListener("click",()=>$("cart").showModal());
$("cart-close").addEventListener("click",()=>$("cart").close());
$("checkout").addEventListener("click",()=>{$("order-message").textContent="Your demo bag is ready! No order has been submitted and no payment has been taken.";});
renderProducts();renderCart();
