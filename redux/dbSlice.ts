import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
}

interface Restaurant {
  id: string;
  name: string;
}

interface Reservation {
  id: string;
  date: string;
}

interface Payment {
  id: string;
  amount: number;
}

interface Review {
  id: string;
  content: string;
}

interface DbState {
  users: User[];
  restaurants: Restaurant[];
  reservations: Reservation[];
  payments: Payment[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: DbState = {
  users: [],
  restaurants: [],
  reservations: [],
  payments: [],
  reviews: [],
  loading: false,
  error: null,
};

const dbSlice = createSlice({
  name: "db",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
    },
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload;
    },
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    addRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.restaurants.push(action.payload);
    },
    updateRestaurant: (state, action: PayloadAction<Restaurant>) => {
      const index = state.restaurants.findIndex(
        (restaurant) => restaurant.id === action.payload.id
      );
      if (index !== -1) {
        state.restaurants[index] = action.payload;
      }
    },
    deleteRestaurant: (state, action: PayloadAction<string>) => {
      state.restaurants = state.restaurants.filter(
        (restaurant) => restaurant.id !== action.payload
      );
    },
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload);
    },
    updateReservation: (state, action: PayloadAction<Reservation>) => {
      const index = state.reservations.findIndex(
        (reservation) => reservation.id === action.payload.id
      );
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
    },
    deleteReservation: (state, action: PayloadAction<string>) => {
      state.reservations = state.reservations.filter(
        (reservation) => reservation.id !== action.payload
      );
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.push(action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setUsers,
  setRestaurants,
  setReservations,
  setPayments,
  setReviews,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addReservation,
  updateReservation,
  deleteReservation,
  addReview,
} = dbSlice.actions;

export default dbSlice.reducer;
