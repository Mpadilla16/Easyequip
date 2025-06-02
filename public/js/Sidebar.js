const menu = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');

menu.addEventListener('click',()=>{
    sidebar.classList.toggle('menu-toggle');
});