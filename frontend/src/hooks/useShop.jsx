"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, getErrorMessage, clearToken } from "@/lib/api";
import { logoutRequest } from "@/lib/auth";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const [favourites, setFavourites] = useState([]);
  const [favouritesLoading, setFavouritesLoading] = useState(false);

  const refreshUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      return res.data.user;
    } catch {
      setUser(null);
      clearToken();
      return null;
    } finally {
      setUserLoading(false);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    setCartLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart);
    } catch {
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  }, []);

  const refreshFavourites = useCallback(async () => {
    setFavouritesLoading(true);
    try {
      const res = await api.get("/favourites");
      setFavourites(res.data.favourites ?? []);
    } catch {
      setFavourites([]);
    } finally {
      setFavouritesLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshCart();
      refreshFavourites();
    } else {
      setCart(null);
      setFavourites([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      if (!user) {
        const err = new Error("Please log in to add items to your cart.");
        err.status = 401;
        throw err;
      }
      const res = await api.post("/cart/items", { productId, quantity });
      setCart(res.data.cart);
      return res.data.cart;
    },
    [user],
  );

  const updateCartItem = useCallback(async (productId, quantity) => {
    const res = await api.put(`/cart/items/${productId}`, { quantity });
    setCart(res.data.cart);
    return res.data.cart;
  }, []);

  const removeCartItem = useCallback(async (productId) => {
    const res = await api.delete(`/cart/items/${productId}`);
    setCart(res.data.cart);
    return res.data.cart;
  }, []);

  const clearCartItems = useCallback(async () => {
    const res = await api.delete("/cart");
    setCart(res.data.cart);
    return res.data.cart;
  }, []);

  const toggleFavourite = useCallback(
    async (productId) => {
      if (!user) {
        const err = new Error("Please log in to save favourites.");
        err.status = 401;
        throw err;
      }
      const isFavourited = favourites.some((f) => f.product?._id === productId);
      if (isFavourited) {
        await api.delete(`/favourites/${productId}`);
        setFavourites((prev) =>
          prev.filter((f) => f.product?._id !== productId),
        );
      } else {
        await api.post(`/favourites/${productId}`);
        await refreshFavourites();
      }
    },
    [user, favourites, refreshFavourites],
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setCart(null);
    setFavourites([]);
  }, []);

  const cartCount = useMemo(
    () => (cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const favouriteProductIds = useMemo(
    () => new Set(favourites.map((f) => f.product?._id).filter(Boolean)),
    [favourites],
  );

  const value = useMemo(
    () => ({
      user,
      userLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      refreshUser,
      cart,
      cartCount,
      cartLoading,
      refreshCart,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCartItems,
      favourites,
      favouriteProductIds,
      favouritesLoading,
      refreshFavourites,
      toggleFavourite,
      logout,
    }),
    [
      user,
      userLoading,
      refreshUser,
      cart,
      cartCount,
      cartLoading,
      refreshCart,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCartItems,
      favourites,
      favouriteProductIds,
      favouritesLoading,
      refreshFavourites,
      toggleFavourite,
      logout,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within a ShopProvider");
  return ctx;
}
