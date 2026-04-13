import DodoPayments from 'dodopayments'

if (!process.env.DODO_API_KEY) {
  throw new Error('DODO_API_KEY environment variable is not set')
}

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
})

export const PRODUCT_ID_SIMULATION = process.env.DODO_PRODUCT_ID_SIMULATION || 'pdt_0Nbh7EiwZBACFP7KHvrA5'
