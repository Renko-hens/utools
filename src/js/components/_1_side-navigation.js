// File#: _1_side-navigation
// Usage: codyhouse.co/license
(function() {
  function initSideNav(nav) {
    nav.addEventListener('click', function(event){
      var btn = event.target.closest('.js-sidenav__sublist-control');
      if(!btn) return;
      var listItem = btn.parentElement,
        bool = Util.hasClass(listItem, 'sidenav__item--expanded');
      btn.setAttribute('aria-expanded', !bool);
      Util.toggleClass(listItem, 'sidenav__item--expanded', !bool);
    });
  };

	var sideNavs = document.getElementsByClassName('js-sidenav');
	if( sideNavs.length > 0 ) {
		for( var i = 0; i < sideNavs.length; i++) {
      (function(i){initSideNav(sideNavs[i]);})(i);
		}
  }
}());


// sidebar hide/show

const sidebar = document.querySelector(".utools-sidebar");
const mainMenuBtn = document.querySelector(".utools-main__button-menu");
const sidebarMenuBtn = document.querySelector(".utools-sidebar__button-menu");

if (window.innerWidth < 768) {
  sidebar.classList.add("utools-sidebar--hide");
} else {
  mainMenuBtn.classList.add("utools-main__button-menu--hide");
}

sidebarMenuBtn.addEventListener("click", ()=>{
  toggleSidebar();
});

mainMenuBtn.addEventListener("click", ()=>{
    toggleSidebar();
});

function toggleSidebar() {
  const isSidebarHide = sidebar.classList.contains("utools-sidebar--hide");

  if( isSidebarHide ){
    sidebar.classList.toggle("utools-sidebar--hide");  
    mainMenuBtn.classList.toggle("utools-main__button-menu--hide");
  } else {
    sidebar.classList.toggle("utools-sidebar--hide");  
    mainMenuBtn.classList.toggle("utools-main__button-menu--hide");
  }
};