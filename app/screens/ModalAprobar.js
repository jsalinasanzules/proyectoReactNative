import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, SafeAreaView } from "react-native";
import ObsCharge from './ObsCharge'


class ModalAprobar extends Component {

  constructor(props) {
    super();
    this.state = {
        data: [],
        isLoading: true,
        check: false
      };

 }
  state = {
    modalVisible: false,
    texto: ''
  };

  componentDidMount() {
    this.setState({ modalVisible: false });
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  async GrabarDecision(idpedido, gnorden, gnventas, gngastos, comentario, estatus, usuario, codusuario, cadenaint){
    try {
      if(comentario == undefined)
        comentario = '';
      var textofinal = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?><c c0=\"2\" c1=\"1\" c2=\""+idpedido+"\" c3=\"P\" c4=\""+usuario+"\" c5=\""+codusuario+"\" c6=\""+comentario+"\">"+cadenaint+"</c>";
      console.log("https://app.cotzul.com/Pedidos/setPedidosxid.php?idpedido="+idpedido+"&gnorden="+gnorden+"&gnventas="+gnventas+"&gngastos="+gngastos+"&comentario="+comentario+"&estatus="+estatus+"&cadena="+textofinal);
      const response = await fetch("https://app.cotzul.com/Pedidos/setPedidosxid.php?idpedido="+idpedido+"&gnorden="+gnorden+"&gnventas="+gnventas+"&gngastos="+gngastos+"&comentario="+comentario+"&estatus="+estatus+"&cadena="+textofinal);

      const jsonResponse = await response.json();
      this.setState({ data: jsonResponse.estatusped});
      console.log(jsonResponse.estatusped);
      if(jsonResponse.estatusped == 'REGISTRADO'){
        this.setState({ modalVisible: false });
        this.props.regresarFn();
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
};

  render() {
    const { modalVisible, texto } = this.state;
    const {valregistro, gnorden, gnventas, gngastos, regresarFn, usuario, codusuario ,cadenaint} = this.props;
    
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
            
              <Text style={styles.modalText}>Aprobar Pedido</Text>
              <Text style={styles.modelText2}>Cliente: {valregistro.cb_cliente}</Text>
              <Text style={styles.modelText2}>Monto: $ {valregistro.cb_valortotal}</Text>
              <Text style={styles.modelText3}>Rentabilidad: $ {gngastos}</Text>

              <Text style={styles.modalText2}>Historial Observaciones</Text>
            <ObsCharge iddoc={valregistro.cb_coddocumento} ></ObsCharge>
            
              <TextInput
                multiline
                numberOfLines={5}
                placeholder="Registre una observacion"
                style={styles.input}
                onChangeText={(value) => this.setState({ texto: value })}
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
                        onPress={() => this.GrabarDecision(valregistro.cb_coddocumento, gnorden, gnventas, gngastos, texto, 1, usuario, codusuario, cadenaint)}
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
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.textStyle}>Aprobar</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    margin: 12,
    borderWidth: 1,
    width:300,
    height:100,
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

export default ModalAprobar;