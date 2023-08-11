function renderNavUI(): string {
  return `  <div class="navbar bg-base-100">
  <div class="navbar-start">
    <div class="dropdown">
      <label tabindex="0" class="btn btn-ghost lg:hidden">${renderBurgerSVG()}</label>
      <ul tabindex="0" class="nav__list-start menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
      </ul>
    </div>
    <a class="navbar__link-logo btn btn-ghost normal-case text-xl"><div class="navbar__logo"></div>COMFORTO</a>
  </div>
  <div class="navbar-center hidden lg:flex">
    <ul class="nav__list-center menu menu-horizontal px-1">
    </ul>
  </div>
  <div class="navbar-end">
    <div class="flex-none">
      <ul class="nav__list-end menu menu-horizontal px-1">
        <li>
          <details>
            <summary>
              <div class="indicator">
                ${renderUserSVG()}
              </div>
            </summary>
            <ul class="nav__sublist-end p-2 bg-base-100 right-0 navbar__user-list">
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
</div>`;
}

function renderBurgerSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
</svg>`;
}

function renderBagSVG(): string {
  return `<svg class="h-5 w-5" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.375 9.58739V8.37489C9.375 5.56239 11.6375 2.79989 14.45 2.53739C17.8 2.21239 20.625 4.84989 20.625 8.13739V9.86239" stroke="#151411" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11.25 27.5H18.75C23.775 27.5 24.675 25.4875 24.9375 23.0375L25.875 15.5375C26.2125 12.4875 25.3375 10 20 10H10C4.66253 10 3.78753 12.4875 4.12503 15.5375L5.06253 23.0375C5.32503 25.4875 6.22503 27.5 11.25 27.5Z" stroke="#151411" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M19.3691 15H19.3803" stroke="#151411" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10.6181 15H10.6294" stroke="#151411" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function renderUserSVG(): string {
  return `<svg class="h-5 w-5" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 15C18.4518 15 21.25 12.2018 21.25 8.75C21.25 5.29822 18.4518 2.5 15 2.5C11.5482 2.5 8.75 5.29822 8.75 8.75C8.75 12.2018 11.5482 15 15 15Z" stroke="#151411" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M25.7377 27.5C25.7377 22.6625 20.9252 18.75 15.0002 18.75C9.07519 18.75 4.2627 22.6625 4.2627 27.5" stroke="#151411" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>`;
}

export { renderNavUI, renderBagSVG };
