import { useEffect, useState } from "react";
import { Button, Container, Form, Row, Col, FloatingLabel, Spinner } from "react-bootstrap";
import { incluirProduto, atualizarProduto } from '../../redux/produtoReducer';
import { useSelector, useDispatch } from "react-redux";
import { buscarCategorias } from "../../redux/categoriaReducer";
import ESTADO from "../../recursos/estado";
import { toast } from "react-toastify";

export default function FormCadProduto(props) {
    //recuperar as categorias
    //os atributos deste objeto devem estar associados aos inputs do formulários
    const produtoVazio = {
        codigo: '0',
        descricao: '',
        precoCusto: '',
        precoVenda: '',
        dataValidade: '',
        qtdEstoque: '',
        categoria: {
            codigo: 0,
            descricao: ''
        }
    }
    const estadoInicialProduto = props.produtoParaEdicao;
    const [produto, setProduto] = useState(estadoInicialProduto);
    const [formValidado, setFormValidado] = useState(false);

    const { estado: estadoCat,
        mensagem: mensagemCat,
        categorias } = useSelector((state) => state.categoria);

    const { estado, mensagem, produtos } = useSelector((state) => state.produto);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(buscarCategorias());
    }, [dispatch]); //observar o despachante para buscar categorias e manter a interface atualizada com as categorias

    function manipularMudancas(e) {
        const componente = e.currentTarget;
        setProduto({ ...produto, [componente.name]: componente.value });
    }

    function selecionaCategoria(e) {
        const componente = e.currentTarget;
        setProduto({
            ...produto, categoria: {
                "codigo": componente.value,
                "descricao": componente.options[componente.selectedIndex].text
            }
        });
    }

    function converterDataBrParaEu(dataBr) {
        if(dataBr != undefined && dataBr.length>=9 && dataBr.length <11){
            var partes = dataBr.split('/');

            // Verifica se a data é válida
            var dia = parseInt(partes[0], 10);
            var mes = parseInt(partes[1], 10);
            var ano = parseInt(partes[2], 10);

            if (isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12 || ano < 1000 || ano > 9999) {
                console.error('Data inválida:', dataBr);
                return null;
            }

            // Adiciona o zero à esquerda se o mês ou dia tiver apenas um dígito
            var mesStr = mes.toString().padStart ? mes.toString().padStart(2, '0') : mes;
            var diaStr = dia.toString().padStart ? dia.toString().padStart(2, '0') : dia;

            // Ajusta a ordem para o formato europeu 'aaaa-mm-dd'
            var dataEu = ano + '-' + mesStr + '-' + diaStr;

            return dataEu;
        }
        else{
            const data = new Date();
            return `${data.getUTCFullYear()}-${data.getUTCMonth()+1}-${data.getUTCDate()}`
        }
    }


    

    function manipularSubmissao(e) {
        const form = e.currentTarget;
        if (form.checkValidity()) {
            //todos os campos preenchidos
            //mandar os dados para o backend
            if (!props.modoEdicao) {
                console.log(produto)
                dispatch(incluirProduto(produto));
            }
            else {
                dispatch(atualizarProduto(produto))
                props.setModoEdicao(false);
                props.setProdutoParaEdicao(produtoVazio);
            }
            setProduto(produtoVazio); // ou sair da tela de formulário 
            setFormValidado(false);
        }
        else {
            setFormValidado(true);
        }

        e.stopPropagation();
        e.preventDefault();
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
                setTimeout(()=>{
                    toast.dismiss();
                },2000)
                :
                null
            }
            <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Row>
                    <Col>
                        <Form.Group>
                            <FloatingLabel
                                label="Codigo:"
                                className="mb-3"
                            >

                                <Form.Control
                                    type="text"
                                    placeholder="0"
                                    id="codigo"
                                    name="codigo"
                                    value={produto.codigo}
                                    onChange={manipularMudancas}
                                    disabled />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe o código do produto!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group>
                            <FloatingLabel
                                label="Descrição:"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Informe a descrição do produto"
                                    id="descricao"
                                    name="descricao"
                                    value={produto.descricao}
                                    onChange={manipularMudancas}
                                    required />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe a descrição do produto!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={10}>
                        <Form.Group>
                            <FloatingLabel
                                label="Preço de Custo:"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="0.00"
                                    id="precoCusto"
                                    name="precoCusto"
                                    onChange={manipularMudancas}
                                    value={produto.precoCusto}
                                    required
                                />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe o preço de custo do produto!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <FloatingLabel
                                label="Preço de Venda:"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="0.00"
                                    id="precoVenda"
                                    name="precoVenda"
                                    onChange={manipularMudancas}
                                    value={produto.precoVenda}
                                    required
                                />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe o preço de venda do produto!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <FloatingLabel
                                label="Data de Validade:"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="date"
                                    placeholder=""
                                    id="dataValidade"
                                    name="dataValidade"
                                    onChange={manipularMudancas}
                                    value={converterDataBrParaEu(produto.dataValidade)}
                                    required
                                />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe a data de validade do produto!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group>
                            <FloatingLabel
                                label="Quantidade em estoque:"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="number"
                                    placeholder="0"
                                    id="qtdEstoque"
                                    name="qtdEstoque"
                                    onChange={manipularMudancas}
                                    value={produto.qtdEstoque}
                                    required
                                />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe a quantidade em estoque do produto!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <FloatingLabel controlId="floatingSelect" label="Categoria:">
                            <Form.Select
                                aria-label="Categoria dos produtos"
                                id='categoria'
                                name='categoria'
                                onChange={selecionaCategoria}
                                value={produto.categoria.codigo}
                                required>
                                <option value="0">Selecione uma categoria</option>
                                {
                                    categorias?.map((categoria) =>
                                        <option key={categoria.codigo} value={categoria.codigo}>
                                            {categoria.descricao}
                                        </option>
                                    )
                                }
                            </Form.Select>
                            {estadoCat === ESTADO.PENDENTE ?
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Carregando categorias...</span>
                                </Spinner>
                                :
                                null
                            }
                            {
                                estadoCat === ESTADO.ERRO ?
                                    <p>Erro ao carregar as categorias: {mensagemCat}</p>
                                    :
                                    null
                            }
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} offset={5} className="d-flex justify-content-end">
                        <Button type="submit" variant={"primary"}>{props.modoEdicao ? "Alterar" : "Cadastrar"}</Button>
                    </Col>
                    <Col md={6} offset={5}>
                        <Button type="button" variant={"secondary"} onClick={() => {
                            props.exibirFormulario(false)
                            props.setProdutoParaEdicao(produtoVazio)
                        }
                        }>Voltar</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}