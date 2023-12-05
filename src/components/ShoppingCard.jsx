import { useEffect, useRef, useState, forwardRef, useMemo } from "react";
import useMousePosition from "../hooks/useMousePosition";

const ShoppingCard = function ({ product = {}, limit = { top: -Infinity, right: Infinity, bottom: Infinity, left: -Infinity }, checkoutRect = {} }, ref) {
  const card = useRef(null);
  const [cardX, setCardX] = useState(0);
  const [cardY, setCardY] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [held, setHeld] = useState(false);
  const mousePosition = useMousePosition();

  const cardEntersCheckoutEvent = useMemo(() => new CustomEvent("cardenterscheckout", {
    detail: {
      id: product.id
    }
  }), [product])

  const cardExitsCheckoutEvent = useMemo(() => new CustomEvent("cardexitscheckout", {
    detail: {
      id: product.id
    }
  }), [product])

  const cardDroppedInCheckoutEvent = useMemo(() => new CustomEvent("carddroppedincheckout", {
    detail: {
      id: product.id
    }
  }), [product])


  useEffect(() => {
    if (held && card.current && limit && checkoutRect) {
      const rect = card.current.getBoundingClientRect();

      let newPosX = mousePosition.x - offset.x;
      let newPosY = mousePosition.y - offset.y;

      if (newPosX < limit.left) newPosX = limit.left;
      if (newPosX + rect.width > limit.right) newPosX = limit.right - rect.width;
      if (newPosY < limit.top) newPosY = limit.top;
      if (newPosY + rect.height > limit.bottom) newPosY = limit.bottom - rect.height

      setCardX(newPosX);
      setCardY(newPosY);

      if (
        rect.top > checkoutRect.top &&
        rect.left + rect.width / 2 > checkoutRect.left &&
        rect.bottom < checkoutRect.bottom &&
        rect.right - rect.width / 2 < checkoutRect.right
      ) {
        dispatchEvent(cardEntersCheckoutEvent)
      } else {
        dispatchEvent(cardExitsCheckoutEvent)
      }
    }
  }, [held, mousePosition, card, checkoutRect, cardEntersCheckoutEvent, cardExitsCheckoutEvent])

  function startDrag() {
    setOffset({
      x: mousePosition.x - cardX,
      y: mousePosition.y - cardY,
    })
    setHeld(true);
  }

  function endDrag() {
    setHeld(false);
    const rect = card.current.getBoundingClientRect();
    if (
      rect.top > checkoutRect.top &&
      rect.left + rect.width / 2 > checkoutRect.left &&
      rect.bottom < checkoutRect.bottom &&
      rect.right - rect.width / 2 < checkoutRect.right
    ) {
      dispatchEvent(cardDroppedInCheckoutEvent)
    }
  }

  if (product.inCheckout) {
    return null
  }

  return (
    <div
      className="cursor-pointer p-2 bg-white min-h-[10rem] w-[8rem] absolute rounded-lg border-l-4 border-b-4 skew-x-6 text-center leading-tight flex flex-col justify-between gap-1 hover:z-20"
      style={{
        left: cardX,
        top: cardY,
      }}
      ref={card}
      onMouseDown={startDrag}
      onMouseUp={endDrag}
    >
      <h1 className="font-medium">{product.title}</h1>
      <p className="text-xs">{product.description}</p>
      <p className="text-sm">${product.price.display()}</p>
    </div>
  )
}

export default ShoppingCard;