import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { Bucket as BucketModel } from "./components/models/bucket";
import { Catalog } from "./components/models/catalog";
import { Buyer } from "./components/models/buyer";
import { LarekAPI } from "./components/LarekApi";
import { Bucket as BucketView } from "./components/View/Bucket";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { CardBasket } from "./components/View/CardBucket";
import { ContactsForm } from "./components/View/ContactsForm";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { OrderForm } from "./components/View/OrderForm";
import { Page } from "./components/View/Page";
import { Success } from "./components/View/Success";
import "./scss/styles.scss";
import { IBuyer, IOrderRequest, IProduct } from "./types";
import { API_URL } from "./utils/constants";
import { cloneTemplate } from "./utils/utils";

// --- ИНИЦИАЛИЗАЦИЯ ---

const events = new EventEmitter();

const bucketModel = new BucketModel(events);
const buyerModel = new Buyer(events);
const catalogModel = new Catalog(events);

const api = new Api(API_URL);
const larekApi = new LarekAPI(api);

const page = new Page(document.body);
const modal = new Modal(document.querySelector("#modal-container") as HTMLElement, events);
const header = new Header(document.querySelector(".header") as HTMLElement, events);

const previewView = new CardPreview(cloneTemplate("#card-preview"), events);
const bucketView = new BucketView(cloneTemplate("#basket"), events);
const orderForm = new OrderForm(cloneTemplate("#order") as HTMLFormElement, events);
const contactsForm = new ContactsForm(cloneTemplate("#contacts") as HTMLFormElement, events);
const successView = new Success(cloneTemplate("#success"), events);

/**
 * Рендеринг элементов корзины
 */
const renderBasketItems = (products: IProduct[]): HTMLElement[] => {
  return products.map((product, index) => {
    const card = new CardBasket(cloneTemplate("#card-basket"), events, {
      onDelete: () => bucketModel.removeProduct(product.id)
    } as any);
    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1
    } as any);
  });
};

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// 1. Клик по карточке в каталоге
events.on("card:select", (product: IProduct) => {
  catalogModel.setSelectedProduct(product);
});

// 2. Реакция на выбор товара в модели (РЕАКТИВНОЕ ОТКРЫТИЕ)
events.on("card:selected", (product: IProduct) => {
  const inBasket = bucketModel.hasProduct(product.id);
  modal.render({
    content: previewView.render({ 
        ...product, 
        inBasket 
    } as any)
  });
  modal.open();
});

// 3. Добавление/удаление товара из превью
events.on("card:toggle", () => {
  // Получаем продукт из модели (инкапсуляция)
  const product = catalogModel.getSelectedProduct();
  if (product) {
    if (bucketModel.hasProduct(product.id)) {
      bucketModel.removeProduct(product.id);
    } else {
      bucketModel.addProduct(product);
    }
  }
  modal.close();
});

// 4. Обновление интерфейса корзины
events.on("basket:changed", (data: { products: IProduct[]; total: number }) => {
  header.count = data.products.length;
  const basketItems = renderBasketItems(data.products);
  bucketView.render({
    items: basketItems,
    total: data.total
  });
});

// 5. Открытие корзины
events.on("header:basket", () => {
  modal.render({
    content: bucketView.render()
  });
  modal.open();
});

// 6. Оформление заказа (Оплата и адрес)
events.on("basket:order", () => {
  const data = buyerModel.getData();
  const { errors } = buyerModel.validate();
  
  // Расчет валидности только для текущего шага
  const orderErrors = [errors.payment, errors.address].filter(Boolean);

  modal.render({
    content: orderForm.render({
      payment: data.payment,
      address: data.address,
      valid: orderErrors.length === 0,
      errors: orderErrors
    } as any)
  });
});

// 7. Изменение данных в формах
events.on("order:change", (data: Partial<IBuyer>) => {
  buyerModel.updateData(data);
});

events.on("contacts:change", (data: Partial<IBuyer>) => {
  buyerModel.updateData(data);
});

// 8. Реакция модели на изменения (валидация)
events.on("buyer:changed", () => {
  const data = buyerModel.getData(); // Оптимизация: получаем данные 1 раз
  const { errors } = buyerModel.validate();

  // Раздельная валидация для первой формы
  const orderErrors = [errors.payment, errors.address].filter(Boolean);
  orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: orderErrors.length === 0,
    errors: orderErrors
  } as any);

  // Раздельная валидация для второй формы
  const contactErrors = [errors.email, errors.phone].filter(Boolean);
  contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: contactErrors.length === 0,
    errors: contactErrors
  } as any);
});

// 9. Переход к контактам
events.on("order:submit", () => {
  const data = buyerModel.getData();
  const { errors } = buyerModel.validate();
  const contactErrors = [errors.email, errors.phone].filter(Boolean);

  modal.render({
    content: contactsForm.render({
      email: data.email,
      phone: data.phone,
      valid: contactErrors.length === 0,
      errors: contactErrors
    } as any)
  });
});

// 10. Отправка заказа
events.on("contacts:submit", async () => {
  const buyerData = buyerModel.getData();
  const basketItems = bucketModel.getProducts();

  const orderData: IOrderRequest = {
    ...buyerData,
    items: basketItems.map((item) => item.id),
    total: bucketModel.getTotalPrice(),
  };

  try {
    const response = await larekApi.sendOrder(orderData);
    bucketModel.clear();
    buyerModel.clear();
    modal.render({
      content: successView.render({ total: response.total })
    });
  } catch (error) {
    console.error(error);
  }
});

events.on("success:close", () => modal.close());

// 11. Отрисовка каталога
events.on("catalog:changed", (data: { products: IProduct[] }) => {
  const cards = data.products.map((product) => {
    const card = new CardCatalog(cloneTemplate("#card-catalog"), events, {
      onClick: () => events.emit("card:select", product)
    });
    // Используем render с данными для работы сеттеров category и image
    return card.render(product);
  });
  page.catalog = cards;
});

// СТАРТ
larekApi.getProducts()
  .then((products) => catalogModel.setProducts(products))
  .catch(console.error);