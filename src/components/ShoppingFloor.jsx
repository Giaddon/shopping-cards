import { useEffect, useMemo, useRef, useState } from "react";
import ShoppingCard from "./ShoppingCard";
import Checkout from "./Checkout";
import Price from "../classes/Price";

const productsData = [
  {
    id: "01",
    title: "HydroPlus Facial Cream",
    description: "A tsunami of moisture for your skin.",
    price: new Price(1899),
  },
  {
    id: "02",
    title: "Blackest Night Lipstick",
    description: "When you want to show the darkness inside.",
    price: new Price(1459),
  },
  {
    id: "03",
    title: "Total Eclipse Sunscreen",
    description: "Like a bulletproof vest for sun bullets.",
    price: new Price(2000),
  },
  {
    id: "04",
    title: "Magical Girl Foot Scrub",
    description: "Isekai yourself into a world of pure comfort.",
    price: new Price(2376),
  },
  {
    id: "05",
    title: "High Noon Eye Shadow",
    description: "Is this town is big enough for you?",
    price: new Price(1562),
  },
  {
    id: "06",
    title: "Rock Solid Foundation",
    description: "A sturdy base for your face empire.",
    price: new Price(3220),
  },
]

export default function ShoppingFloor({ }) {
  const floor = useRef(null);
  const checkout = useRef(null);
  const [limit, setLimit] = useState({ top: -Infinity, right: Infinity, bottom: Infinity, left: -Infinity });
  const [checkoutRect, setCheckoutRect] = useState(null);
  const [products, setProducts] = useState(productsData)
  const [isCheckoutHovered, setIsCheckoutHovered] = useState(false);
  const [isPurchaseComplete, setIsPurchaseComplete] = useState(false);
  const checkoutProducts = products.filter(product => product.inCheckout)

  useEffect(() => {
    window.addEventListener("cardenterscheckout", onCardEntersCheckout);
    window.addEventListener("cardexitscheckout", onCardExitsCheckout);
    window.addEventListener("removeproduct", onRemoveProduct);
    window.addEventListener("carddroppedincheckout", onCardDroppedInCheckout);
    return () => {
      window.removeEventListener("cardenterscheckout", onCardEntersCheckout);
      window.removeEventListener("cardexitscheckout", onCardExitsCheckout);
      window.removeEventListener("removeproduct", onRemoveProduct);
      window.removeEventListener("carddroppedincheckout", onCardDroppedInCheckout);
    }
  })

  useEffect(() => {
    if (floor.current) {
      const rect = floor.current.getBoundingClientRect();
      setLimit(rect)
    }
    return
  }, [floor])

  useEffect(() => {
    if (checkout.current) {
      setCheckoutRect(checkout.current.getBoundingClientRect())
    }
    () => setCheckoutRect(null);
  }, [checkout])

  function handleMouseDown(e) {
  }

  function handleMouseUp(e) {

  }

  function onCardDroppedInCheckout(e) {
    const targetProduct = products.find(product => product.id === e.detail.id);
    targetProduct.inCheckout = true;
    setProducts(oldProducts => [...oldProducts.filter(product => product.id !== e.detail.id), targetProduct])
    setIsCheckoutHovered(false);
  }

  function onCardEntersCheckout(e) {
    setIsCheckoutHovered(true);
  }

  function onCardExitsCheckout(e) {
    setIsCheckoutHovered(false);
  }

  function onRemoveProduct(e) {
    const targetProduct = products.find(product => product.id === e.detail.id);
    targetProduct.inCheckout = false;
    setProducts(oldProducts => [...oldProducts.filter(product => product.id !== e.detail.id), targetProduct])
  }

  function onCheckout() {
    setIsPurchaseComplete(true);
  }

  function onResetStore() {
    setProducts(oldProducts => oldProducts.map(product => ({ ...product, inCheckout: false })))
    setIsPurchaseComplete(false);
  }

  if (isPurchaseComplete) {
    return (
      <div className="rounded-lg bg-indigo-200 h-[36rem] p-4 text-white text-center flex flex-col justify-center gap-1 animate-fade-in">
        <h1 className="text-5xl font-semibold">Purchase Complete!</h1>
        <p className="text-xl">Thank you for shopping at our exclusive pop-up event!</p>
        {checkoutProducts.map(product => <p key={product.id}>{product.title} &bull; ${product.price.display()}</p>)}
        <p className="text-xl">Total &bull; ${new Price(checkoutProducts.reduce((sum, product) => product.price.cents + sum, 0)).display()}</p>
        <button onClick={onResetStore} className="bg-green-400 rounded-lg text-lg">Return to store</button>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg bg-indigo-200 h-[36rem] flex items-center justify-end p-4"
      ref={floor}
    >
      {products.map(product => <ShoppingCard key={product.id} limit={limit} product={product} checkoutRect={checkoutRect} />)}
      <Checkout ref={checkout} products={checkoutProducts} isHovered={isCheckoutHovered} onCheckout={onCheckout} />
    </div>
  )
}