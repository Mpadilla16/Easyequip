const menu = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main');

menu.addEventListener('click',()=>{
    sidebar.classList.toggle('menu-toggle');
    main.classList.toggle('menu-toggle');
});