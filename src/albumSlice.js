import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API로 앨범 데이터를 불러오는 비동기 작업
export const fetchAlbums = createAsyncThunk(
    'albums/fetchAlbums',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                'https://yfwebapp-eff7epg4dvhrftdv.koreacentral-01.azurewebsites.net/api/albums/public'
            );
            return response.data.albums;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching albums');
        }
    }
);
// 앨범 슬라이스 정의
const albumSlice = createSlice({
    name: 'albums',
    initialState: {
        albums: [],
        loading: false,
        error: null,
    },
    reducers: {
        // 앨범 데이터를 수동으로 추가하는 동작
        addAlbum: (state, action) => {
            state.albums.push(action.payload);
        },
        // 특정 앨범을 삭제하는 동작
        removeAlbum: (state, action) => {
            state.albums = state.albums.filter(album => album.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlbums.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAlbums.fulfilled, (state, action) => {
                state.loading = false;
                state.albums = action.payload;
            })
            .addCase(fetchAlbums.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addAlbum, removeAlbum } = albumSlice.actions;

export default albumSlice.reducer;