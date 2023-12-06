import { useMemo } from 'react'

export default function CheckoutItem({ product }) {
  const removeProductEvent = useMemo(() => new CustomEvent("removeproduct", {
    detail: {
      id: product.id
    }
  }), [product])

  function handleRemoveProduct(e) {
    dispatchEvent(removeProductEvent);
  }

  return (
    <div className="border rounded-2xl px-1 text-sm bg-white hover:bg-red-400 hover:text-white transition-colors hover:border-red-400 cursor-pointer" key={product.id} onClick={handleRemoveProduct}>
      <p>{product.title}</p>
      <p>${product.price.display()}</p>
    </div>
  )
}