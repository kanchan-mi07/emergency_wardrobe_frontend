import api from './api'

export async function createPaymentOrder(orderId) {
  const response = await api.post('/api/payments/create', { orderId })
  return response.data
}

export async function verifyPayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const response = await api.post('/api/payments/verify', {
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  })
  return response.data
}