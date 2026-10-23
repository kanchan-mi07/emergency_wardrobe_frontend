import { createPaymentOrder, verifyPayment, createRentalPayment, verifyRentalPayment } from '../services/paymentService'

// Opens the Razorpay checkout popup for an already-created payment.
function openCheckout({ payment, description, user, verify, onPaid, onDismiss, onVerifyError }) {
  const checkout = new window.Razorpay({
    key: payment.keyId,
    amount: payment.amount,
    currency: payment.currency,
    name: "Women's Emergency Wardrobe",
    description,
    order_id: payment.razorpayOrderId,
    prefill: { name: user?.name, email: user?.email },
    theme: { color: '#7A2E4D' },
    handler: async (response) => {
      try {
        await verify({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
        onPaid?.()
      } catch (err) {
        onVerifyError?.(err)
      }
    },
    modal: { ondismiss: () => onDismiss?.() },
  })
  checkout.open()
}

function ensureGateway() {
  if (!window.Razorpay) {
    throw new Error('Payment gateway is still loading. Please try again in a moment.')
  }
}

// Pay for a shop order (Checkout, and the "Pay now" retry on the order page).
export async function startPayment(order, user, handlers) {
  ensureGateway()
  const payment = await createPaymentOrder(order.id)
  openCheckout({
    payment, user, ...handlers,
    description: `Order #${order.id}`,
    verify: (sig) => verifyPayment({ orderId: order.id, ...sig }),
  })
}

// Pay for a rental: rental amount + refundable security deposit.
export async function startRentalPayment(rental, user, handlers) {
  ensureGateway()
  const payment = await createRentalPayment(rental.id)
  openCheckout({
    payment, user, ...handlers,
    description: `Rental #${rental.id} - ${rental.productName}`,
    verify: (sig) => verifyRentalPayment({ rentalId: rental.id, ...sig }),
  })
}