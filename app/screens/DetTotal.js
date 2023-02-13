import React, {useEffect, useState, Component} from 'react'
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Pressable} from "react-native";
import DetPedidos from './DetPedidos';
import { colors, CheckBox } from "react-native-elements";
import { Input, Icon, Button} from 'react-native-elements';
import { FlatList } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import ModalDetallePedidos from './ModalDetallePedidos';
import ModalAprobar from './ModalAprobar';
import ModalRechazar from './ModalRechazar';
import * as OpenAnything from 'react-native-openanything';
import AsyncStorage from '@react-native-async-storage/async-storage'
import utf8 from 'utf8'
import ObsCharge from './ObsCharge'
import DetSaldos from './DetSaldos'
import DetEstCta from './DetEstCta'
import NetInfo from "@react-native-community/netinfo";







//https://app.cotzul.com/Pedidos/pdf/pdf.pdf

const STORAGE_KEY = '@save_data'
const STORAGE_DB = '@login_data'


const data =[
    {
        id: 1,
        tipo: 'Parlantes',
        subfamilia: 'Apple ',
        marca: '$1300',
        cantidad: 'Aprobado',
        facturacion: '0.0',
        check: '$5000',
        cnacional: '$1200'
    },
    {
        id: 2,
        tipo: 'Parlantes',
        subfamilia: 'Apple ',
        marca: '$1300',
        cantidad: 'Aprobado',
        facturacion: '0.0',
        check: '$5000',
        cnacional: '$1200'
    },
    {
        id: 3,
        tipo: 'Parlantes',
        subfamilia: 'Apple ',
        marca: '$1300',
        cantidad: 'Aprobado',
        facturacion: '0.0',
        check: '$5000',
        cnacional: '$1200'
    },
    
]






