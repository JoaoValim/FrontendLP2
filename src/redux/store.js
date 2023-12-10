import {configureStore} from '@reduxjs/toolkit';
import clienteSlice from './clienteReducer';
import categoriaSlice from './categoriaReducer';
import produtoSlice from './produtoReducer';
import fornecedorReducer from './fornecedorReducer';

const store = configureStore({
    reducer:{
        cliente: clienteSlice,
        categoria: categoriaSlice,
        produto: produtoSlice,
        fornecedor:fornecedorReducer
    }
});

export default store;