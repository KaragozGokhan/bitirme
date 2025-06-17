import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Endpoints from '../../helpers/api-endpoints';
import axios from 'axios';
import { Result } from '../../shared/Result';
import ApiState from '../../enums/ApiState';
import { CartDto } from '../../dtos/CartDto';

export interface CartState {
	data: Result<CartDto>;
	state: ApiState;
}

const initialState = { state: ApiState.Idle } as CartState;

export const loadCarts: AsyncThunk<Result<CartDto>, void, CartState> = createAsyncThunk('carts/id', async () => {
	const response = await axios.post<Result<CartDto>>(Endpoints.Carts.GetCartOfCustomer + '?customerId=22');
	return response.data;
});

const cartsSlice = createSlice({
	name: 'carts',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(loadCarts.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(loadCarts.fulfilled, (state, action) => {
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(loadCarts.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {},
});

export default cartsSlice.reducer;
