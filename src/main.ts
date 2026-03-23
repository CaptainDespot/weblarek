import "./scss/styles.scss";
import { Products } from "./components/base/models/catalog";
import { Buyer } from "./components/base/models/buyer";
import { Bucket } from "./components/base/models/bucket";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/base/Api";
import { LarekAPI } from "./components/base/LarekApi";
import { API_URL } from "./utils/constants";

const productsModel = new Products();
productsModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога:", productsModel.getProducts());
console.log("Получение одного товара по id:", productsModel.getProductsById("854cef69-976d-4c2a-a18c-2aa45046c390"));
productsModel.setSelectedProduct(apiProducts.items[0]);
console.log("Выбранный товар:", productsModel.getSelectedProducts());

const buyerModel = new Buyer();
buyerModel.updateData({
});
console.log("Данные о покупателе :", buyerModel.getData());
console.log("Валидация заполнения данных о покупателе", buyerModel.validate());
buyerModel.updateData({
  payment: 'card',
  email: 'test@test.com',
  phone: '88888888',
  address: 'Rostov'
})
console.log("Получаем данные о покупателе после заполнения всех необходимых полей: ", buyerModel.getData());
buyerModel.clear();
console.log('Проверяем данные о покупателе после очистки данных: ', buyerModel.getData());

const cartModel = new Bucket();
cartModel.addProduct({
  id: '001',
  title: 'Товар 1',
  description: 'лучший товар',
  image: './img/pic-1.jpg',
  category: 'топ товары',
  price: 1000
});
cartModel.addProduct({
  id: '002',
  title: 'Товар 2',
  description: 'лучший товар',
  image: './img/pic-2.jpg',
  category: 'топ товары',
  price: null
});
cartModel.addProduct({
  id: '003',
  title: 'Товар 3',
  description: 'лучший товар',
  image: './img/pic-3.jpg',
  category: 'топ товары',
  price: 500
});
console.log("Получаем товары из корзины: ", cartModel.getProducts());
cartModel.removeProduct('002');
console.log("Удалили Товар 2 из корзины: ", cartModel.getProducts());
console.log("Получаем общую сумму товаров в корзине: ", cartModel.getTotalPrice());
console.log("Получаем количество товаров в корзине: ", cartModel.getCount());
console.log("Проверяем наличие Товара 3 в корзине по id: ", cartModel.hasProduct('003'));
console.log("Проверяем наличие Товара 2 в корзине по id: ", cartModel.hasProduct('002'));
cartModel.clear();
console.log("Товары в корзине после очистки: ", cartModel.getProducts());

const api = new Api(API_URL);
const apiService = new LarekAPI(api);
const productsApiModel = new Products();

try {
  const products = await apiService.getProducts();
  productsApiModel.setProducts(products);;

  console.log(
    "Каталог товаров из модели:",
    JSON.stringify(productsApiModel.getProducts(), null, 2)
  );
} catch (error) {
  console.error('Ошибка при получении товаров:', error);
}