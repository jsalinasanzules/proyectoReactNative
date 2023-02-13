import React, {useState, useEffect} from 'react'
import { colors } from "react-native-elements";
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios'
import {locationsRef} from "../utils/firebase"
import {useNavigation} from "@react-navigation/native"
import * as SQLite from 'expo-sqlite';

const database_name = 'CotzulBD.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

export default function DataCliente(props) {
   
    const [imageFirebase, setImage] = useState("")
    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation();
    const {texto} = props;

    const [posts, setPosts] = useState([])


    useEffect(() => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM Cliente WHERE cl_cliente LIKE ?',
            [`${texto}%`],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
            }
            );
    
        });
    },[texto])

    return (
            
        <View>
           {posts == null ? (
                <NoFoundCliente />
            ) : (<View>
            <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                renderItem={({ item }) => (<ListCliente cliente={item} navigation={navigation} /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />
            </View>)}
        </View>
        
    
)
   
};

function NoFoundCliente(){
    return(<View style={{flex: 1, alignItems: 'center', }}>
    <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode = "cover"
        style={{width: 200, height: 200}}
    />
</View>); 
}



function ListCliente(props){
    const {cliente, navigation} = props;
    const {cl_codigo,cl_cedula, cl_cliente, cl_telefono, cl_direccion, cl_correo} = cliente;

    const goCliente = () =>{
        console.log("Detalle Cliente");
        navigation.navigate("scliente",{cl_codigo,cl_cedula, cl_cliente}); 
     }

    return (<TouchableOpacity onPress={goCliente}>
                <View style={styles.productoCardWrapper}>
                
                    <View style={styles.productoTexto}>
                        <Text numberOfLines={1} style={styles.productoReferencia}>{cl_cliente}</Text>
                        <Text style={styles.productoCodigo}>{cl_cedula}</Text>
                        <Text style={styles.productoConf}>Teléfono: {cl_telefono}</Text>
                        <Text numberOfLines={1} style={styles.productoConf}>Dirección: {cl_direccion}</Text>
                        <Text numberOfLines={2} style={styles.productoConf}>Correo: {cl_correo}</Text>
                        
                    </View>
                </View>
                </TouchableOpacity>);
}




const styles = StyleSheet.create({
    productoCardWrapper:{
        backgroundColor: '#CDCDCD',
        borderRadius:25,
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 0,
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        height: 120,
        flexDirection: 'row',
    },  
    productoTexto:{
        flexDirection: 'column',
        width: 300,
    },
    productoPrecio:{
        flexDirection: 'column',
        width: 100,
        height:100,
    },
    textoPrecio:{
        textAlign:'right',
        paddingRight: 20,
        paddingTop:0,
        color:'#9462c1',
        fontSize: 12,
    },
    productoReferencia:{
        color:'#9462c1',
        paddingLeft: 10,
        fontSize: 15,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    productoCodigo:{
        color:'#000',
        paddingTop:2,
        paddingLeft: 10,
        fontSize: 12,
    },
    productoImage:{
        paddingTop: 0,
        paddingBottom: 10,
    },
    productoConf:{
        paddingTop:2,
        paddingLeft: 10,
        fontSize: 10,
        color: 'grey'
    },
    finalproducto:{
        color:'#9462c1',
        fontSize: 15,
        height: 150,
        marginTop: 10,
    }
});