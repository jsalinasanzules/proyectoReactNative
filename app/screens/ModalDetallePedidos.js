import React, { Component, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { colors, CheckBox } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
import  ModalChange from './ModalChange';


class ModalDetallePedidos extends Component{
  
  constructor(props) {
   
    super(props);
    this.state = {
      datan: [],
      isLoading: false,
      check: false, 
      arreglo: Array,
      arreglo2: Array
    };

    

    
  }

  async CargarData(){
    try {
      const responsec = await fetch("https://app.cotzul.com/Pedidos/getProductopedidoN.php?idpedido="+this.props.idpedido);
      console.log("************************");
      console.log("https://app.cotzul.com/Pedidos/getProductopedidoN.php?idpedido="+this.props.idpedido);
      const jsonResponsec = await responsec.json();
      console.log("datos json: " +jsonResponsec?.detproductos);
      this.setState({ datan: jsonResponsec?.detproductos});
      this.setState({ isLoading: true });
      this.setState({arreglo : new Array(jsonResponsec?.detproductos.length).fill(false)})
      this.setState({arreglo2 : new Array(jsonResponsec?.detproductos.length).fill(0)})
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
};

  componentDidMount() {
    this.setState({ modalVisible: false });
    this.CargarData();
  }

  


  state = {
    modalVisible: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
 
  }

  render() {
    const { modalVisible } = this.state;
    const { datan, isLoading, arreglo, arreglo2} = this.state;
   

    var tota = 0;
    var subtota = 0;
    var valbol = 0;
    var valbol1 = 0;
    var itemtext = "";
    var totpre1 = 0;
    var totpre = 0;
    var valgas = 0;
   


    function trunc (x, posiciones = 0) {
      var s = x.toString()
      var l = s.length
      var decimalLength = s.indexOf('.') + 1
      var numStr = s.substr(0, decimalLength + posiciones)
      return Number(numStr)
    }

    const handleOnChange = (position) => {
      const updatedCheckedState = arreglo.map((item, index) =>
        index === position ? !item : item
      );
      const updatedCheckedState2 = arreglo2.map((item, index) =>
        index === position ? 0 : item
      );
      this.setState({arreglo : updatedCheckedState});
      this.setState({arreglo2 : updatedCheckedState2});
      actualizaCadena(updatedCheckedState, updatedCheckedState2);
    }

    const actualizaCadena = (dataarr, dataarr2) =>{
            console.log("carga detalles de cadena: "+ datan.length);
            for (let x = 0; x < datan.length; x++) {
              valbol1 = 0;
              if(dataarr2[x] != 0){
                valbol1 = dataarr2[x];
                totpre1 = valbol1 * datan[x].pd_facturar;
              }else{
                if(dataarr[x]){
                  valbol1 = datan[x].pd_preciopedido;
                  totpre1 = datan[x].pd_preciopedido * datan[x].pd_facturar;
                }
                else {
                  valbol1 = datan[x].pd_preciounitario;
                  totpre1 = datan[x].pd_preciounitario * datan[x].pd_facturar;
                }
              }
              
                tota = Number(tota) + Number(totpre1);
                subtota = Number(subtota) + Number(datan[x].pd_subtotalcn);
                itemtext = itemtext + "<detalle d0=\""+datan[x].pd_codigoit+"\" d1=\""+datan[x].pd_facturar+"\" d2=\""+valbol1+"\"></detalle>"; 
            }
            console.log(itemtext);
            this.props.actualizarPrecios(subtota, tota, itemtext);
           // this.props.setSubTotal(subtot);
            //this.props.setTexto1(itemtext);
    }

    const actualizaValor = (value, position) =>{
      console.log("actualiza: "+value+"en el valor: " + position);

      const updatedCheckedState2 = arreglo2.map((item, index) =>
        index === position ? value : item
      );
      this.setState({arreglo2 : updatedCheckedState2});
      actualizaCadena(arreglo, updatedCheckedState2);
  }
    
    const item =({item, index}) =>{

      if(arreglo2[index] != 0){
        valbol = arreglo2[index];
      }else{
        if(arreglo[index]){
          valbol = item.pd_preciopedido;
          
        }
        else {
          valbol = item.pd_preciounitario;
        }
      }
      
      totpre = Number(valbol) * Number(item.pd_facturar);

      if(totpre != 0 && item.pd_subtotalcn != 0){
        valgas = totpre/item.pd_subtotalcn;
      }else{
        valgas = 0;
      }
      




       
        

  

      return(
          
              <View>
                  
              <View style={{ marginHorizontal:0, marginTop:10, fontSize:10}}>
                      <View style={{flexDirection: 'row'}}>
                          <View style={{width:330, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>{item.pd_descripcion}</Text>
                          </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                          <View style={{width:165, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>{item.pd_tituloit}</Text>
                          </View>
                          <View style={{width:165, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>{item.pd_descripcionma}</Text>
                          </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                          <View style={{width:330, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}> {item.pd_subfamilia}</Text>
                          </View>
                      </View>
                      
                      <View style={{flexDirection: 'row'}}>
                          <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>Cantidad</Text>
                          </View>
                          <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>Precio Pedido</Text>
                          </View>
                          <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>Precio Unitario</Text>
                          </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                          <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tableval}>{Number(item.pd_cantidad).toFixed(2)}</Text>
                          </View>
                          <View style={{width:110, backgroundColor:'yellow', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tableval}>$ {Number(item.pd_preciopedido).toFixed(2)}</Text>
                          </View>
                          <View style={{width:110, backgroundColor:'yellow', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tableval}>$ {Number(valbol).toFixed(2)}</Text>
                             
                            <ModalChange valbol={valbol} indexval={index} actualizaValor={actualizaValor}></ModalChange>
                              
                          </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                          <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>Costo Nacional</Text>
                          </View>
                          <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>Subtotal</Text>
                          </View>
                          <View style={{width:110, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>Total</Text>
                          </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                          <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tableval}>$ {Number(item.pd_costonac).toFixed(2)}</Text>
                          </View>
                          <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tableval}>$ {Number(item.pd_subtotalcn).toFixed(2)}</Text>
                          </View>
                          <View style={{width:110, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tableval}>$ {Number(totpre).toFixed(2)}</Text>
                          </View>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                          <View style={{width:330, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                              <Text style={styles.tabletitle}>FACTOR: {Number(valgas).toFixed(2)} </Text>
                          </View>
                      </View>
                     
                  </View>
                  {
                  
                    (item.pd_preciopedido != item.pd_preciounitario || (item.pd_preciopedido == item.pd_preciounitario && arreglo[index]))?
                    (<View style={{flexDirection:'row'}}><CheckBox
                      checked={arreglo[index]}
                      onPress={()=> handleOnChange(index)}
                      
                      /><Text style={{paddingTop:20, fontWeight: "bold"}}>Aceptar precio vendedor</Text></View>):
                      (<Text style={{fontWeight: "bold"}}></Text>)
                  }

              </View>
              )
  }
    return (
      <View style={styles.centeredView}>
      
          <View style={styles.centeredView}>
            <View style={styles.titlesWrapper}>
                        <Text style={styles.tabletitle}>Detalles de Pedido</Text>
            </View>
            <View style={styles.centeredView}>
           

              {isLoading ? <ActivityIndicator
              size="large" 
              loading={isLoading}/> : (
                <FlatList
                  data={datan}
                  renderItem={item}
                  keyExtractor={(item, index)=> index.toString()}
                />
              )}
            </View>
              
           
          </View>
      </View>
    );
  }
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

  button2: {
    borderRadius: 5,
    padding: 5,
    elevation: 2
  },
  buttonOpen2: {
    backgroundColor: "#6f4993",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#6f4993",
  },
  buttonClose2: {
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
  fontSize: 10,
  paddingVertical: 7,
  paddingHorizontal: 5,
},
titlesWrapper:{
  marginTop: 10,
  paddingHorizontal: 20,
  fontSize: 20,
},
});

export default ModalDetallePedidos;