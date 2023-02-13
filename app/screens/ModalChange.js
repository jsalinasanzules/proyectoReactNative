import React, {useEffect, Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, TextInput, View } from "react-native";

class ModalChange extends Component {

  constructor(props) {
    super();
    this.state = {
        data: [],
        isLoading: true,
        check: false,
      };
 }
  state = {
    modalVisible: false,
   
  };

  buscandoActualizar(valbol){
    this.setTexto(Number(valbol).toFixed(2));
    this.setModalVisible(true)
  }


  componentDidMount() {
    this.setState({ modalVisible: false });
    
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setTexto = (texto1) =>{
    this.setState({ texto: texto1 });
  }

  GrabarNewPrecio(texto, indexval, actualizaValor){
    console.log("paso por aqui ");
    
    actualizaValor(texto, indexval);
    this.setModalVisible(!this.state.modalVisible);
    
};



  render() {
    const { modalVisible, texto } = this.state;
    const {valbol, actualizaValor, indexval} = this.props;

    console.log("valbol recibido: " + valbol);
    
        return (
      <View style={styles.centeredView}>
        <Modal
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
              <Text style={styles.modalText}>Cambiar precio</Text>
              <TextInput
                placeholder={"$$"}
                style={styles.input}
                value={texto}
                onChangeText={this.setTexto}
                keyboardType="numeric"
            />
              

              <View style={styles.styleItems}>
                    <View style={{width:120 , marginHorizontal:5}}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => this.setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Cerrar</Text>
                    </Pressable>
                    </View>
                    <View style={{width:120, marginHorizontal:5}}>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => this.GrabarNewPrecio(texto, indexval, actualizaValor)}
                    >
                        <Text style={styles.textStyle}>Aceptar</Text>
                    </Pressable>
                    </View>
                </View>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => this.buscandoActualizar(valbol)}
        >
          <Text style={styles.textStyle}>Cambiar</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    width:100,
    height:30,
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
    fontSize: 15,
  },
  modelText3:{
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingBottom:10,
    fontSize: 15,
  },
  styleItems:{
    flexDirection: "row",
    marginHorizontal: 20,
},
});

export default ModalChange;