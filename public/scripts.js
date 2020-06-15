const currentPage = location.pathname
const menuItens = document.querySelectorAll("header .links a")

for (item of menuItens) {
    if(currentPage == item.getAttribut("href")){
        item.classList.add("active")
    }
}