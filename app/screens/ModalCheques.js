import React, {useEffect, Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, TextInput, View, FlatList, ActivityIndicator } from "react-native";

class ModalCheques extends Component {

  constructor(props) {
    super();
    this.state = {
        data: [],
        isLoading: true,
        hasValue: false
      };
 }
  state = {
    modalVisible: false,
  };



  abrirVentana(valbol){
    this.setModalVisible(true)
  }


  componentDidMount() {
    this.setState({ modalVisible: false });
    this.CargarDataEstCuenta(this.props.idcliente, this.props.codfact);
  }

  setLoading(charge){
    this.setState({ isLoading: charge });
  }

  setHasValue(value){
    this.setState({ hasValue: value });
  }

  setModalVisible(visible){
    this.setState({ modalVisible: visible });
  }

  async CargarDataEstCuenta(idcliente, codfact){
    try {
      this.setLoading(true);
      this.setHasValue(false);
      const responsecta = await fetch(
        "https://app.cotzul.com/Pedidos/getChequeaFecha.php?idcliente="+idcliente+"&codfact="+codfact
      );
      console.log("https://app.cotzul.com/Pedidos/getChequeaFecha.php?idcliente="+idcliente+"&codfact="+codfact);
      const jsonResponsecta = await responsecta.json();
      console.log(jsonResponsecta?.dtecheques);
      this.setState({ data: jsonResponsecta?.dtecheques});
      if(jsonResponsecta!=null){
        this.setLoading(false);
        this.setHasValue(true);
      }else{
        this.setHasValue(false);
      }
      
    } catch (error) {
      this.setLoading(false);
      this.setHasValue(false);
      console.log("un error cachado cheques a fecha");
      console.log(error);
    }
};

  


  render() {
    const { modalVisible} = this.state;
    const { data, isLoading, hasValue } = this.state;

    const item =({item}) =>{

      return(<View>
              <View style={{flexDirection: 'row'}}>
                  <View style={{width:265, backgroundColor:'lightgray', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>{item.dt_sri}-{item.dt_banco}</Text>
                  </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                  <View style={{width:132, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}> <Text style={styles.tabletit}>#Chq:</Text> {item.dt_numchq}</Text>
                  </View>
                  <View style={{width:133, backgroundColor:'white', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}> <Text style={styles.tabletit}>Cuota:</Text> $ {item.dt_valorcuota}</Text>
                  </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                  <View style={{width:265, backgroundColor:'yellow', borderColor: 'black', borderWidth: 1}}>
                      <Text style={styles.tableval}>{item.dt_factem}</Text>
                  </View>
              </View>
      </View>)
  }

    
        return (

      <View style={styles.centeredView}>
        {hasValue ? <View><Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Detalle de Cheques</Text>
              <View style={styles.centeredView}>
              {isLoading ? <ActivityIndicator
              size="large" 
              loading={isLoading}/> : (
                <FlatList
                  data={data}
                  renderItem={item}
                  keyExtractor={(item, index)=> index.toString()}
                />
              )}
            </View>
              <View style={styles.styleItems}>
                    <View style={{width:240 , marginHorizontal:5}}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => this.setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Cerrar</Text>
                    </Pressable>
                    </View>
              </View>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => this.abrirVentana()}
        >
          <Text style={styles.textStyle}>Cheques</Text>
        </Pressable></View> :<Text style={styles.tableval}>-----</Text>}
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    width:120,
    height:20,
    textAlign:'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom:10
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
    padding: 5,
    elevation: 2,
    marginTop: 5
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
  modalText:{
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical:10,
    fontSize: 20,
  },
  modelText2:{
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical:5,
    fontSize: 10,
  },
  modelText3:{
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingBottom:10,
    fontSize: 10,
  },
  styleItems:{
    flexDirection: "row",
    marginHorizontal: 20,
},
tableval:{
  textAlign: 'center',
  height: 30,
  paddingVertical:5,
  paddingHorizontal: 5,
},
tabletit:{
  textAlign: 'center',
  height: 30,
  fontWeight: 'bold',
  paddingVertical:5,
  paddingHorizontal: 5,
},
});



export default ModalCheques;