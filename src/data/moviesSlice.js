import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchMovies = createAsyncThunk('fetch-movies', async (apiUrl) => {
    const response = await fetch(apiUrl)
    return response.json()
})

const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        movies: [],
        fetchStatus: '',
        totalPages: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            if (action.payload?.results.length >= 0) {
                state.movies = [...state.movies, ...action.payload.results]
                state.totalPages = action.payload.total_pages
            }
            state.fetchStatus = 'success'
        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})

export default moviesSlice
