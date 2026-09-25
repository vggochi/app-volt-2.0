// ===============================
// VOLT GAMES APP
// ===============================

let currentCategory = "TODOS";

const products = [

{
id:1,
name:"EA Sports FC 26",
category:"PS5",
platform:"PS5",
price:299.90,
rating:4.9,
image:"https://img.youtube.com/vi/0GE8YCIQF2M/maxresdefault.jpg"
},

{
id:2,
name:"Marvel Spider-Man 2",
category:"PS5",
platform:"PS5",
price:349.90,
rating:5,
image:"https://m.media-amazon.com/images/S/aplus-media-library-service-media/9d439e09-a5cf-4582-8b1e-4272586515ff.__CR0,0,970,300_PT0_SX970_V1___.png"
},

{
id:3,
name:"God of War Ragnarök",
category:"PS5",
platform:"PS5",
price:299.90,
rating:4.9,
image:"https://dol.com.br/img/Artigo-Destaque/780000/GOW_00784214_0_.jpg?xid=2485001"
},

{
id:4,
name:"Gran Turismo 7",
category:"PS5",
platform:"PS5",
price:279.90,
rating:4.8,
image:"https://i.ytimg.com/vi_webp/uK-WhCRGpj0/maxresdefault.webp"
},

{
id:5,
name:"The Last of Us Part II",
category:"PS4",
platform:"PS4",
price:170.90,
rating:4.9,
image:"https://upload.wikimedia.org/wikipedia/pt/9/96/The_Last_of_Us_2_capa.png"
},



{
id:6,
name:"Grand Theft Auto V",
category:"PS4",
platform:"PS4",
price:129.90,
rating:4.8,
image:"https://www.notebookcheck.net/fileadmin/Notebooks/News/_nc3/grand_theft_auto_v_key_art_image_block_en_02_07aug2082.jpg"
},

{
id:7,
name:"Red Dead Redemption 2",
category:"PS4",
platform:"PS4",
price:199.90,
rating:4.9,
image:"https://www.europanet.com.br/upload/id_produto/60_____/6001304p.jpg"
},

{
id:8,
name:"Ghost of Tsushima",
category:"PS4",
platform:"PS4",
price:189.90,
rating:4.8,
image:"https://i0.wp.com/www.otakupt.com/wp-content/uploads/2020/07/Ghost-of-Tsushima-a-An%C3%A1lise-2.jpg?fit=1920%2C1080&ssl=1"
},

{
id:9,
name:"Horizon Forbidden West",
category:"PS4",
platform:"PS4",
price:179.90,
rating:4.7,
image:"https://t.ctcdn.com.br/9jkD3C8u0NF47vahxH2w2hG9JH8=/768x432/smart/i499600.png"
},

{
id:10,
name:"Mortal Kombat 11 Ultimate",
category:"PS4",
platform:"PS4",
price:149.90,
rating:4.7,
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWZUst2CyTtth9yISgeveqlUQgPrXkG_mTz-StrhgHsDT9cal5vDCZEM&s=10"
},



{
id:11,
name:"Forza Horizon 5",
category:"XBOX",
platform:"XBOX",
price:249.90,
rating:4.9,
image:"https://cdn.motor1.com/images/mgl/nAbR9R/s1/forza-horizon-5-e-o-proximo-jogo-da-microsoft-a-caminho-do-ps5.webp"
},

{
id:12,
name:"Halo Infinite",
category:"XBOX",
platform:"XBOX",
price:199.90,
rating:4.7,
image:"https://t.ctcdn.com.br/IjdNmEeTjBHfT0j8A1OYYmz6_x8=/1200x675/smart/i22582.jpeg"
},

{
id:13,
name:"Starfield",
category:"XBOX",
platform:"XBOX",
price:299.90,
rating:4.8,
image:"https://res.cloudinary.com/dewzjk72j/image/authenticated/s--BJbG5gh8--/v1/contentful/rporu91m20dc/29RKD8sjh0Du9XOh4fVEnw/46afaf74e1fe6e7fb5fd1a78e5af214a/LargeHero_SF_LaunchPrep_Banner.jpg"
},

{
id:14,
name:"Xbox Series X",
category:"XBOX",
platform:"XBOX",
price:3999.90,
rating:4.9,
image:"https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=900"
},



{
id:15,
name:"DualSense Wireless",
category:"CONTROLE",
platform:"PS5",
price:449.90,
rating:4.9,
image:"https://m.media-amazon.com/images/I/5102Pp-TfHL.jpg"
},

{
id:16,
name:"DualSense Edge",
category:"CONTROLE",
platform:"PS5",
price:999.90,
rating:5,
image:"https://fastshopbr.vtexassets.com/arquivos/ids/4402003/17727393395053.jpg?v=639096146778030000"
},

{
id:17,
name:"Xbox Wireless Controller",
category:"CONTROLE",
platform:"XBOX",
price:429.90,
rating:4.8,
image:"https://assets.xboxservices.com/assets/55/83/55836945-e141-4d47-9dad-21d902948816.jpg?n=111101_Gallery-0_1_1350x759.jpg"
},

{
id:18,
name:"Xbox Elite Controller Series 2",
category:"CONTROLE",
platform:"XBOX",
price:899.90,
rating:4.9,
image:"https://imperiallgames.com/wp-content/uploads/2022/09/core-branco-2.png "
},



{
id:19,
name:"HyperX Cloud III",
category:"HEADSET",
platform:"MULTI",
price:699.90,
rating:4.9,
image:"https://m.media-amazon.com/images/I/71AMEEP3HLL._AC_UF894,1000_QL80_.jpg"
},

{
id:20,
name:"Logitech G Pro X",
category:"HEADSET",
platform:"MULTI",
price:799.90,
rating:4.8,
image:"https://images7.kabum.com.br/produtos/fotos/102827/headset-gamer-logitech-g-pro-x-7-1-dolby-surround-981-000817_1744814719_gg.jpg"
},

{
id:21,
name:"Razer BlackShark V2 Pro",
category:"HEADSET",
platform:"MULTI",
price:999.90,
rating:4.8,
image:"https://www.adrenaline.com.br/wp-content/uploads/2024/04/BlackShark-V2-Pro-razer.jpg"
},

{
id:22,
name:"SteelSeries Arctis Nova 7",
category:"HEADSET",
platform:"MULTI",
price:899.90,
rating:4.9,
image:"https://images.ctfassets.net/hmm5mo4qf4mf/3Vcpa2CaH8NWUh3DTsZklg/845896fb34563cbe02d89bdb8107c3fb/arctis_nova_7p_white_pdp_img_buy_01.png__1920x1080_crop-fit_optimize_subsampling-2-214.png"
},



{
id:23,
name:"Gaming Keyboard RGB",
category:"GEAR",
platform:"GEAR",
price:289.90,
rating:4.7,
image:"https://s.zst.com.br/cms-assets/2023/09/melhor-teclado-capa-2.webp"
},

{
id:24,
name:"Mouse Logitech G Pro Wireless",
category:"GEAR",
platform:"GEAR",
price:699.90,
rating:4.9,
image:"https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900"
},

{
id:25,
name:"Mousepad Gamer XXL",
category:"GEAR",
platform:"GEAR",
price:129.90,
rating:4.6,
image:"https://altcustoms.com/cdn/shop/files/CrayGhost.jpg?v=1765149038&width=2048"
},

{
id:26,
name:"Base Carregadora DualSense",
category:"GEAR",
platform:"PS5",
price:159.90,
rating:4.7,
image:"https://m.magazineluiza.com.br/a-static/420x420/base-de-carregamento-do-controle-dualsense-para-ps5-sony-original/magazineluiza/233238100/bbeb66ff9c59c52ee84cfc758ee819b7.jpg"
},

{
id:27,
name:"Controle Arcade Fight Stick",
category:"CONTROLE",
platform:"MULTI",
price:599.90,
rating:4.8,
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhxeGjTht3BoAtcGvAiUsdL0flqXmkBAkhye-EvsVA2LPlomMcgHX-hz8&s=10"
},

{
id:28,
name:"Death Stranding 2",
category:"PS5",
platform:"PS5",
price:289.90,
rating:4.8,
image:"https://i0.wp.com/www.guiadoed.com.br/wp-content/uploads/2025/03/Death-Stranding-2.webp?fit=1013%2C567&ssl=1"
},

{
id:29,
name:"Minecraft",
category:"XBOX",
platform:"XBOX",
price:201.90,
rating:4.8,
image:"https://cms-assets.xboxservices.com/assets/53/6f/536f3aa5-424d-487a-a90c-957f93b32c17.jpg?n=Minecraft_Sneaky-Slider-1084_Ultimate-Collection_1600x675.jpg"
},

{
id:30,
name:"Monitor Gamer Curvo OLED",
category:"GEAR",
platform:"MULTI",
price:799.90,
rating:4.8,
image:"https://img.odcdn.com.br/wp-content/uploads/2023/08/odyssey-oled-g9.jpg"
},

{
id:31,
name:"Cyberpunk",
category:"PS4",
platform:"PS4",
price:300.00,
rating:4.8,
image:"https://img.odcdn.com.br/wp-content/uploads/2020/12/cyberpunk.png"
},

{
id:32,
name:"Hllow Knight",
category:"PS4",
platform:"PS4",
price:120.00,
rating:4.5,
image:"https://s2-techtudo.glbimg.com/GZJKFnHo4nNSyRgEozSDbecqCSM=/0x0:1918x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2022/6/R/CVYrtWSUGm0DMohJxbCg/hollow-knight.png"
},

{
id:33,
name:"Resident Evil: Requiem",
category:"PS5",
platform:"PS5",
price:150.90,
rating:4.9,
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMM2I5I0w9Xbe7VknoC9mmkxKqvKk-75tow2VHhc6LYh5aDlAbCuIKVIo&s=10"
},

{
id:34,
name:"Destiny 2",
category:"XBOX",
platform:"XBOX",
price:389.90,
rating:4.7,
image:"https://cdn1.epicgames.com/offer/428115def4ca4deea9d69c99c5a5a99e/EN_Bungie_D2_v950_OfferLandscape_S1_2560x1440_2560x1440-61cd46cb2d27e41f358293225ec354c8"
},

{
id:35,
name:"NBK27",
category:"PS5",
platform:"PS5",
price:456.90,
rating:4.7,
image:"https://external-preview.redd.it/news-nba-2k27-roadmap-courtside-report-get-a-first-look-at-v0-chToO5nPa-08kvSVxf7ls5-Vz2vKPRGvYgry_GIHIVs.jpeg?width=1080&crop=smart&auto=webp&s=fb630809251a5d5f8d520d59b622a3c3f73f7199"
},

{
id:36,
name:"Black Myth Wukong",
category:"XBOX",
platform:"XBOX",
price:499.90,
rating:4.9,
image:"https://uploads.alternativanerd.com.br/wp-content/uploads/2024/06/black-myth-wukong-trailer-de-acao-e-pre-venda-na-summer-game-fest-2024.jpg"
},

{
id:37,
name:"FarCry 4",
category:"PS4",
platform:"PS4",
price:129.90,
rating:4.8,
image:"https://cdn2.unrealengine.com/Diesel%2Fproductv2%2Ffar-cry-4%2Fhome%2FFC4_STD_Store_Landscape_2580x1450-2580x1450-d1f404cc7a8404f24f511a0159d2874560e4b522.jpg"
},

{
id:38,
name:"PlayStation 5",
category:"PS5",
platform:"PS5",
price:3999.00,
rating:5.0,
image:"https://tm.ibxk.com.br/2024/09/26/26103755213073.png"
},

{
id:39,
name:"PlayStation 4",
category:"PS4",
platform:"PS4",
price:2064.00,
rating:5.0,
image:"https://sm.ign.com/t/ign_br/review/p/ps4-pro-re/ps4-pro-review_c7v9.1280.jpg"
},


];





