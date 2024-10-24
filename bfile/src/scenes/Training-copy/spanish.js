import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    Icon,
    Modal,
    Button
} from 'antd';
import ReactPlayer from 'react-player';
import './training.css';
import Logo from './images/logo.png';

import { Translate } from 'react-translated';

class TrainingCopySpanish extends Component {
    state = {
        categories: [
            {
                title: 'Destrezas Comerciales-analisis financiero',
                videos: [
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/atencion%20activa.jpg',
                        title: 'Atención Activa',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/atencion%20activa.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/efectividad%20potente%20en%20la%20primera%20cita.jpg',
                        title: 'Efectivivdad Potente en la Primera Cita',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/efectividad%20potente%20en%20la%20primera%20cita.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/filosofia%20del%20descubrimiento%20intencional.jpg',
                        title: 'Filosofia del Descubrimiento Intencional',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/filosofia%20del%20descubrimiento%20intencional.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/frases%20de%20poder.jpg',
                        title: 'Frases de Poder',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/frases%20de%20poder.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/identificacion%20de%20necesidades%20y%20elementos%20vitales.jpg',
                        title: 'Identificación de Necesidades y Elementos Vitales',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-analisis%20financiero%205/identificacion%20de%20necesidades%20y%20elementos%20vitales.mp4'
                    },
                ],
            },
            {
                title: 'Destrezas Comerciales-Cierre',
                videos: [
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Cierre%205/cierre%20moviendo%20prospectos%20a%20la%20accion.jpg',
                        title: 'Cierre Moviendo Prospectos a la acción',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Cierre%205/cierre%20moviendo%20prospectos%20a%20la%20accion.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Cierre%205/el%20efecto%20de%20proponer%20soluciones%20efectivas.jpg',
                        title: 'El Efecto de Proponer Soluciones Efectivas',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Cierre%205/el%20efecto%20de%20proponer%20soluciones%20efectivas.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Cierre%205/psicologia%20y%20lenguaje%20para%20cerrar%20venta.jpg',
                        title: 'Psicologia y Lenguaje para Cerrar la Venta',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Cierre%205/psicologia%20y%20lenguaje%20para%20cerrar%20venta.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Cierre%205/tecnicas%20integrales%20de%20cierre.jpg',
                        title: 'Tecnicas Integrales de Cierre',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Cierre%205/tecnicas%20integrales%20de%20cierre.mp4'
                    }
                ],
            },
            {
                title: 'Destrezas Comerciales-Prácticas Teléfonicas',
                videos: [
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/claves%20para%20la%20prospeccion.jpg',
                        title: 'Claves para la Prospección',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/claves%20para%20la%20prospeccion.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/como%20fomentar%20la%20confianza%20por%20telefono.jpg',
                        title: 'Como Fomentar la Confianza por Teléfono',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/como%20fomentar%20la%20confianza%20por%20telefono.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/como%20hacer%20llamadas%20telefonicas.jpg',
                        title: 'Como Hacer Llamadas Teléfonicas',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/como%20hacer%20llamadas%20telefonicas.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/frases%20de%20poder%20y%20mentalidad.jpg',
                        title: 'Frases de Poder y Mentalidad',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/frases%20de%20poder%20y%20mentalidad.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/llamando%20tu%20proyecto%20200.jpg',
                        title: 'Llamando Tu Proyecto 200',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-Practicas%20Telefonicas%205/llamando%20tu%20proyecto%20200.mp4'
                    },
                ],
            },
            {
                title: 'Destrezas Comerciales- Prospecting',
                videos: [
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/como%20establecer%20un%20compromiso.jpg',
                        title: 'Como Establecer un Compromiso',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/como%20establecer%20un%20compromiso.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/como%20superar%20el%20miedo%20a%20la%20prospeccion.jpg',
                        title: 'Como Superar el Miedo a la Prospección',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/como%20superar%20el%20miedo%20a%20la%20prospeccion.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/desarrollando%20una%20mentalidad%20de%20referencia.jpg',
                        title: 'Desarrollando una Mentalidad de Referencia',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/desarrollando%20una%20mentalidad%20de%20referencia.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/el%20arte%20y%20filosofia%20de%20la%20prospeccion.jpg',
                        title: 'El Arte y Filosofía de la Prospección',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/el%20arte%20y%20filosofia%20de%20la%20prospeccion.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/el%20cliente%20y%20la%20relacion%20a%20largo%20plazo.jpg',
                        title: 'El Cliente y la Relación a Largo Plazo',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/el%20cliente%20y%20la%20relacion%20a%20largo%20plazo.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/lenguaje%20de%20prospeccion%20y%20como%20obtener%20referencias.jpg',
                        title: 'Lenguaje de Prospección y Como Obtener Referencias',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/lenguaje%20de%20prospeccion%20y%20como%20obtener%20referencias.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/Lenguaje%20de%20Prospeccion%20Probado%20en%20Campo.jpg',
                        title: 'Lenguaje de Prospección Probado en Campo',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Destrezas%20Comerciales-prospecting%206/Lenguaje%20de%20Prospeccion%20Probado%20en%20Campo.mp4'
                    },
                ],
            },
            {
                title: 'Motivación',
                videos: [
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/Como%20desarrollar%20tu%20conviccion%20en%20el%20negocio.jpg',
                        title: 'Como Desarrollar tu Convicción en el Negocio',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/Como%20desarrollar%20tu%20conviccion%20en%20el%20negocio.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/como%20proporcionar%20seguridad%20financiera.jpg',
                        title: 'Como Proporcionar Seguridad Financiera',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/como%20proporcionar%20seguridad%20financiera.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/comprometerte%20al%20establecer%20tu%20por%20que.jpg',
                        title: 'Comprometerte al Establecer tu Por Que',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/comprometerte%20al%20establecer%20tu%20por%20que.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/etica%20para%20mantener%20a%20un%20cliente.jpg',
                        title: 'Etica Para Mantener un Cliente',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/etica%20para%20mantener%20a%20un%20cliente.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/habilidades%20comerciales%20para%20un%20firma%20asesor.jpg',
                        title: 'Habilidades Comerciales Para una Firma Asesor',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/habilidades%20comerciales%20para%20un%20firma%20asesor.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/manifestacion%20de%20vocacion%20que%20inspira.jpg',
                        title: 'Manifestación de Vocación que Inspira',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/manifestacion%20de%20vocacion%20que%20inspira.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/mejores%20practicas%20comerciales%20de%20personas.jpg',
                        title: 'Mejores Prácticas Comerciales de Personas',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/mejores%20practicas%20comerciales%20de%20personas.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/perlitas%20y%20bocaditos%20motivacionales.jpg',
                        title: 'Perlitas y Bocaditos Motivacionales',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/perlitas%20y%20bocaditos%20motivacionales.mp4'
                    },
                    {
                        image: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/una%20pasion%20por%20los%20negocios.jpg',
                        title: 'Una Pasión Por Los Negocios',
                        video: 'https://s3.amazonaws.com/hpnProd/Hoopinsure/spanish/Motivacion%209/una%20pasion%20por%20los%20negocios.mp4'
                    },
                ],
            },
        ],
        modal: false,
        current_video: {}
    }
    render() {

        const { categories, modal, current_video } = this.state;

        return (
            <div>
                <Card style={{marginBottom:20}}>
                    <Row gutter={16}>
                        <Col md={24} span={24}>
                            <div className="hoopis_logo">
                                <img alt="Hoopis Performance Training" src={Logo} />
                            </div>
                        </Col>
                    </Row>
                </Card>

                {categories.map((cat, i) => (
                    <div key={i}>
                        <h2>{cat.title}</h2>
                        <Row gutter={16} className="videoCards videoCards-sp">
                            {cat.videos.map((video, i) => (
                                <Col md={8} key={i} span={24}>
                                    <Card
                                        hoverable
                                        onClick={() => this.setState({ modal: true, current_video: video })}
                                        cover={<img alt={video.title} src={video.image} onError={(ev) => ev.target.style.display='none' } />}
                                        style={{marginBottom:20}}
                                    >
                                        <Card.Meta
                                            title={<Translate text={video.title} />}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}

                <Modal
                    title={<Translate text={(current_video.title) ? current_video.title : ''} />}
                    visible={modal}
                    footer={null}
                    width={688}
                    onCancel={() => this.setState({ modal: false, current_video: {}})}
                >
                    <ReactPlayer
                        url={current_video.video}
                        controls={true}
                        playing
                    />
                </Modal>
            </div>
        );

    }
}

export default TrainingCopySpanish;
