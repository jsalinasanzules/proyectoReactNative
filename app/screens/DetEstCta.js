import React, {useEffect, useState, Component} from 'react'
import { StyleSheet, Modal, Text, View, Pressable, ActivityIndicator, ScrollView } from 'react-native'
import { FlatList } from "react-native-gesture-handler";

export default function DetEstCta(props) {

    const [loading, setLoading] = useState(false);
    const [datacab, setDatacab] = useState([])
    const [datadet, setDataDet] = useState([])
    const {idcliente} = props;
    const [modalVisible, setModalVisible] = useState(false)
    const [totalfact, setTotalFact] = useState(0)
    

    var totfact = 0;

    const CargarDataEstCuenta = async () => {
      try {
        setLoading(false);
        console.log("data del cliente ID: "+ idcliente);
        const responsecta = await fetch(
          "https://app.cotzul.com/Pedidos/getEstadosCuentaStore.php?idcliente="+idcliente
        );
        console.log("https://app.cotzul.com/Pedidos/getEstadosCuentaStore.php?idcliente="+idcliente);
        const jsonResponsecta = await responsecta.json();
        console.log("Valor de la carga: " + jsonResponsecta?.cabestcuenta[0].cb_cliente);
        setDatacab(jsonResponsecta?.cabestcuenta);
        setDataDet(jsonResponsecta?.dtaestcuenta);
        if(jsonResponsecta!=null)
          setLoading(true);
        
      } catch (error) {
        setLoading(false);
        console.log("un error cachado estado de cuenta");
        console.log(error);
      }
  };


    useEffect(() => {
      CargarDataEstCuenta();
    }, []);

    const item =({item}) =>{
        
        return(<View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:244, backgroundColor:'yellow', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tablevalb}>{item.cb_cliente}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:244, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}> {item.cb_provincia}-{item.cb_ciudad}</Text>
                    </View>
                </View>
                  
                   
                    <View style={{flexDirection: 'row'}}>
                    <View style={{width:244, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}><Text style={styles.tablevaltit}>TOT. CUPO: $</Text> {Number(item.cb_cupototal).toFixed(2)}</Text>
                    </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                    <View style={{width:244, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tableval}><Text style={styles.tablevaltit}>CUPO. DISP: $</Text> {Number(item.cb_cupodisp).toFixed(2)}</Text>
                    </View>
                </View> 

                <View style={styles.titlesWrapper2}>
                     <Text style={styles.tabletitle}>{item.cb_tipodoc}</Text>
            </View>  
        </View>)
    }


    const item2=({item}) =>{
      
      return(<View>
        <View style={{flexDirection: 'row'}}>
                  <View style={{width:245, backgroundColor:'yellow', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>*** <Text style={styles.tablevaltit}>FECHA FACT.</Text> {item.dt_fechadoc} ***</Text>
                  </View>
        </View>
        <View style={{flexDirection: 'row'}}>
                  <View style={{width:122, backgroundColor:'lightgray', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tablevaltit}>VENDEDOR</Text>
                  </View>
                  <View style={{width:123, backgroundColor:'lightgray', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tablevaltit}>TIPO DOC.</Text>
                  </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                  <View style={{width:122, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>{item.dt_vendedor}</Text>
                  </View>
                  <View style={{width:123, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>{item.dt_etiquetadoc}</Text>
                  </View>
                  
              </View>
        <View style={{flexDirection: 'row'}}>
                  <View style={{width:122, backgroundColor:'lightgray', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tablevaltit}>NUM. DOC.</Text>
                  </View>
                  <View style={{width:123, backgroundColor:'lightgray', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tablevaltit}>NUM. CHQ.</Text>
                  </View>
                  
            </View>
            <View style={{flexDirection: 'row'}}>
                  <View style={{width:122, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>{item.dt_sri}</Text>
                  </View>
                  <View style={{width:123, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>{(item.dt_numchq==0)?"----":item.dt_numchq}</Text>
                  </View>
                  
            </View>
              
              <View style={{flexDirection: 'row'}}>
                  <View style={{width:122, backgroundColor:'lightgray', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tablevaltit}>VALOR FACT.</Text>
                  </View>
                  <View style={{width:123, backgroundColor:'lightgray', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tablevaltit}>SALDO FACT.</Text>
                  </View>
             </View>
             <View style={{flexDirection: 'row'}}>
                  <View style={{width:122, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>$ {Number.parseFloat(item.dt_total).toFixed(2)}</Text>
                  </View>
                  <View style={{width:123, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>$ {Number.parseFloat(item.dt_saldo).toFixed(2)}</Text>
                  </View>
            </View>
            
            
            <View style={{flexDirection: 'row'}}>
                 
                  <View style={{width:245, backgroundColor:'lightgray', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tablevalc}>{item.dt_factem}</Text>
                  </View>
              </View>   
      </View>)
  }

    const closerequest = () =>{
           Alert.alert("Modal has been closed.");
           setModalVisible(!modalVisible);
    }


    const calculartotalfact = () =>{
      console.log("@entro@");
      for (let x = 0; x < datadet.length; x++) {
          console.log("paso entro");
          totfact = Number(totfact) + Number(datadet[x].dt_total);
      }
      setTotalFact(totfact);
    }


    useEffect(() => {
      if(datadet.length > 0) {
         
        calculartotalfact();
      }
  }, [datadet]);




    
    return (
      <ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => closerequest}
      >
       
          <View style={styles.modalView}>
            <View style={styles.titlesWrapper}>
                        <Text style={styles.tabletitle2}>Estado de Cuentas</Text>
                        <Text style={styles.tabletitle}>CHS A FECHA, CHS AL DIA, Y FACTURAS</Text>
                        <Text style={styles.tabletitle}>COTZUL</Text>
            </View>
            <View>
            <View style={{ marginHorizontal: 10, height: 160}}>
              
              {loading ? (<FlatList 
                  data={datacab}
                  renderItem = {item}
                  keyExtractor = {(item, index)=> index.toString()}
              />) : (<ActivityIndicator
                    size="large" 
                    loading={loading}/>)}
            </View> 
            
            <View style={{ marginHorizontal: 10, marginTop:10, height: 250}}>
              
              {loading ? (<FlatList 
                  data={datadet}
                  renderItem = {item2}
                  keyExtractor = {(item, index)=> index.toString()}
              />) : (<ActivityIndicator
                    size="large" 
              loading={loading}/>)}
              <View style={{flexDirection: 'row'}}>
                 
                 <View style={{width:245, backgroundColor:'gray', borderColor: 'black', borderWidth: 1}}>
                     <Text style={styles.tablevala}>TOT. FACTURADO: $ {Number.parseFloat(totalfact).toFixed(2)}</Text>
                 </View>
             </View>  
            </View> 
            </View>
            <Pressable
              style={[styles.button2, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
             
              <Text style={styles.textStyle}>Cerrar</Text>
            </Pressable>
            
            </View>
          
      </Modal>
      
      <Pressable
      style={[styles.button, styles.buttonOpen]}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.textStyle}>Ver Estado de Cuenta</Text>
    </Pressable>
    </ScrollView>)
}

const styles = StyleSheet.create({
  titlesWrapper:{
    marginBottom: 10,
    paddingHorizontal: 20,
},
titlesWrapper2:{
    width: "100%",
    paddingHorizontal: 20,
    marginTop:15,
},

    centeredView: {
        flex: 1,
        alignItems: "center",

      },
      modalView: {
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
        marginTop: 10, 
        width: "90%",
        height: 50,
        borderRadius: 10,
        padding: 15,
        elevation: 2,
        marginRight: 40,

      },
      button2: {
        marginTop: 5, 
        width: "50%",
        height: 50,
        borderRadius: 20,
        padding: 15,
        elevation: 3,
      },
      buttonOpen: {
        backgroundColor: "#6f4993",
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
      },
      scrollview:{
        marginTop:10,
        marginBottom: 50,
        zIndex: 0,
    },
    tabletitle:{
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 5,
      },
      tabletitle2:{
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 5,
        fontSize: 20,
      },
      tableval:{
        textAlign: 'center',
        height: 30,
        fontSize: 12,
        paddingVertical:5,
        paddingHorizontal: 5,
    },
    tablevalb:{
      textAlign: 'center',
      height: 30,
      fontSize: 12,
      paddingHorizontal: 5,
  },
    tablevala:{
      textAlign: 'center',
      height: 30,
      fontSize: 12,
      paddingHorizontal: 10,
      color:"white"
  },tablevalc:{
    textAlign: 'center',
    height: 30,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingTop:10,
},
    tablevaltit:{
      textAlign: 'center',
      height: 25,
      fontWeight: "bold",
      fontSize: 12,
      paddingTop:8,
  },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
   
    
})
