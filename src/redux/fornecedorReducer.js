import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ESTADO from "../recursos/estado";

// url para realizar o fetch
const urlBase = "http://localhost:4000/fornecedor";

//Thunks
export const buscarfornecedores = createAsyncThunk('buscarfornecedores', async (termo) => {
    try {
        if(termo === undefined)
            termo = ""
        const urlBusca = urlBase+`/${termo}`
        const resposta = await fetch(urlBusca, { method: "GET" });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: dados.status,
                mensagem: "",
                listaFornecedores: dados.listaFornecedores
            }
        }
        else {
            return {
                status: dados.status,
                mensagem: dados.mensagem,
                listaFornecedores: []
            }
        }
    } catch (erro) {
        return {
            status: false,
            mensagem: "Erro ao recuperar fornecedores:" + erro.message,
            listaFornecedores: []
        }
    }
});

export const incluirfornecedor = createAsyncThunk('incluirfornecedor', async (fornecedor) => {
    try {
        console.log("oi")
        const resposta = await fetch(urlBase, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fornecedor)
        });
        const dados = await resposta.json();
        if (dados.status){
            fornecedor.codigo = dados.codigoGerado
            return {
                status: dados.status,
                fornecedor,
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
            mensagem: "Não foi possível cadastrar o fornecedor: " + erro.message
        }
    }
});

export const atualizarfornecedor = createAsyncThunk('atualizarfornecedor', async (fornecedor) => {
    try {
        const resposta = await fetch(urlBase, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fornecedor)
        });
        const dados = await resposta.json();
        if (dados.status){
            return {
                status: dados.status,
                fornecedor,
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
            mensagem: "Não foi possível atualizar o fornecedor: " + erro.message
        }
    }
});

export const excluirfornecedor = createAsyncThunk('excluirfornecedor', async (fornecedor) => {
    try {
        const resposta = await fetch(urlBase, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fornecedor)
        });
        const dados = await resposta.json();
        if (dados.status){
            return {
                status: dados.status,
                fornecedor,
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
            mensagem: "Não foi possível excluir o fornecedor: " + erro.message
        }
    }
});

const estadoInicial = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    fornecedores: []
}

const fornecedorSlice = createSlice({
    name: 'fornecedores',
    initialState: estadoInicial,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buscarfornecedores.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = 'Buscando fornecedor...';
            })
            .addCase(buscarfornecedores.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = "Fornecedores recuperados do backend!";
                    state.fornecedores = action.payload.listaFornecedores;
                }
                else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                    state.fornecedores = [];
                }
            })
            .addCase(buscarfornecedores.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
                state.fornecedores = [];
            })
            .addCase(incluirfornecedor.pending, (state, action) =>{
                state.estado = ESTADO.PENDENTE;
                state.mensagem = 'Processando a requisição...'
            })
            .addCase(incluirfornecedor.fulfilled, (state, action) =>{
                if (action.payload.status){
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    //É preciso também atualizar o estado da aplicação e não somente o backend
                    state.fornecedores.push(action.payload.fornecedor);
                }
                else{
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(incluirfornecedor.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(atualizarfornecedor.pending, (state, action) =>{
                state.estado = ESTADO.PENDENTE;
                state.mensagem = 'Processando a requisição...'
            })
            .addCase(atualizarfornecedor.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    // Correção: Atualizar o estado da aplicação e não somente o backend
                    const indice = state.fornecedores.findIndex((fornecedor) => fornecedor.cpf === action.payload.fornecedor.cpf);
                    state.fornecedores[indice] = action.payload.fornecedor;
                } else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(atualizarfornecedor.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(excluirfornecedor.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = 'Processando a requisição...';
            })
            .addCase(excluirfornecedor.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    // Correção: Atualizar o estado da aplicação e não somente o backend
                    state.fornecedores = state.fornecedores.filter((fornecedor) => fornecedor.cpf !== action.payload.fornecedor.cpf);
                } else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(excluirfornecedor.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.payload.mensagem;
            });
    }
});


export default  fornecedorSlice.reducer;