const fetchLibrary = "https://api.itbook.store/1.0/new"
const bookProducts =document.querySelectorAll(".book-products-center")
const lastVisitContiner = document.querySelector(".last-visit-continer")
const buttonLastVisit = document.querySelector(".button-last-visit")
const bookRightFlash = document.querySelectorAll(".book-products-right-flash")
const bookLefttFlash = document.querySelectorAll(".book-products-left-flash")
const searchButton = document.querySelector(".search-button")
const searchInput = document.querySelector("#search-input-banner")
const searchInputHeader = document.querySelector("#search-input-header")
const searchBoxContainer = document.querySelector(".search-box-container")
const searchBoxContainerHeader = document.querySelector(".search-box-container-header")
const overlySearch = document.querySelector("#overly-search")
const overlySearchHeader = document.querySelector("#overly-search-header")
const hamburgerMenu= document.querySelector(".hamburger-menu")
const body = document.body
const menu = document.querySelector(".menu")
const menuRight = document.querySelector(".menu-right")
const menuLeft = document.querySelector(".menu-left")
const menuLeftExit = document.querySelector(".menu-left-exit")
const menuRightExit = document.querySelector(".menu-right-exit")
const overlyMenu = document.querySelector(".overly-menu")
const itemLeft = document.querySelectorAll(".item-left")
const itemRight = document.querySelectorAll(".item-right")
const menuRightTitle = document.querySelector(".menu-right-title h3")
const StoryTypesRight = document.querySelector("#Story-Types-right")
const FeaturedBooksRight = document.querySelector("#Featured-Books-right")
const literaryAwardsDiv = document.querySelector('#Literary-Awards-right');
const worldLiteratureDiv = document.querySelector('#World-Literature-right');
const recommendedPackagesDiv = document.querySelector('#Recommended-Packages-right');
const culturalProductsDiv = document.querySelector('#Cultural-Products-right');
let resultSearch = document.querySelector("#result-search-banner")
let resultSearchHeader= document.querySelector("#result-search-header")
let inputValue ;
let cartsArr = [];

//!classssssss

class fetchAndShow{
  constructor(apiUrl){
    this.fetchLibrary=apiUrl
    this.bookProducts =document.querySelectorAll(".book-products-center")
    this.cartsArr=[];
  }

  async  fetchAndShowBook(){
  
   try{
     const response = await fetch(this.fetchLibrary)
    if(!response.ok) throw new Error(`خطای HTTP! وضعیت: ${response.status}`);

    const data = await response.json()

    this.bookProducts.forEach((bookProduct)=>{
        data.books.forEach(book=> {
        const cartDiv = document.createElement("div")
        cartDiv.classList.add("cart")

        const specifications = document.createElement("div")//توضیحات
        specifications.classList.add("Specifications")

        const imageDiv = document.createElement("div")
        imageDiv.classList.add("image")
        const img = document.createElement("img")
        img.setAttribute("src",book.image)
        img.setAttribute("alt",book.title)
        imageDiv.appendChild(img)

        const textDiv = document.createElement("div")
        textDiv.classList.add("text")
        const h2Elm =document.createElement("h2")
        h2Elm.textContent = `${book.title?book.title :""}`
        const pElm = document.createElement("p")
        pElm.textContent = `${book.subtitle?book.subtitle:"The title is not available"}`
        textDiv.append(h2Elm,pElm)

        specifications.append(imageDiv,textDiv)//توضیحات کامل شد

        const lineDiv = document.createElement("div")//خط  حدا کننده
        lineDiv.classList.add("line")

        const priceDiv = document.createElement("div")//قیمت  ها 
        priceDiv.classList.add("price")


        const priceFinalDiv = document.createElement("div")
        priceFinalDiv.classList.add("price-final")
        priceFinalDiv.textContent=`${book.price?book.price:"The price is not available"}`

        priceDiv.append(priceFinalDiv);//قیمت ها کامل شد

        const aElm = document.createElement("a")
        aElm.setAttribute("href",book.url)
        aElm.setAttribute("target","_blank")
        const buttonElm = document.createElement("button")
        buttonElm.classList.add("buttom-cart")
        buttonElm.textContent=`view book`
        aElm.appendChild(buttonElm)

       cartDiv.append(specifications, lineDiv, priceDiv,aElm);
        bookProduct.append(cartDiv)
             
      });
    })


     this.bookProducts.forEach((bookProductDiv) => {
                bookProductDiv.querySelectorAll(".cart").forEach(cartElm => {
                    let h2Cart = cartElm.querySelector(".text h2"); // مسیر را دقیق‌تر کردیم
                    let pCart = cartElm.querySelector(".text p");   // مسیر را دقیق‌تر کردیم

                    if (h2Cart) {
                        this.cartsArr.push(h2Cart);
                    }
                    if (pCart) {
                        this.cartsArr.push(pCart);
                    }
                });
            });


  
  
   }catch(err){
    console.log(err)
      }
   
    }
  getCartsArr(){
    return this.cartsArr
  }  
}