let cart =
JSON.parse(localStorage.getItem("volt_cart"))
|| [];




let user =
JSON.parse(localStorage.getItem("volt_user"))
|| null;






// ===============================
// RENDER PRODUTOS
// ===============================


function renderProducts(list = products){


const box = document.querySelector("#products");


box.innerHTML="";




list.forEach(product=>{


box.innerHTML += `


<div
onclick="openProduct(${product.id})"
class="
bg-[#0d1015]
border
border-white/10
rounded-3xl
overflow-hidden
cursor-pointer
hover:-translate-y-2
transition
"
>



<div class="relative">


<img
src="${product.image}"
class="
w-full
h-44
object-cover
"
/>


<span
class="
absolute
top-3
left-3
bg-volt
text-black
px-3
py-1
rounded-lg
text-xs
font-black
"
>

NOVO

</span>


</div>




<div class="p-4">


<p
class="
text-xs
text-gray-500
"
>

${product.platform}

</p>



<h3
class="
font-black
mt-2
"
>

${product.name}

</h3>



<div
class="
flex
justify-between
items-center
mt-5
"
>


<strong
class="
text-xl
"
>

${money(product.price)}

</strong>



<button
onclick="
event.stopPropagation();
addCart(${product.id})
"

class="
bg-volt
text-black
w-10
h-10
rounded-xl
font-black
"
>

+

</button>

<button

onclick="
event.stopPropagation();
toggleFavorite(${product.id})
"

class="
absolute
top-3
right-3
text-2xl
"

>

${favorites.includes(product.id)
? "❤️"
: "♡"}

</button>



</div>


</div>


</div>


`;



});


lucide.createIcons();


}

