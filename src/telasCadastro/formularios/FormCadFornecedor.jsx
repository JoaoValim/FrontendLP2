import { useState,useEffect } from "react";
import { Button, Form, Row, Col, FloatingLabel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { incluirfornecedor, atualizarfornecedor } from "../../redux/fornecedorReducer";
import { buscarProdutos } from "../../redux/produtoReducer";
import ESTADO from "../../recursos/estado";


export default function FormCadFornecedor(props){

    const fornVazio = {
        cpf:'',
        nome:'',
        empresa:'',
        produtoId:0
    }

    const estadoInicialForn = props.fornVazio;
    const [fornecedor,setFornecedor] = useState(estadoInicialForn);
    const [formValidado, setFormValidado] = useState(false);
    const {estado,mensagem,produtos} = useSelector((state)=>state.produto)
    console.log(props.modoEdicao)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(buscarProdutos())
    }, [dispatch]); //observar o despachante para buscar categorias e manter a interface atualizada com as categorias
    

    function manipularMudancas(e){
        const componente = e.currentTarget;
        console.log(componente.value)
        setFornecedor({...fornecedor,[componente.name]:componente.value});
    }

    function manipularSubmissao(e){
        const form = e.currentTarget; 
        if (form.checkValidity() && fornecedor.produtoId>0){
            if(!props.modoEdicao){
                dispatch(incluirfornecedor(fornecedor))
            }
            else{
                dispatch(atualizarfornecedor(fornecedor));
                props.setFornEdit(fornVazio);
                props.setModoEdicao(false);                
            }
            setFornecedor(fornVazio); 
            setFormValidado(false);
            props.setView(true)
        }
        else{
            setFormValidado(true);
        }

        e.stopPropagation();
        e.preventDefault();
    }




    return(
        <Form noValidate validated={formValidado} onSubmit={manipularSubmissao} >
                <Row className="justify-content-md-center">
                    <Col md={3}>
                        <Form.Group>
                            <FloatingLabel 
                                label="Cpf:"
                                className="mb-3"
                            >
                            {
                            props.modoEdicao? 
                                <Form.Control 
                                    type="text"
                                    placeholder="0"
                                    id="cpf"
                                    name="cpf"
                                    value={fornecedor.cpf}
                                    onChange={manipularMudancas}
                                    disabled={true} />
                                :
                                <Form.Control
                                    type="text"
                                    placeholder="0"
                                    id="cpf"
                                    name="cpf"
                                    value={fornecedor.cpf}
                                    onChange={manipularMudancas}
                                     />
                                }
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe o cpf do fornecedor!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <FloatingLabel 
                                label="Nome:"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text" 
                                    placeholder="Informe o nome do fornecedor"
                                    id="nome"
                                    name="nome"
                                    value={fornecedor.nome}
                                    onChange={manipularMudancas}
                                    required />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe o nome do fornecedor!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={3}>
                        <Form.Group>
                            <FloatingLabel
                                label="Empresa:"
                                className="mb-3"
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="0.00"
                                    id="empresa"
                                    name="empresa"
                                    onChange={manipularMudancas}
                                    value={fornecedor.empresa}
                                    required
                                />
                            </FloatingLabel>
                            <Form.Control.Feedback type="invalid">Informe a Empresa!</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col md={3}>
                        <FloatingLabel controlId="floatingSelect" label="Produto:">
                            <Form.Select
                                aria-label="Produto fornecido"
                                id='produtoId'
                                name='produtoId'
                                className="mb-3"
                                onChange={manipularMudancas}
                                value={fornecedor.produtoId}
                                required >
                                <option value="0">Selecione um Produto</option>
                                {
                                    produtos?.map((produto) =>
                                        <option key={produto.codigo} value={produto.codigo}>
                                            {produto.descricao}
                                        </option>
                                    )
                                }
                            </Form.Select>
                            
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} offset={5} className="d-flex justify-content-end">
                        <Button type="submit" variant={"primary"}>{props.modoEdicao ? "Alterar" : "Cadastrar"}</Button>
                    </Col>
                    <Col md={6} offset={5}>
                        <Button type="button" variant={"secondary"} onClick={() => {
                            props.setView(true)
                        }
                        }>Voltar</Button>
                    </Col>
                </Row>
            </Form>
    );
}