const fetchBook =  new fetchAndShow("https://api.itbook.store/1.0/new")
fetchBook.fetchAndShowBook().then(() => {
    // حالا که fetchBook.cartsArr پر شده است، آن را به تابع‌های handleSearch ارسال می‌کنیم
    handleSearch(searchInput, resultSearch, fetchBook.getCartsArr());
    handleSearch(searchInputHeader, resultSearchHeader, fetchBook.getCartsArr());
}).catch(error => {
    console.error("Error initializing search functionality:", error);
});

class creatLastVisitItem{
  constructor(e){
    this.e = e
    this. lastVisitContiner=document.querySelector(".last-visit-continer")
  }

  createLastVisitedItemAdd(element){
   if(this.e.target.classList.contains("buttom-cart")){
    
    let cartElm = this.e.target.closest(".cart")
    if(!cartElm){
      console.error("Clicked element is not inside a .cart container.")
      return;
    }

    let imageCart = cartElm.querySelector(".image img")
    let imgElmCart = imageCart?imageCart.cloneNode(true):null;

    const imageEnterSrc = imgElmCart ?imgElmCart.src: "" ;
    const existingImage = this.lastVisitContiner.querySelectorAll(".last-visit-item-image img")
    let isDuplicate = false;
    if(existingImage&&imageEnterSrc){
      existingImage.forEach((item)=>{
        if(item.src === imageEnterSrc && imageEnterSrc !==""){
          isDuplicate = true
        }
      })
    }
    if(isDuplicate){
      console.log("کتاب تکراری است.")
      return;
    }

    let h2TextCart = cartElm.querySelector(".text h2")
    let h2ElmCart =h2TextCart?h2TextCart.cloneNode(true):null;

    let pTextCart = cartElm.querySelector(".text p")
    let pElmCart = pTextCart?pTextCart.cloneNode(true):null;

    
    const lastVisitDiv = document.createElement("div")
    lastVisitDiv.classList.add("last-visit-item")

    const lastVisitImgDiv = document.createElement("div")
    lastVisitImgDiv.classList.add("last-visit-item-image")
    if(imgElmCart){
        lastVisitImgDiv.appendChild(imgElmCart)
    }else{
      console.error("Photo not found");
    }

    const lastVisitTextDiv = document.createElement("div")
    lastVisitTextDiv.classList.add("last-visit-item-text")
    if(pElmCart&&h2ElmCart){
        lastVisitTextDiv.append(pElmCart,h2ElmCart)
    }else{
      console.error("text not found");
    }

    lastVisitDiv.append(lastVisitImgDiv,lastVisitTextDiv)
    if(this.lastVisitContiner){
         this.lastVisitContiner.appendChild(lastVisitDiv)//اضافه به دام
    }
  }
 }
}


document.addEventListener("click",(e)=>{
new creatLastVisitItem(e).createLastVisitedItemAdd()


   if(e.target.classList.contains("overly-search-show")){
    console.log(e.target)
    body.classList.remove("no-scroll")
    overlySearch.classList.remove("overly-search-show")
    searchBoxContainer.classList.remove("search-box-container-show")
    resultSearch.classList.add("result-search")
    resultSearch.classList.remove("result-search-show")
  
   }
   if(e.target.classList.contains("overly-search-show-header")){ //شرط اینپوت هدر گداشته شد
     body.classList.remove("no-scroll")
    overlySearchHeader.classList.remove("overly-search-show-header")
     searchBoxContainerHeader.classList.remove("search-box-container-header-show")
    searchBoxContainerHeader.classList.add(".search-box-container-header")
    resultSearchHeader.classList.add("result-search")
    resultSearchHeader.classList.remove("result-search-show")
   }
   if (menu.classList.contains("menu-show")) {
    if (!menu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
      toggleManu();
     overlyMenu.classList.toggle("overly-menu-show")
    }
  }
  
})

