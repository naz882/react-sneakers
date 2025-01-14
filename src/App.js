import React from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorties';
import AppContext from './context';
import Orders from './pages/Orders';



function App() {

  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      // Сделать try cat + promise all
      try {
        const [cartResponse, favoritesReponse, itemsResponse] = await Promise.all([
          axios.get('https://6778fb78482f42b62e901856.mockapi.io/cart'),
          axios.get('https://6778fb78482f42b62e901856.mockapi.io/favorties'),
          axios.get('https://6778fb78482f42b62e901856.mockapi.io/items')
        ])
        setCartItems(cartResponse.data)
        setFavorites(favoritesReponse.data)
        setItems(itemsResponse.data)
      } catch (error) {
        alert('Ошибка при запросе данных ;(')
        console.error(error);
      }

    }
    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
        setCartItems(prev => prev.filter((item) => Number(item.id) !== Number(obj.id)))
        await axios.delete(`https://6778fb78482f42b62e901856.mockapi.io/cart/${obj.id}`)
      } else {
        setCartItems((prev) => [...prev, obj])
        await axios.post('https://6778fb78482f42b62e901856.mockapi.io/cart', obj)
      }

    } catch (error) {
      alert('Ошибка при добавлении в корзину')
      console.error(error);
    }
  }

  const onRemoveItem = async (id) => {
    try {
      await axios.delete(`https://6778fb78482f42b62e901856.mockapi.io/cart/${id}`)
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      alert('Ошибка при удалении из корзины')
      console.error(error);
    }

  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find(objFav => Number(objFav.id) === Number(obj.id))) {
        axios.delete(`https://6778fb78482f42b62e901856.mockapi.io/favorties/${obj.id}`)
        setFavorites(prev => prev.filter((item) => Number(item.id) !== Number(obj.id)))
      } else {
        const { data } = await axios.post(`https://6778fb78482f42b62e901856.mockapi.io/favorties`, obj)
        setFavorites((prev) => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
      console.error(error);
    }


  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id));
  }

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems
      }}>
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onRemove={onRemoveItem}
          onClose={() => setCartOpened(false)}
          opened={cartOpened}
        />
        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route path="/" element={<Home
            items={items}
            cartItems={cartItems}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToFavorite={onAddToFavorite}
            onAddToCart={onAddToCart}
            isLoading={isLoading}

          />} />
          <Route path="/favorites" element={<Favorites
            onAddToFavorite={onAddToFavorite} />} />

          <Route path="/orders" element={<Orders />} />
        </Routes>


      </div>
    </AppContext.Provider>
  );
}

export default App;
