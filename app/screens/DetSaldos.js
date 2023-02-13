import React, {useEffect, useState, Component} from 'react'
import { StyleSheet, Modal, Text, View, Pressable, ActivityIndicator } from 'react-native'
import { FlatList } from "react-native-gesture-handler";

export default function DetSaldos(props) {

    const [loading, setLoading] = useState(false);
    const {idcliente} = props;
    const [data, setData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)


    const CargarDataCliente = async () => {
        try {
            setLoading(false);
            console.log("data del cliente ID: "+ idcliente);
            const response = await fetch(
               "https://app.cotzul.com/Pedidos/getSaldopedN.php?idcliente="+idcliente 
             );
             console.log("https://app.cotzul.com/Pedidos/getSaldopedN.php?idcliente="+idcliente);
             const jsonResponse= await response.json();
             console.log("****SALDO PENDIENTE: " +jsonResponse?.saldos.length)
             setData(jsonResponse?.saldos);
             setLoading(true);
        } catch (error) {
            setLoading(false)
          console.log("un error cachado Data saldopedIENTEEE");
          console.log("ERROR CACHADO " + error);
        }
    };


    useEffect(() => {
        CargarDataCliente();
    }, []);

    const item =({item}) =>{
        
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

    const closerequest = () =>{
           Alert.alert("Modal has been closed.");
           setModalVisible(!modalVisible);
    }




    
    return (
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => closerequest}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.titlesWrapper}>
                        <Text style={styles.tabletitle2}>Detalles de Pedido</Text>
            </View>
            <View style={styles.centeredView}>
            <View style={{ marginHorizontal: 10, marginTop:10}}>
            <View style={{flexDirection: 'row'}}>
                  <View style={{width:50, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tabletitle}>Sec</Text>
                  </View>
                  <View style={{width:180, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tabletitle}>Descripción</Text>
                  </View>
                  <View style={{width:100, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tabletitle}>Saldo</Text>
                  </View>
              </View>
              
              
              
              {loading ? (<FlatList 
                  data={data}
                  renderItem = {item}
                  keyExtractor = {(item, index)=> index.toString()}
              />) : (<ActivityIndicator
                    size="large" 
                    loading={loading}/>)}
            </View> 
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
             
              <Text style={styles.textStyle}>Cerrar</Text>
            </Pressable>
            
            </View>
          </View>
      </Modal>
      
      <Pressable
      style={[styles.button, styles.buttonOpen]}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.textStyle}>Ver detalle Saldos</Text>
    </Pressable>
    </View>)
}

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5
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
        width: 100,
        borderRadius: 20,
        padding: 10,
        elevation: 2
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
        paddingVertical: 7,
        paddingHorizontal: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
   
    
})
