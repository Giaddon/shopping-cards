import { useEffect, useRef, useState, forwardRef, useMemo } from "react";

const ShoppingCard = forwardRef(function ({ product = {}, limit = { top: -Infinity, right: Infinity, bottom: Infinity, left: -Infinity }, checkoutRect = {}, mousePosition }, ref) {
  const card = useRef(null);
  const [cardX, setCardX] = useState(0);
  const [cardY, setCardY] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [held, setHeld] = useState(false);

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

  function startTouch(e) {
    const touch = e.touches[0];
    const rect = card.current.getBoundingClientRect();
    const newOffset = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
    setOffset(newOffset);
  }

  function endTouch(e) {
    const rect = card.current.getBoundingClientRect();
    if (
      rect.top + rect.height / 2 > checkoutRect.top &&
      rect.left + rect.width / 2 > checkoutRect.left &&
      rect.bottom - rect.height / 2 < checkoutRect.bottom &&
      rect.right - rect.width / 2 < checkoutRect.right
    ) {
      dispatchEvent(cardDroppedInCheckoutEvent)
    }
  }

  function handleTouch(e) {
    const touch = e.touches[0];
    const rect = card.current.getBoundingClientRect();

    let newPosX = touch.clientX - offset.x;
    let newPosY = touch.clientY - offset.y;

    if (newPosX < limit.left) newPosX = limit.left;
    if (newPosX + rect.width > limit.right) newPosX = limit.right - rect.width;
    if (newPosY < limit.top) newPosY = limit.top;
    if (newPosY + rect.height > limit.bottom) newPosY = limit.bottom - rect.height

    setCardX(newPosX);
    setCardY(newPosY);

    if (
      rect.top + rect.height / 2 > checkoutRect.top &&
      rect.left + rect.width / 2 > checkoutRect.left &&
      rect.bottom - rect.height / 2 < checkoutRect.bottom &&
      rect.right - rect.width / 2 < checkoutRect.right
    ) {
      dispatchEvent(cardEntersCheckoutEvent)
    } else {
      dispatchEvent(cardExitsCheckoutEvent)
    }
  }

  function handlePurchaseClicked(e) {
    dispatchEvent(cardDroppedInCheckoutEvent);
  }

  return (
    <div
      className="cursor-pointer p-1 sm:p-2 bg-white min-h-[8rem] sm:min-h-[10rem] w-[7rem] sm:w-[8rem] absolute rounded-lg border-l-4 border-b-4 skew-x-6 text-center leading-tight flex flex-col justify-between gap-0 sm:gap-1 hover:z-20"
      style={{
        left: cardX,
        top: cardY,
      }}
      ref={card}
      onMouseDown={startDrag}
      onTouchStart={startTouch}
      onTouchEnd={endTouch}
      onMouseUp={endDrag}
      onTouchMove={handleTouch}
    >
      <h1 className="text-sm sm:text-normal font-medium">{product.title}</h1>
      <img src={product.src} alt={product.alt} draggable={false} />
      <p className="text-xs">{product.description}</p>
      <p className="text-sm">${product.price.display()}</p>
      <button className="bg-green-400 rounded-sm text-xs" onClick={handlePurchaseClicked}>&#128722;</button>
    </div>
  )
})

export default ShoppingCard;