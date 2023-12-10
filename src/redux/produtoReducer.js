import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "../recursos/estado";
const urlBase = "http://localhost:4000/produto";
//Thunks
export const buscarProdutos = createAsyncThunk('buscarProdutos', async () => {
    try {
        const resposta = await fetch(urlBase, { method: "GET" });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: dados.status,
                mensagem: "",
                listaProdutos: dados.listaProdutos
            }
        }
        else {
            return {
                status: dados.status,
                mensagem: dados.mensagem,
                listaProdutos: []
            }
        }
    } catch (erro) {
        return {
            status: false,
            mensagem: "Erro ao recuperar produtos:" + erro.message,
            listaProdutos: []
        }
    }
});

export const incluirProduto = createAsyncThunk('incluirProduto', async (produto) => {
    try {
        const resposta = await fetch(urlBase, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });
        const dados = await resposta.json();
        if (dados.status){
            produto.codigo = dados.codigoGerado
            return {
                status: dados.status,
                produto,
                mensagem: dados.mensagem
            }
        }
        else{
            return {
                status: dados.status,
                mensagem: dados.mensagem
            }
        }
    }
    catch (erro) {
        return {
            status: false,
            mensagem: "Não foi possível cadastrar o produto: " + erro.message
        }
    }
});

export const atualizarProduto = createAsyncThunk('atualizarProduto', async (produto) => {
    try {
        const resposta = await fetch(urlBase, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });
        const dados = await resposta.json();
        if (dados.status){
            return {
                status: dados.status,
                produto,
                mensagem: dados.mensagem
            }
        }
        else{
            return {
                status: dados.status,
                mensagem: dados.mensagem
            }
        }
    }
    catch (erro) {
        return {
            status: false,
            mensagem: "Não foi possível atualizar o produto: " + erro.message
        }
    }
});

export const excluirProduto = createAsyncThunk('excluirProduto', async (produto) => {
    try {
        const resposta = await fetch(urlBase, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });
        const dados = await resposta.json();
        if (dados.status){
            return {
                status: dados.status,
                produto,
                mensagem: dados.mensagem
            }
        }
        else{
            return {
                status: dados.status,
                mensagem: dados.mensagem
            }
        }
    }
    catch (erro) {
        return {
            status: false,
            mensagem: "Não foi possível excluir o produto: " + erro.message
        }
    }
});

const estadoInicial = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    produtos: []
}

const produtoSlice = createSlice({
    name: 'produto',
    initialState: estadoInicial,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buscarProdutos.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = 'Buscando produtos...';
            })
            .addCase(buscarProdutos.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = "Produtos recuperados do backend!";
                    state.produtos = action.payload.listaProdutos;
                }
                else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                    state.produtos = [];
                }
            })
            .addCase(buscarProdutos.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
                state.produtos = [];
            })
            .addCase(incluirProduto.pending, (state, action) =>{
                state.estado = ESTADO.PENDENTE;
                state.mensagem = 'Processando a requisição...'
            })
            .addCase(incluirProduto.fulfilled, (state, action) =>{
                if (action.payload.status){
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    //É preciso também atualizar o estado da aplicação e não somente o backend
                    state.produtos.push(action.payload.produto);
                }
                else{
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(incluirProduto.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(atualizarProduto.pending, (state, action) =>{
                state.estado = ESTADO.PENDENTE;
                state.mensagem = 'Processando a requisição...'
            })
            .addCase(atualizarProduto.fulfilled, (state, action) =>{
                if (action.payload.status){
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    //É preciso também atualizar o estado da aplicação e não somente o backend
                    const indice = state.produtos.findIndex((produto) => produto.codigo === action.payload.produto.codigo);
                    state.produtos[indice]=action.payload.produto;
                }
                else{
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(atualizarProduto.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(excluirProduto.pending, (state, action) =>{
                state.estado = ESTADO.PENDENTE;
                state.mensagem = 'Processando a requisição...'
            })
            .addCase(excluirProduto.fulfilled, (state, action) =>{
                if (action.payload.status){
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    //É preciso também atualizar o estado da aplicação e não somente o backend
                    state.produtos = state.produtos.filter((produto) => produto.codigo !== action.payload.produto.codigo);
                }
                else{
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(excluirProduto.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            })
    }
});

export default produtoSlice.reducer;
//