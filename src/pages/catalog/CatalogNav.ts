import { Category } from '@commercetools/platform-sdk';
import { getCategories } from '@utils/apiRequests';
import BaseComponent from '@utils/baseComponent';
import { safeQuerySelector } from '@utils/safeQuerySelector';

const classNames = {
  categoriesContainer: ['w-96', 'h-16', 'relative', 'p-3', 'max-lg:w-1/2'],
  catalogNavigation: [
    'catalog-nav',
    'menu',
    'rounded-box',
    'w-56',
    'bg-base-200',
    'absolute',
    'z-10',
    'left-1/2',
    '-translate-x-1/2',
    'max-sm:w-64',
  ],
  categoryItem: ['category-item'],
  categoryLink: ['category-link'],
  categorySublist: ['category-sublist', 'hidden', 'block'],
  itemTitleContainer: ['justify-items-end'],
  itemTitleButton: ['category-button', 'btn', 'btn-xs', 'max-w-min'],
  breadcrumb: ['breadcrumbs', 'text-sm', 'w-full'],
  breadcrumbLink: ['breadcrumb-link'],
};

export class CatalogNav {
  public categoriesContainer = new BaseComponent({ tagName: 'div', classNames: classNames.categoriesContainer });
  public catalogNavigation = new BaseComponent({ tagName: 'ul', classNames: classNames.catalogNavigation });
  public breadcrumb = new BaseComponent({ tagName: 'div', classNames: classNames.breadcrumb });
  public currentCategoryId = '';
  private categoriesInfo: Category[] = [];
  private categoriesParentsId: string[] = [];
  constructor() {
    this.setCategoriesInfo()
      .then(() => {
        this.categoriesParentsId = [
          ...new Set(this.categoriesInfo.map((item) => item.parent?.id ?? '').filter((item) => item)),
        ];
        this.createCategoriesNav();
        this.createBreadcrumb();
        window.addEventListener('click', (e) => {
          const target = e.target;
          if (target && target instanceof HTMLElement) {
            const navElement = target.closest('.catalog-nav');
            const listElement = safeQuerySelector('ul', this.catalogNavigation.getNode());
            if (!navElement && !listElement.classList.contains('hidden')) {
              listElement.classList.add('hidden');
            }
          }
        });
      })
      .catch(console.log);
  }

  public async setCategoriesInfo(): Promise<void> {
    await getCategories().then((data) => {
      this.categoriesInfo = data.body.results;
    });
  }

  private createCategoriesNav(): void {
    const categoriesParent = this.categoriesInfo.filter((item) => !item.parent);
    const mainCategory = this.createParentItemNav('', 'All', categoriesParent);
    safeQuerySelector('li a', mainCategory.getNode()).classList.add('font-bold', 'text-primary');
    this.catalogNavigation.append(mainCategory);
    this.categoriesContainer.append(this.catalogNavigation);
  }

  private createItemNav(category: Category): BaseComponent<'li'> {
    const isParent = this.isCategoryParent(category.id);
    if (isParent) {
      const children = this.getCategoryChildren(category.id);
      return this.createParentItemNav(category.id, category.name.ru ?? '', children);
    } else {
      const item = new BaseComponent({
        tagName: 'li',
        classNames: classNames.categoryItem,
        attributes: { 'data-id': category.id },
      });
      const itemLink = new BaseComponent({
        tagName: 'a',
        classNames: classNames.categoryLink,
        textContent: category.name.ru,
      });
      item.append(itemLink);
      return item;
    }
  }