buttonLastVisit.addEventListener("click",()=>{
  if(lastVisitContiner){
    while(lastVisitContiner.firstChild){
      lastVisitContiner.removeChild(lastVisitContiner.firstChild)
    }
  }
})

bookRightFlash.forEach((flash)=>{

  flash.addEventListener("click",(e)=>{
  let clickRight = e.target
  let selectBookProductGrPa =  clickRight.closest(".book-products")
  let selectBookCenter = selectBookProductGrPa.querySelector(".book-products-center")
  selectBookCenter.scrollBy({
    left:50,
    behavior:"smooth",
  })
  
     })

})
bookLefttFlash.forEach((flash)=>{

  flash.addEventListener("click",(e)=>{
  let clickRight = e.target
  let selectBookProductGrPa =  clickRight.closest(".book-products")
  let selectBookCenter = selectBookProductGrPa.querySelector(".book-products-center")
  selectBookCenter.scrollBy({
    left:-50,
    behavior:"smooth",
  })
  
     })

})

function svgBookFainallArrived(item){
  let svg = item.querySelector("svg")

      svg.style.background="transparent"
      svg.addEventListener("mouseenter",()=>{
         svg.style.background="transparent"
      })

      svg.addEventListener("mouseleave",()=>{
        svg.style.background="transparent"
      })
}

function svgBookToScroll(item){
   let svg = item.querySelector("svg")
        svg.addEventListener("mouseenter",()=>{
         svg.style.background="#adadad"
      })

      svg.addEventListener("mouseleave",()=>{
        svg.style.background="transparent"
      })
}

bookProducts.forEach((bookCenter)=>{
  bookCenter.addEventListener("scroll",()=>{
  let scrollLeftBook =  bookCenter.scrollLeft;
  let clientWidthBook = bookCenter.clientWidth;
  let scrollWidthBook = bookCenter.scrollWidth;
  const tolerance = 2;

  if(scrollLeftBook+clientWidthBook >=scrollWidthBook-tolerance){//به راست رسید

    bookRightFlash.forEach((item) => {
      svgBookFainallArrived(item);
    }); 

    // bookLefttFlash.forEach((item)=>{
    //   svgBookFainallArrived(item);
    // })

  }else if(scrollLeftBook===0){
     bookLefttFlash.forEach((item)=>{
      svgBookFainallArrived(item);
    })

  }else {

    bookRightFlash.forEach((item) => {
      svgBookToScroll(item);
    })

    bookLefttFlash.forEach((item)=>{
      svgBookToScroll(item);
    })
  }
})
})

overlySearch.addEventListener("click",(e)=>{
  if(e.target.classList.contains("search-input")){
     overlySearch.classList.add("overly-search-show")
    searchBoxContainer.classList.add("search-box-container-show")
    body.classList.add("no-scroll")
   
  }
   
})

overlySearchHeader.addEventListener("click",(e)=>{//روی اینپوت هدر تعریف شد
  if(e.target.classList.contains("search-input")){
    e.stopPropagation()
     overlySearchHeader.classList.add("overly-search-show-header")
    searchBoxContainerHeader.classList.add("search-box-container-header-show")
    searchBoxContainerHeader.classList.remove(".search-box-container-header")
    body.classList.add("no-scroll")
   
  }
   
})

function handleSearch(inputElement, resultElement, allBooksTexts) {
    inputElement.addEventListener("input", (e) => {
        resultElement.classList.remove("result-search");
        resultElement.classList.add("result-search-show");

        let inputValue = e.target.value;
        if (inputValue.length > 0) {
            // نرمال‌سازی ورودی برای جستجوی بدون حساسیت به حروف کوچک و بزرگ

            let normalizedInputValue = inputValue.toLowerCase().trim();

            // نیازی به split و forEach روی کلمات نیست مگر اینکه بخواهید هر کلمه را جداگانه جستجو کنید
            // برای جستجوی عبارت کامل یا بخشی از آن:
            filterbook(normalizedInputValue, allBooksTexts, resultElement);
        } else {
            // اگر ورودی خالی شد، نتایج جستجو را پاک کنید و پنل را مخفی کنید
            resultElement.textContent = "";
            resultElement.classList.add("result-search");
            resultElement.classList.remove("result-search-show");
        }
    });
}

