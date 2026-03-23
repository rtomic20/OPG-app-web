import React, { createContext, useContext, useState } from 'react'

export interface CartItem {
  product_id: number
  product_name: string
  price: number
  unit: string
  quantity: number
  vendor_id: number
  vendor_name: string
  vendor_slug: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (product_id: number, quantity: number) => void
  removeItem: (product_id: number) => void
  clearCart: () => void
  total: number
  count: number
  vendorSlug: string | null
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  const vendorSlug = items.length > 0 ? items[0].vendor_slug : null

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Košarica može imati samo jedan vendor
      if (prev.length > 0 && prev[0].vendor_slug !== item.vendor_slug) {
        if (!confirm(`Košarica već sadrži proizvode od "${prev[0].vendor_name}". Isprazni košaricu i dodaj ovaj proizvod?`)) return prev
        return [item]
      }
      const existing = prev.find((i) => i.product_id === item.product_id)
      if (existing) {
        return prev.map((i) => i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
      return [...prev, item]
    })
  }

  const updateQty = (product_id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(product_id)
      return
    }
    setItems((prev) => prev.map((i) => i.product_id === product_id ? { ...i, quantity } : i))
  }

  const removeItem = (product_id: number) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, total, count, vendorSlug }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