function showFavorites(){

const favProducts =
products.filter(product =>
favorites.includes(product.id)
);


renderProducts(favProducts);


document
.querySelector("#produtos")
.scrollIntoView({
behavior:"smooth"
});


}







// ===============================
// PRODUTO MODAL
// ===============================


function openProduct(id){


const product =
products.find(p=>p.id===id);



document.querySelector("#modal-product").innerHTML = `


<img
src="${product.image}"
class="
w-full
h-60
object-cover
rounded-2xl
">


<h2
class="
text-3xl
font-black
mt-5
"
>

${product.name}

</h2>


<p
class="
text-gray-400
mt-2
"
>

${product.platform}

</p>



<h3
class="
text-volt
text-3xl
font-black
mt-5
"
>

${money(product.price)}

</h3>



<button

onclick="addCart(${product.id})"

class="
w-full
mt-6
bg-volt
text-black
py-4
rounded-xl
font-black
"
>

Adicionar ao carrinho

</button>


`;



const modal =
document.querySelector("#product-modal");


modal.classList.remove("hidden");
modal.classList.add("flex");


}



function closeProductModal(){

document
.querySelector("#product-modal")
.classList.add("hidden");

}








// ===============================
// CARRINHO
// ===============================


function addCart(id){

const product = products.find(p=>p.id===id);


const existing = cart.find(
item=>item.id === id
);



if(existing){

existing.quantity++;

}else{


cart.push({

...product,

quantity:1

});


}



saveCart();

updateCart();

alert(
`${product.name} adicionado ⚡`
);


}




