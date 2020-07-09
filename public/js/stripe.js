import axios from 'axios';

const stripe = Stripe(
  'pk_test_51H2BKSIgATTpjFXQcJzlw9KDpQKKfScUNNZ38aWboBE6JCXkn3uLtYvxzwt8SKIBJ9OYokaD9OLWboysLcL9ZedR00kAsDqqkz'
);

export const bookTour = async tourId => {
  try {
    // 1. Get checout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
  }
};
