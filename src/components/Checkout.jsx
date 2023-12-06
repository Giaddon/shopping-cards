import { forwardRef } from "react"
import CheckoutItem from "./CheckoutItem";
import Price from "../classes/Price";
const Checkout = forwardRef(function ({ products = [], isHovered = false, onCheckout }, ref) {
  return (
    <div className={`w-full overflow-y-auto sm:w-48 h-48 sm:h-full transition-colors rounded-lg text-center p-2 ${isHovered ? 'bg-green-400' : 'bg-white'}`} ref={ref}>
      <div>
        <h1 className="text-lg font-medium">Checkout</h1>
        {products.length > 0 &&
          <div className="space-y-2 mt-2">
            {products.map(product => (
              <CheckoutItem key={product.id} product={product} />
            ))}
          </div>
        }
      </div>
      <div className="">
        <p className="">Total Price ${new Price(products.reduce((sum, product) => product.price.cents + sum, 0)).display()}</p>
        <button className="bg-green-400 rounded-lg p-1 w-full" disabled={products.length < 1} onClick={onCheckout}>Checkout</button>
      </div>
    </div>
  )
})

export default Checkout;