  private createParentItemNav(categoryId: string, categoryName: string, children: Category[]): BaseComponent<'li'> {
    const item = new BaseComponent({
      tagName: 'li',
      classNames: classNames.categoryItem,
      attributes: {
        'data-id': categoryId,
      },
    });
    const itemTitleContainer = new BaseComponent({ tagName: 'div', classNames: classNames.itemTitleContainer });
    const itemTitleLink = new BaseComponent({
      tagName: 'a',
      classNames: classNames.categoryLink,
      textContent: categoryName,
    });
    const itemTitleButton = new BaseComponent({
      tagName: 'button',
      classNames: classNames.itemTitleButton,
      textContent: '▼',
    });
    const itemList = new BaseComponent({ tagName: 'ul', classNames: classNames.categorySublist });
    children.forEach((child) => {
      const itemChild = this.createItemNav(child);
      itemList.append(itemChild);
    });
    itemTitleContainer.appendChildren([itemTitleLink, itemTitleButton]);
    item.appendChildren([itemTitleContainer, itemList]);

    return item;
  }

  private getCategoryChildren(categoryId: string): Category[] {
    return this.categoriesInfo.filter((item) => item.parent?.id === categoryId);
  }

  private isCategoryParent(categoryId: string): boolean {
    return this.categoriesParentsId.includes(categoryId);
  }

  public categoryClickHandler(e: Event): boolean {
    const target = e.target;
    if (target instanceof HTMLElement) {
      const categoryElement = target.closest<HTMLElement>('.category-item');
      if (target.classList.contains('category-button')) {
        const categorySubList = categoryElement?.querySelector('.category-sublist');
        categorySubList?.classList.toggle('hidden');
      } else if (categoryElement) {
        this.currentCategoryId = categoryElement.getAttribute('data-id') ?? '';
        this.setCurrentCategory();
        return true;
      }
    }
    return false;
  }

  private setCurrentCategory(): void {
    document.querySelectorAll('.category-link').forEach((link) => link.classList.remove('font-bold', 'text-primary'));
    safeQuerySelector(
      `.category-item[data-id='${this.currentCategoryId}'] a`,
      this.catalogNavigation.getNode(),
    ).classList.add('font-bold', 'text-primary');
    this.createBreadcrumb(this.getCategoryInfo(this.currentCategoryId));
  }

  private createBreadcrumb(category?: Category): void {
    this.breadcrumb.clearInnerHTML();
    const breadcrumbList = new BaseComponent({ tagName: 'ul' });
    const breadcrumbCatalog = this.createBreadcrumbItem();
    const breadcrumbCategory = category ? this.createBreadcrumbItem(category) : undefined;
    const breadcrumbParentCategories = category ? this.getParentCategories(category).reverse() : [];
    breadcrumbList.appendChildren([breadcrumbCatalog, ...breadcrumbParentCategories]);
    breadcrumbCategory && breadcrumbList.append(breadcrumbCategory);
    this.breadcrumb.append(breadcrumbList);
  }

  private createBreadcrumbItem(category?: Category): BaseComponent<'li'> {
    const breadcrumbItem = new BaseComponent({ tagName: 'li' });
    const breadcrumbItemLink = new BaseComponent({
      tagName: 'a',
      textContent: category ? category.name.ru : 'Catalog',
      attributes: {
        'data-id': category ? category.id : '',
      },
      classNames: classNames.breadcrumbLink,
    });
    breadcrumbItem.append(breadcrumbItemLink);

    return breadcrumbItem;
  }

  private getParentCategories(category: Category): BaseComponent<'li'>[] {
    const parentCategories = [];
    let categoryParent = category.parent;
    while (categoryParent) {
      const categoryInfo = this.getCategoryInfo(categoryParent.id);
      parentCategories.push(this.createBreadcrumbItem(categoryInfo));
      categoryParent = categoryInfo?.parent;
    }
    return parentCategories;
  }

  private getCategoryInfo(categoryId: string): Category | undefined {
    return this.categoriesInfo.find((item) => item.id === categoryId);
  }

  public breadcrumbClickHandler(e: Event): boolean {
    const target = e.target;
    if (target instanceof HTMLElement) {
      const categoryElement = target.closest<HTMLElement>('.breadcrumb-link');
      if (categoryElement) {
        this.currentCategoryId = categoryElement.getAttribute('data-id') ?? '';
        console.log(categoryElement);
        this.setCurrentCategory();
        return true;
      }
    }
    return false;
  }
}
