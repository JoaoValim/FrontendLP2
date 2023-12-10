import TabelaFornecedor from "./tabelas/TabelaFornecedores"
import FormCadFornecedor from "./formularios/FormCadFornecedor"
import { useState } from "react"
import Pagina from "../templates/Pagina"
export default function TelaFornecedor(props){
    
    const fornVazio = {
        cpf:'',
        nome:'',
        empresa:'',
        produto:{
            codigo:'',
            descricao:'',
            precoCusto:0,
            precoVenda:0,
            dataValidade:'',
            qtdEstoque:0,
            categoria: {
                codigo: 0,
                descricao: ''
            }
        }
    }

    

    const [view,setView] = useState(true)
    const [modoEdicao,setModoEdicao] = useState(false)
    const [fornEdit,setFornEdit] = useState({
        cpf:'',
        nome:'',
        empresa:'',
        produtoId:0
    })
    return(
        <Pagina>{

            view? <TabelaFornecedor setView = {setView}  setFornEdit={setFornEdit} setModoEdicao={setModoEdicao} />: <FormCadFornecedor modoEdicao={modoEdicao} setModoEdicao={setModoEdicao} setView = {setView} fornVazio = {fornEdit} setFornEdit={setFornEdit} />
        }
        </Pagina>
    )
    




}