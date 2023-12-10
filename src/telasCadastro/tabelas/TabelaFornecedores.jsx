import { buscarfornecedores,excluirfornecedor} from "../../redux/fornecedorReducer";
import { useSelector,useDispatch } from "react-redux";
import { Button, Col, Container, Spinner, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ESTADO from "../../recursos/estado";
import { Form,FloatingLabel,Row } from "react-bootstrap";


// ... (importações)

export default function TabelaFornecedor(props) {
    const { estado, mensagem, fornecedores } = useSelector((state) => state.fornecedor);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(buscarfornecedores());
    }, [dispatch]);

    function apagarMensagens() {
        setTimeout(() => {
            toast.dismiss();
        }, 2000)
        return null;
    }


    function manipularPesquisa(event){
        const componente = event.currentTarget;
        dispatch(buscarfornecedores(componente.value))
    }

    function excluir(fornecedor){
        dispatch(excluirfornecedor(fornecedor))
    }

    return (
        <Container>
            {estado === ESTADO.ERRO ?
                toast.error(({ closeToast }) =>
                    <div>
                        <p>{mensagem}</p>

                    </div>
                    , { toastId: estado })
                :
                null
            }
            {
                estado === ESTADO.PENDENTE ?
                    toast(({ closeToast }) =>
                        <div>
                            <Spinner animation="border" role="status"></Spinner>
                            <p>Processando a requisição...</p>
                        </div>
                        , { toastId: estado })
                    :
                    null
            }

            {
                //apagar as mensagens que ainda estão sendo exibidas
            estado === ESTADO.OCIOSO ?
            apagarMensagens()
            :
            null
            }
            <Button type="button" onClick={() => props.setView(false)}>
                Novo Fornecedor
            </Button>
            <br />
            <br />
            <br />
            <Row className="justify-content-md-center">
                <FloatingLabel as={Col} md={4} 
                    controlId="floatingInput"
                    label="Pesquisar Fornecedor"
                    className="mb-3 "
                    >
                    <Form.Control type="text" placeholder="Joao da Silva" onChange={manipularPesquisa}/>
                </FloatingLabel>
            </Row>
            {/* Tabela de fornecedores */}
            <Table striped bordered hover variant="dark">
                {/* Cabeçalho da tabela */}
                <thead>
                    <tr>
                        <th>Cpf</th>
                        <th>Nome</th>
                        <th>Empresa</th>
                        <th>Produto</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                {/* Corpo da tabela */}
                <tbody>
                    {fornecedores.map((fornecedor) => (
                        <tr key={fornecedor.cpf}>
                            <td>{fornecedor.cpf}</td>
                            <td>{fornecedor.nome}</td>
                            <td>{fornecedor.empresa}</td>
                            <td>{fornecedor.produto?.prod_descricao}</td>
                            <td>
                                {/* Botões de ação */}
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        // Implementar lógica para excluir fornecedor
                                        excluir(fornecedor)
                                    }}
                                >
                                    Excluir
                                </Button>{' '}
                                <Button
                                    variant="warning"
                                    onClick={() => {
                                        // Implementar lógica para editar fornecedor
                                        props.setFornEdit({
                                            cpf:fornecedor.cpf,
                                            nome:fornecedor.nome,
                                            empresa:fornecedor.empresa,
                                            produtoId:fornecedor.produto?.prod_id
                                        })
                                        props.setModoEdicao(true)
                                        props.setView(false)
                                    }}
                                >
                                    Editar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