function openCart(){


renderCart();


document
.querySelector("#cart-modal")
.classList.remove("hidden");


document
.querySelector("#cart-modal")
.classList.add("flex");


}





function closeCart(){

document
.querySelector("#cart-modal")
.classList.add("hidden");

}





function renderCart(){

const box =
document.querySelector("#cart-items");


box.innerHTML="";


let total = 0;



cart.forEach((item,index)=>{


let subtotal =
item.price * item.quantity;


total += subtotal;



box.innerHTML += `

<div class="
bg-white/5
border
border-white/10
rounded-xl
p-4
flex
justify-between
items-center
">


<div>

<h3 class="font-bold">
${item.name}
</h3>


<p class="text-volt">
${money(subtotal)}
</p>


</div>



<div class="flex items-center gap-3">


<button
onclick="changeQuantity(${index},-1)"
class="
bg-white/10
w-8
h-8
rounded-lg
"
>
-
</button>



<span class="font-black">
${item.quantity}
</span>



<button
onclick="changeQuantity(${index},1)"
class="
bg-volt
text-black
w-8
h-8
rounded-lg
"
>
+
</button>



<button
onclick="removeCart(${index})"
class="
text-red-400
ml-3
"
>
✕
</button>


</div>


</div>

`;



});



document.querySelector("#cart-total")
.innerHTML =
money(total);



}

