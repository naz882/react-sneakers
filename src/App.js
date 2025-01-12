import React from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorties';
import AppContext from './context';


function App() {

  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {

      const cartResponse = await axios.get('https://6778fb78482f42b62e901856.mockapi.io/cart')
      const favoritesReponse = await axios.get('https://6778fb78482f42b62e901856.mockapi.io/favorties')
      const itemsResponse = await axios.get('https://6778fb78482f42b62e901856.mockapi.io/items')
      setIsLoading(false)

      setCartItems(cartResponse.data)
      setFavorites(favoritesReponse.data)
      setItems(itemsResponse.data)

    }
    fetchData();
  }, []);

  const onAddToCart = (obj) => {
    console.log(obj)
    try {
      if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
        axios.delete(`https://6778fb78482f42b62e901856.mockapi.io/cart/${obj.id}`)
        setCartItems(prev => prev.filter((item) => Number(item.id) !== Number(obj.id)))
      } else {
        axios.post('https://6778fb78482f42b62e901856.mockapi.io/cart', obj)
        setCartItems((prev) => [...prev, obj])
      }

    } catch (error) {

    }
  }

  const onRemoveItem = (id) => {
    axios.delete(`https://6778fb78482f42b62e901856.mockapi.io/cart/${id}`)
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find(objFav => objFav.id === obj.id)) {
        axios.delete(`https://6778fb78482f42b62e901856.mockapi.io/favorties/${obj.id}`)
      } else {
        const { data } = await axios.post(`https://6778fb78482f42b62e901856.mockapi.io/favorties`, obj)
        setFavorites((prev) => [...prev, data])
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
    }


  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value)
  }

  return (
    <AppContext.Provider value={{ items, cartItems, favorites }}>
      <div className="wrapper clear">

        {cartOpened && <Drawer items={cartItems} onRemove={onRemoveItem} onClose={() => setCartOpened(false)} />}
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
        </Routes>


      </div>
    </AppContext.Provider>
  );
}

export default App;
