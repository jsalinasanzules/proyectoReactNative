import React, {useState, useEffect} from 'react'
import { colors } from "react-native-elements";
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios'
import {locationsRef} from "../utils/firebase"
import {useNavigation} from "@react-navigation/native"
import * as SQLite from 'expo-sqlite';


const STORAGE_KEY = '@save_productos'
const database_name = 'CotzulBD.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;


export default function DataCatalogo(props) {
    const {texto} = props;
    const [imageFirebase, setImage] = useState("")
    const [isLoading, setLoading] = useState(false)
    const navigation = useNavigation();

    const [posts, setPosts] = useState([])


    
    const abrirtablaCatalogo = async() => {
        getDataCata();
    }

    getDataCata = async () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
   
        db.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM Catalogo WHERE ct_nomcata LIKE ?',
            [`${texto}%`],
            (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
                setPosts(temp);
            }
            );
    
        });
    };

    useEffect(() => {
       
        abrirtablaCatalogo();
    }, [texto]);




    return (
            
        <View>
           {posts == null ? (
                <NoFoundCatalogo />
            ) : (<View>
            <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                renderItem={({ item }) => (<ListCatalogo catalogo={item} navigation={navigation} /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />
            </View>)}
        </View>
        
    
)
   
};


function NoFoundCatalogo(){
    return(<View style={{flex: 1, alignItems: 'center', }}>
    <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode = "cover"
        style={{width: 200, height: 200}}
    />
</View>); 
}



function ListCatalogo(props){
    const {catalogo, navigation} = props;
    const {ct_codigo,ct_nomcata, ct_nomcliente, ct_codcliente, ct_descargado, ct_cantprod, ct_cantpromo, ct_cantliqui, ct_cantprox} = catalogo;

    const goCatalogo = () =>{
        console.log("Detalle Catalogo");
        navigation.navigate("scatalogo",{ct_codigo,ct_nomcata, ct_nomcliente, ct_codcliente}); 
    }

    return (<TouchableOpacity onPress={goCatalogo}>
                <View style={styles.productoCardWrapper}>
                
                    <View style={styles.productoTexto}>
                        <Text style={styles.productoReferencia}>{ct_nomcata}</Text>
                        <Text style={styles.productoCodigo}>{ct_nomcliente}</Text>
                        <Text style={styles.productoConf}>Cantidad producto: {ct_cantprod}</Text>
                        <Text style={styles.productoConf}>Cantidad promociones: {ct_cantpromo}</Text>
                        <Text style={styles.productoConf}>Cantidad liquidaciones: {ct_cantliqui}</Text>
                        <Text style={styles.productoConf}>Cantidad próximos: {ct_cantprox}</Text>
                        
                    </View>
                    <View style={styles.productoPrecio}>
                                <Text style={styles.textoPrecio}>Descargado:</Text>
                                <Text style={styles.textoPrecio}>{ct_descargado}</Text>
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
        marginTop:10,
        height: 120,
        flexDirection: 'row',
    },  
    productoTexto:{
        flexDirection: 'column',
        width: 250,
    },
    productoPrecio:{
        flexDirection: 'column',
        width: 100,
        height:100,
        paddingRight: 5,
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