function changeQuantity(index,value){


cart[index].quantity += value;



if(cart[index].quantity <= 0){

cart.splice(index,1);

}



saveCart();

updateCart();

renderCart();


}



function removeCart(index){

cart.splice(index,1);

saveCart();

updateCart();

renderCart();

}




function updateCart(){


document.querySelector("#cart-count")
.innerHTML =
cart.length;


}





function saveCart(){

localStorage.setItem(
"volt_cart",
JSON.stringify(cart)
);

}

let favorites =
JSON.parse(
localStorage.getItem("volt_favorites")
)
|| [];

function toggleFavorite(id){


const exists =
favorites.includes(id);



if(exists){


favorites =
favorites.filter(
item=>item !== id
);


}else{


favorites.push(id);


}



localStorage.setItem(
"volt_favorites",
JSON.stringify(favorites)
);



renderProducts();


}





// ===============================
// LOGIN
// ===============================


function openLogin(){


const modal =
document.querySelector("#login-modal");


modal.classList.remove("hidden");

modal.classList.add("flex");


}





function login(){


const name =
document.querySelector("#user-name").value;


const email =
document.querySelector("#user-email").value;



user={
name,
email
};



localStorage.setItem(
"volt_user",
JSON.stringify(user)
);



alert(
`Bem vindo ${name} ⚡`
);



document
.querySelector("#login-modal")
.classList.add("hidden");


}

// ===============================
// FILTRO DE CATEGORIAS
// ===============================


document.querySelectorAll(".category").forEach(category => {


    category.addEventListener("click", (e)=>{


        e.preventDefault();


        const name = category
        .querySelector("span")
        .innerText
        .trim();



        let filter = [];



        if(name.includes("PlayStation 5")){

            filter = products.filter(product =>
                product.category === "PS5"
            );

        }



        else if(name.includes("PlayStation 4")){

            filter = products.filter(product =>
                product.category === "PS4"
            );

        }



        else if(name.includes("Xbox")){

            filter = products.filter(product =>
                product.category === "XBOX"
            );

        }



        else if(name.includes("Controles")){

            filter = products.filter(product =>
                product.category === "CONTROLE"
            );

        }



        else if(name.includes("Headsets")){

            filter = products.filter(product =>
                product.category === "HEADSET"
            );

        }



        else if(name.includes("Acessórios")){

            filter = products.filter(product =>
                product.category === "GEAR"
            );

        }



        renderProducts(filter);



        document
        .querySelector("#produtos")
        ?.scrollIntoView({
            behavior:"smooth"
        });


    });


});

function checkout(){

    if(cart.length === 0){

        alert("Seu carrinho está vazio ⚡");
        return;

    }


    let total = 0;


    cart.forEach(item=>{

        total += item.price;

    });



    const gerar = confirm(
`Pedido realizado com sucesso ⚡

Total da compra:
${money(total)}

Deseja gerar o comprovante PDF?`
    );


    if(gerar){

        gerarComprovante(total);

    }


    // limpa depois de gerar
    cart = [];

    saveCart();

    updateCart();

}


function gerarComprovante(total){

    try {

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF();


        pdf.setFontSize(22);
        pdf.text("VOLT GAMES", 20, 30);


        pdf.setFontSize(14);
        pdf.text(
            "Comprovante de Pedido",
            20,
            45
        );


        let y = 70;


        cart.forEach(item=>{

            pdf.text(
                `${item.name} - ${money(item.price)}`,
                20,
                y
            );

            y += 10;

        });



        pdf.setFontSize(18);

        pdf.text(
            `TOTAL: ${money(total)}`,
            20,
            y + 20
        );



        pdf.save("pedido-VOLT.pdf");


    } catch(error){

        console.log(error);

        alert(
            "Erro ao gerar PDF: " + error
        );

    }

}



// ===============================
// BUSCA
// ===============================


document
.querySelector("#search")
?.addEventListener(
"input",
(e)=>{


const value =
e.target.value.toLowerCase();



const filtered =
products.filter(p=>

p.name.toLowerCase()
.includes(value)

);



renderProducts(filtered);



});







function money(value){

return value.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
);

}






// START

renderProducts();

updateCart();