export default function DetTotal(props) {
    const {navigation, route} = props;
    const { registro, recargarPedidos } = route.params;
    const [data, setData] = useState([])
    const [datap, setDatap] = useState([])
    const [datacab, setDatacab] = useState([])
    const [datadet, setDatadet] = useState([])
    const [datac, setDatac] = useState([])
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [loading4, setLoading4] = useState(false);
    const [check, setCheck] = useState(false);
    const [codcliente, setCodcliente] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [subtotal, setSubTotal] = useState(0);

    const [totalprom, setTotalProm] = useState(0);
    const [subtotalprom, setSubTotalProm] = useState(0);
    const [textoxml, setTextoXml] = useState("");
    const [texto1, setTexto1] = useState("");
    const [dataUser, setdataUser] = useState(defaultValueUser());
    const [usuario, setUsuario] = useState(false);
    const [descu, setDescu] = useState(0);
    

    NetInfo.fetch().then(state => {
        console.log("Connection type carousel", state.type);
        console.log("Is connected?", state.isConnected);
        setInternet(state.isConnected)
    });


    /* FUNCIONES RECURSIVAS */
    const getDataUser = async () => {
        
        try {
        setUsuario(true);
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
        console.log("si entrego aaaaaaa***** : " + jsonValue);
        setdataUser(JSON.parse(jsonValue));
        setUsuario(false);
        } catch(e) {
        setUsuario(false);
         console.log("Error al coger el usuario")
         console.log(e)
        }
    }
    


    const handleModal = () => setIsModalVisible(() => !isModalVisible);


    const [modalVisible, setModalVisible] = useState(true);

    var subtot = 0;
    var tot = 0;
    var desc = 0;

    var totprom = 0;
    var subtotprom = 0;

    var gnorden = 0;
    var gnventas = 0;
    var gngastos = 0;

    var gnordena = 0;
    var gnventasa = 0;
    var gngastosa = 0;

    var itemtext = "";
    var conta = 0;
    var charge = 0;
    var codigocliente = 0;
    var chargecli = 0;
    var contData = 0;
    var precioOR = 0;
    var promOR = 0;
     
    var conttot = 0;
    var temporden = 0;
    var tempventas = 0;
    var tempcostos = 0;
    var totorden = 0;
    var totventas = 0;
    var totcostos = 0;
    


     useEffect(() => {
        if(dataUser){
            if(!usuario){
                getDataUser();
            }
        }
        return () => {
            console.log("***Salio de la app2");
        }
     }, [])


     useEffect(() => {
         if(dataUser.us_codigo!= "" && charge == 0){
            console.log("ABRIO USUARIO CORRECTAMENTE: " + dataUser.us_nombre);
            CargarData();
           
            charge = 1;
         }
    },[dataUser]);

     const CargarData = async () => {
        try {
          const responseb = await fetch(
            "https://app.cotzul.com/Pedidos/getDetallepedidoN.php?idpedido="+registro.cb_coddocumento+"&usuario="+dataUser.us_usuario
          );
          console.log("https://app.cotzul.com/Pedidos/getDetallepedidoN.php?idpedido="+registro.cb_coddocumento+"&usuario="+dataUser.us_usuario);
          const jsonResponseb = await responseb.json();
          setData(jsonResponseb?.detpedidos);
          setLoading(true);
          
          console.log("se llamo");
           /*jsonResponseb?.detpedidos.map((value,index) => {
                setCodcliente(value.dt_codcli)
                
             });*/
             CargarPedido();
             
          
        } catch (error) {
          setLoading(false);
          console.log("un error cachado detalle pedido");
          console.log(error);
        }
    };


     const CargarPedido = async () => {
        try {
          
          const response = await fetch(
            "https://app.cotzul.com/Pedidos/getProductopedidoN.php?idpedido="+registro.cb_coddocumento
          );
          console.log("https://app.cotzul.com/Pedidos/getProductopedidoN.php?idpedido="+registro.cb_coddocumento);
          const jsonResponse = await response.json();
          console.log("DATOS CARGA PRODUCTO PEDIDO N: "+jsonResponse?.detproductos)
          console.log("carga de datos: " + jsonResponse?.detproductos.length);
          setDatap(jsonResponse?.detproductos);
          setLoading2(true);
          
        } catch (error) {
          setLoading2(false);
          console.log("un error cachado PEdido");
          console.log(error);
          
        }
    };

    const regresarFn = () =>{
        console.log("ingreso a regresar");
        navigation.navigate("productos"); 
        recargarPedidos();
    }

    const actualizarPrecios = (subtotal2, total2, cadena) =>{
            setTotal(0);
            setSubTotal(0);
            console.log("BBBB**** Total : "+ total2);
            console.log("BBBB**** SubTotal : "+ subtotal2);
            setTotal(total2);
            setSubTotal(subtotal2);
            setTexto1(cadena);
    }



     const CargarDataCliente = async () => {
        try {
            console.log("data del cliente ID: "+ codcliente);
            const responsea = await fetch(
               "https://app.cotzul.com/Pedidos/getSaldopedN.php?idcliente="+registro.cb_codigo
             );
             console.log("https://app.cotzul.com/Pedidos/getSaldopedN.php?idcliente="+registro.cb_codigo);
             const jsonResponsea = await responsea.json();
             console.log("SALDO PEDN: " +jsonResponsea?.saldos.length)
             setDatac(jsonResponsea?.saldos);
             setLoading3(true);
            
        } catch (error) {
            chargecli = 0;
          setLoading3(false)
          console.log("un error cachado Data saldoped");
          console.log(error);
        }
    };


   

    const item3 =({item}) =>{
        
        return(<View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:50, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>{item.sp_sec}</Text>
                    </View>
                    <View style={{width:180, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>{item.sp_descripcion}</Text>
                    </View>
                    <View style={{width:100, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.sp_saldo).toFixed(2)}</Text>
                    </View>
                </View>   
        </View>)
    }

    

    

    const registroDetallesCadena = (datap) =>{
        if(contData == 0){
            conttot = 0;
            console.log("carga detalles de cadena:" + datap.length);
            for (let x = 0; x < datap.length; x++) {
                if(datap[x].pd_preciopedido != datap[x].pd_preciounitario){
                    precioOR = datap[x].pd_preciounitario;
                }else{
                    precioOR = datap[x].pd_preciopedido;
                }

                conttot ++;
                

                tot = tot + Number(precioOR * datap[x].pd_facturar);
                subtot = Number(subtot) + Number(datap[x].pd_subtotalcn);
                totprom =  Number(totprom) + Number(datap[x].pd_costoprom * datap[x].pd_facturar);
                subtotprom =  Number(subtotprom) + Number(datap[x].pd_subtotalcostprom);
                console.log("***val factura #"+x+": "+datap[x].pd_facturar);
                console.log("***val tot #"+x+": "+datap[x].pd_total);
                console.log("***val subtot #"+x+": "+datap[x].pd_subtotalcn);
                console.log("***val totprom #"+x+": "+datap[x].pd_costoprom);
                console.log("***val subtotprom #"+x+": "+datap[x].pd_subtotalcostprom);
                itemtext = itemtext + "<detalle d0=\""+datap[x].pd_codigoit+"\" d1=\""+datap[x].pd_facturar+"\" d2=\""+datap[x].pd_preciounitario+"\"></detalle>"; 
            }
            setTotal(tot);
            setSubTotal(subtot);
            setTotalProm(totprom);
            setSubTotalProm(subtotprom);


            setTexto1(itemtext);
            contData = 1;
        }
    }

    useEffect(() => {
        console.log("datap: " + datap.length);
        if(datap.length > 0 && contData == 0){
           
            registroDetallesCadena(datap);
        }
    }, [datap]);


    useEffect(() => {
        // fake check to see if user is subscribed
        const checkForSubscription = setTimeout(() => {
          setIsModalVisible(() => !isModalVisible);
        }, 1500);
        return () => clearTimeout(checkForSubscription);
        // dependancy array 
      }, []);



    const Seligual = (check) => {
        setCheck(!check)
    }

   
    
 
    
    const Historicocxc = () =>{
        if(internet){
            console.log('https://app.cotzul.com/Pedidos/pdf/'+registro.cb_codigo+'_'+registro.cb_cliente+'.pdf');
            if(registro.cb_file==1){

                 OpenAnything.Pdf('https://app.cotzul.com/Pedidos/pdf/'+registro.cb_codigo+'_'+registro.cb_cliente+'.pdf');
            }else{
                Alert.alert("El Cliente no tiene facturas pendientes");
            }
        }else{
            Alert.alert("Error: ud. no esta conectado a internet!");
        }
       
    }


    const item =({item}) =>{
        setDescu(item.dt_valordescuento);
         return( 
             
             <View>
             <View style={styles.titlesWrapper}>
                <Text style={styles.titlesdetalle}>{item.dt_observacion}</Text>
            </View>
            <View style={{ marginHorizontal:20, marginTop:10}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Cupo Asignado</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Cupo Utilizado</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Cupo Disponible</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_cupoasignado).toFixed(2)}</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_cupoutilizado).toFixed(2)}</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_cupodisponible).toFixed(2)}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:330, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}> 
                        <Text style={styles.tabletitle}>Patrimonio</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:330, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_valorpatrimonio).toFixed(2)}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:330, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}> 
                        <Text style={styles.tabletitle}>Descripción</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:330, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>{item.dt_descripcion}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Valor Bruto</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Valor Descuento</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Valor Seguro</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_valorbruto).toFixed(2)}</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_valordescuento).toFixed(2)}</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_seguro).toFixed(2)}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Valor Iva</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Valor Flete</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Valor Total</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_valoriva).toFixed(2)}</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_flete).toFixed(2)}</Text>
                    </View>
                    <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}>$ {Number(item.dt_valortotal).toFixed(2)}</Text>
                    </View>
                </View>
               
            </View>

            </View>
             
         )
     }

     console.log("AAAA****total: " + total);
    console.log("AAAA****subtotal: " + subtotal);

    console.log("AAAA****totalprom: " + totalprom);
    console.log("AAAA****subtotalprom: " + subtotalprom);

   gnorden = (Number(total) - Number(descu) - Number(subtotal)).toFixed(2);
    gnventas = ((gnorden/(Number(total)-Number(descu)))*100).toFixed(2);
    gngastos = ((Number(total)-Number(descu))/Number(subtotal)).toFixed(2);

    gnordena = (Number(totalprom) - Number(descu) - Number(subtotalprom)).toFixed(2);
    gnventasa = ((gnordena/(Number(totalprom)-Number(descu)))*100).toFixed(2);
    gngastosa = ((Number(totalprom)-Number(descu))/Number(subtotalprom)).toFixed(2);

    /*gnorden = Number(totorden/conttot).toFixed(2);
    gnventas = Number(totventas/conttot).toFixed(2);
    gngastos = Number(totcostos/conttot).toFixed(2);*/

    

    
    
    return (
        <ScrollView style={styles.scrollview}>
            <View style={styles.titlesWrapper}>
                <Text style={styles.titlesSubtitle}>Cotzul S.A.</Text>
                <Text style={styles.titlesTitle}>Detalle del pedido</Text>
            </View>
            
            <DetPedidos registro={registro} />
         <View style={styles.styleItems}>
                    {/*<View style={{width:360}}>
                            <Button
                            title="Estado de Cuenta"
                            containerStyle={styles.btnContainerLogin}
                            buttonStyle = {styles.btnLogin}
                            titleStyle = {styles.txtLogin}
                            onPress= {() => Historicocxc()}
                            />
                    </View>*/}

                    <DetEstCta idcliente={registro.cb_codigo}></DetEstCta>
                   
            </View>
            <View>
            {loading ? (<FlatList 
                    data={data}
                    renderItem = {item}
                    keyExtractor = {(item, index)=> index.toString()}
                />) : <ActivityIndicator
                      size="large" 
                      loading={loading}/>}

            </View>

            <View style={styles.titlesWrapper}>
                        <Text style={styles.tabletitle}>Historial Observaciones</Text>
            </View>

        <ObsCharge iddoc={registro.cb_coddocumento} ></ObsCharge>

        <ModalDetallePedidos idpedido={registro.cb_coddocumento} texto1={texto1} total={total} subtotal={subtotal} actualizarPrecios={actualizarPrecios}></ModalDetallePedidos>

            <DetSaldos idcliente={registro.cb_codigo}></DetSaldos>
 

            <View style={{ marginHorizontal:20, marginTop:10, marginBottom: 30}}>
                    <View style={{flexDirection: 'row'}}>
                            <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tabletitle}>Gn. Orden</Text>
                            </View>
                            <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tabletitle}>% Gn. Ventas</Text>
                            </View>
                            <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tabletitle}>Gn/ Costos</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tableval}>$ {gnorden}</Text>
                            </View>
                            <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tableval}>{gnventas} %</Text>
                            </View>
                            <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tableval}>{gngastos}</Text>
                            </View>
                        </View>
                       {/* <View style={{flexDirection: 'row'}}>
                            <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tabletitle}>CP -Gn. Orden</Text>
                            </View>
                            <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tabletitle}>% CP - Gn. Ventas</Text>
                            </View>
                            <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tabletitle}> CP -Gn/ Costos</Text>
                            </View>
                        </View>
                       <View style={{flexDirection: 'row'}}>
                            <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tableval}>$ {gnordena}</Text>
                            </View>
                            <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tableval}>{gnventasa} %</Text>
                            </View>
                            <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                                <Text style={styles.tableval}>{gngastosa}</Text>
                            </View>
            </View>*/}
            </View>

           


            <View style={styles.styleItems}>
                    <View style={{width:170}}>
                            <ModalRechazar gnorden={gnorden} gnventas={gnventas} gngastos={gngastos} valregistro={registro} usuario={dataUser.us_usuario} codusuario={dataUser.us_codusuario} cadenaint={texto1} regresarFn={regresarFn}  ></ModalRechazar>
                    </View>
                    <View style={{width:170}}>
                            <ModalAprobar gnorden={gnorden} gnventas={gnventas} gngastos={gngastos} valregistro={registro} usuario={dataUser.us_usuario} codusuario={dataUser.us_codusuario} cadenaint={texto1} regresarFn={regresarFn} ></ModalAprobar>
                    </View>
                </View>
        </ScrollView>
    )
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      title: {
        fontSize: 20,
        fontWeight: "bold",
      },
      text: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "center",
      },
      separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
      },
      input: {
        paddingTop: 10,
        borderColor: "grey",
        borderBottomWidth: 2,
      },
      button: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
      },
      modal: {
        width: "100%",
        height: "90%",
        alignItems: "center",
        justifyContent: "center",
      },
    titlesWrapper:{
        marginTop: 10,
        paddingHorizontal: 20,
    },
    tabletitle:{
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    tableval:{
        textAlign: 'center',
        height: 30,
        paddingVertical: 7,
        paddingHorizontal: 5,
    },
    btnContainerLogin:{
        marginTop: 10, 
        width: "90%",
    },
    styleItems:{
        flexDirection: "row",
        width: '100%',
        marginHorizontal: 20,
    },
    txtLogin:{
        fontSize: 15,
    },
    btnLogin:{
        backgroundColor: "#6f4993",
        height: 50
    }, 
    titlesSubtitle:{
       // fontFamily: 
       fontSize: 16,
       color: colors.textDark,
    },
    titlesTitle:{
        // fontFamily: 
       fontSize: 35,
       color: colors.textDark,
    },
    scrollview:{
        marginTop:10,
        marginBottom: 50,
        zIndex: 0,
    },
    titlesdetalle:{
        textAlign: 'center'
    },
    scrollview:{
        marginTop:10,
        marginBottom: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
});

function defaultValueUser(){
    return{
        us_codigo: "",
        us_nombre: "",
        us_usuario: "",
        us_clave: "",
        us_estatus: "",
        us_codusuario: ""
    }
}
