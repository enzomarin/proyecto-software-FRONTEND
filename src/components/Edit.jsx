import React, { useEffect, useState } from "react";
import '../App.css';
import './Ingreso.css';
import { Link, useHistory } from 'react-router-dom';
import { Button, Container, Col, Row, Form } from "react-bootstrap";
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';

function Edicion(props){
   
    const [username, setName] = useState(window.sessionStorage.getItem('userName'))
    const [token, setToken] = useState(window.sessionStorage.getItem('jwt'))
    const [id, setId] = useState(0)
    const [isLoading, setLoading] = useState(true);
    
    const [product, setProductValues] = useState({
        code: '',
        name: '',
        cat: '',
        fab: '',
        model: '',
        ver: '',
        year: '',
        ubicacion: '',
        origen: '',
        nota: '',
        price: '',
        critic: '',
        stock: ''
     });
    
    const history = useHistory();

    //const data = history.location.state.state
     
    const [data, setData] = useState(history.location.state.state)

    const loadId = async () =>{
        const userId =  await axios.get('http://localhost:8000/api/users/'+username,
            { headers: {"Authorization" : `Token ${token}`} }).then(response => {
            //console.log(response.data.id)
            return response.data.id
         }).catch(error => {
            console.log(error.response.data.error)
         })
         setId(userId)
    }

    const loadProduct = async () =>{
        const fresponse = await axios.get('http://localhost:8000/api/products/'+data.id,{}).then(response => {
            const res = response.data.data
            //console.log(res)
            setProductValues(prevInfo => ({...prevInfo,
                code: res.code,
                name: res.name,
                cat: res.cat,
                fab: res.fab,
                model: res.model,
                ver: res.ver,
                year: res.year,
                ubicacion: res.ubicacion,
                origen: res.origen,
                nota: res.nota,
                price: res.price,
                critic: res.critic,
                stock: res.stock,
            }))
            setLoading(false);
        })        
    }

    useEffect(() => {
        loadProduct(data)
        loadId()
        //console.log(product)
    },[]);
    useEffect(() => {
        //console.log(product)
    }, id, product);

    

    const getProduct = async (e) =>{
        //let noRepetido = true
        const response = await axios.get('http://localhost:8000/api/products/code/'+e.code,{}).then(response => {
            //console.log(response.data.data)
            return response.data.data
         })
         .then(data => {          
            //console.log(data)
            //setProductValues(data.data)
            axios.patch('http://localhost:8000/api/products/'+data.id,{
                    code: e.code,
                    name: e.name,
                    cat: e.cat,
                    fab: e.fab,
                    model: e.model,
                    ver: e.ver,
                    year: e.year,
                    ubicacion: e.ubicacion,
                    origen: e.origen,
                    nota: e.nota,
                    price: e.price,
                    critic: e.critic,
                    stock: e.stock,
                    updated_by: id,
                }).then(response =>{
                    loadProduct()
                    //console.log(response)
                    alert("EDICION INGRESADA")
                    //updateData(e)
                    history.push('/inv')
                })
         })
         .catch(error => {
            //console.log(error.response.data.error)
            //console.log("PRODUCTO INGRESADO")
            alert("PRODUCTO NO ENCONTRADO EN BASE DE DATOS")
         })

    }

    const schema = yup.object().shape({
        code: yup.string().matches(/^([0-9]{4})$/, {message: "Respetar Formato Codigo", excludeEmptyString: false}).required('Debe Ingresar C??digo del Producto'),
        name: yup.string().required('Debe Ingresar Nombre del Producto'),
        cat: yup.string().required('Debe Seleccionar Categor??a del Producto'),
        fab: yup.string(),
        model: yup.string(),
        ver: yup.string(),
        year: yup.string().min(4,'M??nimo debe ingresar un a??o').max(9, 'Formato de Fechas Incorrecto').matches(/^(19|20)\d{2}|^(19|20)\d{2}-(19|20)\d{2}$/, {message: "Porfavor Respetar Formato.", excludeEmptyString: false}).test(
            'a??os en orden', 'El a??o menor va primero', function(value){
                if(value){
                    if(value.length>4){
                        return parseInt(value.substring(0, 4)) < parseInt(value.substring(5, 9))
                    }else return true
                }
            }
        ),
        ubicacion: yup.string().required('Debe Seleccionar una Ubicaci??n'),
        origen: yup.string(),
        nota: yup.string(),
        price: yup.number().required('Debe Ingresar Precio Producto'),
        critic: yup.number().required('Debe Ingresar Valor Cr??tico'),
        stock: yup.number().required('Debe Ingresar Nivel de Stock'),
        isCorrect: yup.bool().required().oneOf([true], 'Debe confirmar la informaci??n'),
      });

    if (isLoading) {
        return <div className="App">Cargando...</div>;
    }

    return (
        
        <div className="inputContainer">
            <div class = 'row-s'>
                <div class = 'col-s'><div className = "usr-cont">Vendedor: {username}</div></div>
                <div class = 'col-s'><div className = "shop-til">Editar Producto</div></div>
                <div class = 'col-s'></div>
            </div>
            <div className="space-input">
                <div className="formCont">
                <Formik
                    validationSchema={schema}
                    //onSubmit={console.log}
                    initialValues={{
                        code: product.code,
                        name: product.name,
                        cat: product.cat,
                        fab: product.fab,
                        model: product.model,
                        ver: product.ver,
                        year: product.year,
                        ubicacion: product.ubicacion,
                        origen: product.origen,
                        nota: product.nota,
                        price: product.price,
                        critic: product.critic,
                        stock: product.stock,
                        isCorrect: false,
                    }}
                    //validateOnChange={false}
                    onSubmit={(values, actions) => {
                        setTimeout(() => {
                          //alert(JSON.stringify(values, null, 2));
                          //console.log(values)
                          //console.log(newProduct)
                          /*if (getProduct(values.code)){
                              alert("PRODUCTO CON ESE CODIGO YA EXISTE")
                          }
                          else{
                              alert("producto ingresado")
                          }*/
                          /*
                          setProductValues(prevInfo => ({...prevInfo,
                            code: values.code,
                            name: values.name,
                            cat: values.cat,
                            fab: values.fab,
                            model: values.model,
                            ver: values.ver,
                            year: values.year,
                            ubicacion: values.ubicacion,
                            origen: values.origen,
                            nota: values.nota,
                            price: values.price,
                            critic: values.critic,
                            stock: values.stock,
                        }))*/
                          
                          getProduct(values)

                          actions.setSubmitting(false);
                          actions.resetForm();
                        }, 200);
                        
                    }}
                >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    resetForm,
                    values,
                    isValid,
                    errors,
                }) => (
                    <Form id = "input-form" noValidate onSubmit={handleSubmit} enableReinitialize>
                        <Container>
                            <Row className="ib-3">
                                <Form.Group as={Col} md = "3" controlId="formGridCode">
                                <Form.Label>C??digo</Form.Label>
                                <Form.Control type="number" placeholder="Ingrese C??digo Producto"
                                    name = "code" 
                                    value={values.code} 
                                    onChange={handleChange}
                                    //isValid={touched.code && !errors.code}
                                    isInvalid={!!errors.code}
                                    disabled
                                />
                                <Form.Control.Feedback type="invalid" tooltip id="pos">
                                    {errors.code}
                                </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Nombre Producto</Form.Label>
                                <Form.Control placeholder="Ingrese Nombre Producto" 
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        //isValid={touched.name && !errors.name}
                                        isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid" tooltip id="pos">
                                    {errors.name}
                                </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="ib-3">
                                <Form.Group as={Col} controlId="formGridCat">
                                <Form.Label>Categor??a</Form.Label>
                                <Form.Select aria-label="categorias"
                                    name="cat"
                                    value={values.cat}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.cat}
                                >
                                    <option>Seleccione una Categoria</option>
                                    <option value="Accesorios">Accesorios</option>
                                    <option value="Aceite">Aceite</option>
                                    <option value="Alimentaci??n">Alimentaci??n</option>
                                    <option value="Alternadores">Alternadores</option>
                                    <option value="Balatas Traseras">Balatas Traseras</option>
                                    <option value="Cadenas">Cadenas</option>
                                    <option value="Carroceria">Carroceria</option>
                                    <option value="Catalizadores">Catalizadores</option>
                                    <option value="Correas">Correas</option>
                                    <option value="Direcci??n">Direcci??n</option>
                                    <option value="Distribuci??n">Distribuci??n</option>
                                    <option value="Embragues">Embragues</option>
                                    <option value="El??ctrico">El??ctrico</option>
                                    <option value="Empaquetadura Culata">Empaquetadura Culata</option>
                                    <option value="Empaquetadura V??lvulas">Empaquetadura V??lvulas</option>
                                    <option value="Espejos">Espejos</option>
                                    <option value="Filtros">Filtros</option>
                                    <option value="Motor">Motor</option>
                                    <option value="Mangueras">Mangueras</option>
                                    <option value="Opticos">Opticos</option>
                                    <option value="Refrigeraci??n">Refrigeraci??n</option>
                                    <option value="Retenes">Retenes</option>
                                    <option value="Rodamientos">Rodamientos</option>
                                    <option value="Sensores">Sensores</option>
                                    <option value="Suspensi??n">Suspensi??n</option>
                                    <option value="Transmisi??n">Transmisi??n</option>
                                    <option value="Pastillas Freno Delanteras">Pastillas Freno Delanteras</option>
                                    <option value="Pastillas Freno Traseras">Pastillas Freno Traseras</option>
                                    <option value="V??lvulas">V??lvulas</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid" tooltip id="pos">
                                    {errors.cat}
                                </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridFab">
                                <Form.Label>Fabricante</Form.Label>
                                <Form.Control placeholder="Ingrese Fabricante" 
                                    name="fab"
                                    value={values.fab}
                                    onChange={handleChange}
                                />
                                </Form.Group>
                            </Row>
                            
                            <Row className="ib-3">
                                <Form.Group as={Col} controlId="formGridModel">
                                    <Form.Label>Modelo</Form.Label>
                                    <Form.Control placeholder="Ingrese Modelos Compatibles" 
                                        name="model"
                                        value={values.model}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridVer">
                                    <Form.Label>Versi??n(es)</Form.Label>
                                    <Form.Control placeholder="Ingrese Versiones Compatibles" 
                                        name="ver"
                                        value={values.ver}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridYear">
                                    <Form.Label>A??o(s)</Form.Label>
                                    <Form.Control placeholder="Ingrese A??os Compatibles (AAAA-AAAA)"
                                        name="year"
                                        value={values.year}
                                        onChange={handleChange}
                                        isInvalid={!!errors.year}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip id="pos">
                                        {errors.year}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="ib-3">
                                <Form.Group as={Col} controlId="formGridOrigen">
                                <Form.Label>Origen</Form.Label>
                                <Form.Control placeholder="Ingresar pa??s de origen" 
                                    name="origen"
                                    value={values.origen}
                                    onChange={handleChange}
                                />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridUbicacion">
                                <Form.Label>Ubicaci??n</Form.Label>
                                <Form.Select defaultValue="Seleccione Ubicaci??n"
                                    name="ubicacion"
                                    value={values.ubicacion}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!errors.ubicacion}
                                >
                                    <option value="Default">Seleccione Ubicaci??n</option>
                                    <option value="Bodega">Bodega</option>
                                    <option value="Mostrador">Mostrador</option>
                                    <option value="Vitrina">Vitrina</option>
                                    <option value="Otro">Otro</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid" tooltip id="pos">
                                    {errors.ubicacion}
                                </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridObs">
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control as="textarea" placeholder="A??adir Observaci??n" 
                                    name="nota"
                                    value={values.nota}
                                    onChange={handleChange}
                                />
                                </Form.Group>
                            </Row>
                            <Row className="ib-3">
                                <Form.Group as={Col} controlId="formGridPrice">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control type="number" placeholder="Precio del Producto" 
                                    name="price"
                                    value={values.price}
                                    onChange={handleChange}
                                    isInvalid={!!errors.price}
                                />
                                <Form.Control.Feedback type="invalid" tooltip id="pos">
                                    {errors.price}
                                </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridStock">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control type="number" placeholder="Cantidad a Ingresar" 
                                    name="stock"
                                    value={values.stock}
                                    onChange={handleChange}
                                    isInvalid={!!errors.stock}
                                />
                                <Form.Control.Feedback type="invalid" tooltip id="pos">
                                    {errors.stock}
                                </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridCritic">
                                <Form.Label>Nivel Cr??tico</Form.Label>
                                <Form.Control type="number" placeholder="Nivel cr??tico para generar alerta (0 = sin alerta)" 
                                    name="critic"
                                    value={values.critic}
                                    onChange={handleChange}
                                    isInvalid={!!errors.critic}
                                />
                                <Form.Control.Feedback type="invalid" tooltip id="pos">
                                    {errors.critic}
                                </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Form.Group className="ib-4" id="formGridCheckbox">
                                <Form.Check type="checkbox" label="Confirmo que los datos son correctos" 
                                    required
                                    name="isCorrect"
                                    onChange={handleChange}
                                    isInvalid={!!errors.isCorrect}
                                    feedback={errors.isCorrect}
                                    feedbackType="invalid"
                                />
                            </Form.Group>
                            <div className="threeButtons">
                            <Link to="/inv"><Button variant="dark" size="lg"><i class="fas fa-undo"/> Volver</Button></Link>
                            <div className="centrado">
                            <Button id="espaciado" type = "reset" variant="danger" size="lg" onClick={() => resetForm()}>Valores Originales <i class="far fa-trash-alt"/></Button>
                            <Button id="espaciado" type="submit" variant="success" size="lg">Guardar Cambios  <i class="fas fa-check"/></Button>
                            </div>  
                            </div>
                        </Container>
                    </Form>
                    )}
                    </Formik>  
                </div>
            </div>
        </div>   
    );
}

export default Edicion;