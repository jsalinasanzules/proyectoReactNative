import React, {useState, useEffect} from 'react'
import { StyleSheet, View , Text, Image, ScrollView, Alert} from 'react-native'
import { Input, Icon, Button} from 'react-native-elements';
import {isEmpty} from "lodash";
import { colors } from "react-native-elements";
import axios from 'axios'
import {NavigationContainer} from "@react-navigation/native";
import Navigation from "../navegations/Navegation";
import CargarDatos from "../navegations/CargarDatos";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from "../components/Context"
import NetInfo from "@react-native-community/netinfo";

const STORAGE_KEY = '@save_data'
const STORAGE_DB = '@login_data'


export default function LoginForm(props) {
    const {toastRef} = props;
    const [showPassword,setShowPassword] = useState(false);
    const [formData, setformData] = useState(defaultValueForm());
    const [dataUser, setdataUser] = useState(defaultValueUser());
    const [user, setUser] = useState(false);
    const [basedatos, setBasedatos] = useState(false);
    const {signUp} = React.useContext(AuthContext);
    const [internet, setInternet] = useState(true);
    
   
    const onChange = (e, type) => {
        setformData({...formData, [type]:e.nativeEvent.text});
    }


    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
          setUser(jsonValue != null ? true : false);
        } catch(e) {
           console.log(e)
        }
    }

    const setDB = async (value) => {
        try {
            await AsyncStorage.setItem(STORAGE_DB, value)
          } catch(e) {
             console.log(e)
          }
    }

    const getDB = async () => {
        try {
          const base = await AsyncStorage.getItem(STORAGE_DB);
          setBasedatos(base == "SI" ? true : false);
          console.log("base de datos: " + basedatos)
        } catch(e) {
           console.log(e)
        }
    }
    

      const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
        } catch (e) {
          // saving error
        }
      }

    const reviewInternet = () =>{
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            setInternet(state.isConnected)
        });
    }

   

    const onSubmit = async () =>{
        reviewInternet()
        if(internet){
            //if(isEmpty(formData.usuario) || isEmpty(formData.password)){
            if(false){
                toastRef.current.show("Todos los campos son obligatorios");
            }else{
                try {
                    const response = await fetch(
                        //'https://app.cotzul.com/Pedidos/cr_getUsuarioVendedor.php?usuario='+formData.usuario+'&clave='+formData.password
                        'https://app.cotzul.com/Pedidos/cr_getUsuarioVendedor.php?usuario=hcruz&clave=0915895494'
                    );
                    
                    const respuesta = await response.json();
                    console.log(respuesta.usuario[0].vn_nombre);
                    if(respuesta.usuario[0].vn_codigo != 0){
                        setUser(true);
                        toastRef.current.show("Bienvenido " + respuesta.usuario[0].vn_nombre);
                        console.log("usuario: "+ respuesta.usuario[0].vn_usuario);
                        storeData(respuesta.usuario[0]);
                        setDB("NO") 
                        signUp()
                    }else{
                        toastRef.current.show("El usuario o contraseña estan erroneos");
                    }
                    
                }catch(error){
                    console.log(error);
                }
                

            }
    }else{
           Alert.alert("Su dispositivo no cuenta con internet");
           
        }
        
    }


    return (
       
        <>
             
            <View style={styles.formContainer}><Image 
                source={require("../../assets/img/logo_cotzul.jpeg")}
                resizeMode = "contain"
                style={styles.image}
            />
             <Text style={styles.titlesTitle}>Pedidos Vendedores</Text>
            <Input 
                placeholder = "Usuario"
                containerStyle = {styles.inputForm}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name="account"
                        iconStyle={styles.iconRight}
                    />
                }
                onChange={(e) =>onChange(e, "usuario")}
            />
            <Input 
                placeholder = "Contraseña"
                containerStyle = {styles.inputForm}
                password = {true}
                secureTextEntry = {!showPassword}
                rightIcon = {
                    <Icon 
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) =>onChange(e, "password")}
            />
            <Button
                title="Iniciar sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle = {styles.btnLogin}
                onPress= {onSubmit}
            /></View>
            
        </>
    );
}




function defaultValueUser(){
    return{
        vn_codigo: "",
        vn_nombre: "",
        vn_usuario: "",
        vn_clave: "",
    }
}


function defaultValueForm(){
    return{
        usuario: "",
        password: ""
    }
}

const styles = StyleSheet.create({
    formContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10, 
        marginLeft: 30, 
        marginRight: 30
    },
    titlesSubtitle:{
        // fontFamily: 
        fontSize: 16,
        color: colors.textDark,
     },
    inputForm:{
        width: "100%",
        marginTop: 10
    },
    image:{
        height: 50,
        width: "80%",
        marginTop: 20, 
        marginBottom: 10,
    },
    btnContainerLogin:{
        marginTop: 30, 
        width: "95%"
    },
    btnLogin:{
        backgroundColor: "#6f4993",
    }, 
    iconRight:{
        color : "#c1c1c1",

    }
})