function filterbook(textInputsearch, ArrBooksText, result) {

    result.textContent = ""; // محتوای قبلی را پاک کنید

    let bookFiltered = ArrBooksText.filter((bookElement) => {
        
        const text = bookElement ? bookElement.textContent : '';
        return text.toLowerCase().includes(textInputsearch);
    });

    if (bookFiltered.length === 0 && textInputsearch.length > 0) {
        const noResultDiv = document.createElement("div");
        noResultDiv.classList.add("no-result-message"); // برای استایل دادن
        noResultDiv.textContent = "نتیجه‌ای یافت نشد.";
        result.appendChild(noResultDiv);
    } else {
        bookFiltered.forEach((bookElement) => {
            let cart = bookElement.closest(".cart");
            if (cart) {
                let cartNode = cart.cloneNode(true);
                result.appendChild(cartNode);
            }
        });
    }
}

handleSearch(searchInput,resultSearch);
handleSearch(searchInputHeader,resultSearchHeader)

function toggleManu(){
  hamburgerMenu.classList.toggle("menu-active")
  menu.classList.toggle("menu-show")
  document.body.classList.toggle('no-scroll');
}

hamburgerMenu.addEventListener("click",(e)=>{
  toggleManu();
  overlyMenu.classList.toggle("overly-menu-show")
})

menuLeftExit.addEventListener("click",()=>{
  toggleManu();
  overlyMenu.classList.toggle("overly-menu-show")
})

function hideAllitemRight(){
  itemRight.forEach((item)=>{
      if(item.classList.contains("item-right-show")){
        item.classList.remove("item-right-show")
      }
    })
}

function clickMenuRightExit(){
    menuRightExit.addEventListener("click",()=>{
      menuLeft.style.display="flex"
      menuRight.classList.remove("menu-right-respons-show")
    })
}

function clickItemLeft(){
  itemLeft.forEach((item)=>{
  item.addEventListener("click",(e)=>{

   const width = window.innerWidth
   if(width<=999){
    menuLeft.style.display="none";
    menuRight.classList.add("menu-right-respons-show")
    clickMenuRightExit();
   }
   hideAllitemRight();
   menuRightTitle.textContent = e.target.textContent.trim()

   console.log(e.target.id)
    switch(e.target.id){

      case "Story-Types-left":
        StoryTypesRight.classList.add("item-right-show")
        break;
      case "Featured-Books-left":
        FeaturedBooksRight.classList.add("item-right-show")
        break;
      case "Literary-Awards-left":
        literaryAwardsDiv.classList.add("item-right-show")
        break;
      case "World Literature-left":
        worldLiteratureDiv.classList.add("item-right-show")
        break;
      case "Recommended Packages-left":
        recommendedPackagesDiv.classList.add("item-right-show")
        break;
      case "Cultural Products-left":
        culturalProductsDiv.classList.add("item-right-show")
        break;
      default:
        hideAllitemRight();
        break;
    }
  })
  })
}

function menuOnResize(){
   const width = window.innerWidth
  if(width<=999){
    menu.classList.remove("menu-show")
    menu.classList.add("menu-show-response")
    menuLeft.classList.add("menu-left-response")
    menuRight.classList.add("menu-right-respons")
    menuRightExit.classList.add("menu-right-exit-show")
    clickItemLeft();
  }else if(width>=1000){
    menu.classList.remove("menu-show-response")
    menuLeft.classList.remove("menu-left-response")
    menuRight.classList.remove("menu-right-respons")
    menuRightExit.classList.remove("menu-right-exit-show")
    if(overlyMenu.classList.contains("overly-menu-show")){
        menu.classList.add("menu-show") 
    }
    clickItemLeft();
  }
}

window.addEventListener("resize",()=>{
  menuOnResize();
})

document.addEventListener("DOMContentLoaded",()=>{
 menuOnResize();
 bookLefttFlash.forEach((item)=>{
 svgBookFainallArrived(item);
 })
}
 )