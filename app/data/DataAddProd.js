import React, {useState, useEffect} from 'react'
import { colors, CheckBox } from "react-native-elements";
import { Image, FlatList, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView} from 'react-native';
import axios from 'axios'
import {locationsRef} from "../utils/firebase"
import * as SQLite from 'expo-sqlite';
import {useNavigation} from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from "@react-native-community/netinfo";

const STORAGE_KEY = '@save_productos'
const database_name = 'CotzulBD.db';
const database_version = '1.0';
const database_displayname = 'CotzulBD';
const database_size = 200000;

export default function  DataAddProd(props) {
    var sql1 = "SELECT * FROM Producto WHERE pr_referencia LIKE ?";
    const [posts, setPosts] = useState([])
    const {texto, tipocat, ArrayDatos, sql} = props;  //1 = productos; 2 = promociones; 3=liquidaciones; 4=x llegar; 5= combos
    const [cont, setCont] = useState(0);

    
    useEffect(()=>{
        var temp = [];
        setPosts(temp);
        console.log("recarga data")
        getDataProducto();  
    },[cont])

    useEffect(() => {
        setCont(cont+1)
    }, [texto]);

   const getDataProducto = async () => {
        db = SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
        ); 
        console.log("entro tambien: "+texto)
        db.transaction((tx) => {
            console.log("sql elegido: "+sql)
            tx.executeSql(
            sql,
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


    

    return (
           
        <View>
            {(posts.length <= 0) ? (
                <NoFoundProducts />
            ) : (<View>
                <FlatList
                data = {posts}
                keyExtractor={( id , index) => index.toString()}
                onEndReachedThreshold={0.7}
                renderItem={({ item }) => (<ListProducto producto={item} ArrayDatos={ArrayDatos} /> )} 
                ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
                />

            </View>)}
        </View>     
    )

};




function ListProducto(props){
    const {producto, ArrayDatos} = props;
    const {pr_codigo,pr_codprod, pr_referencia, pr_familia, pr_nivel1, pr_nivel2, pr_pvp, pr_rutaimg, pr_stock, pr_arrayimg} = producto;
    const [check, setCheck] = useState(false);
    
    const AgregaProducto = (check, pr_codigo) => {
        var index = 0;
        if(!check){
            ArrayDatos.push(pr_codigo);
        }else{
            index = ArrayDatos.indexOf(pr_codigo);
            ArrayDatos.splice(index, 1);
        }
        console.log("codigo producto: " + pr_codigo)
        console.log(ArrayDatos)
        setCheck(!check)
    }

    return (<TouchableOpacity >
                <View style={styles.productoCardWrapper}>
                <View style={styles.checkbox}>
                    <CheckBox
                        checked={check}
                        onPress={()=> AgregaProducto(check, pr_codigo)}
                        
                        />
                    </View>
                <View style={styles.productoImage}>
                   
                        <Image PlaceholderContent = {<ActivityIndicator color="fff" />}
                        style={{width:100, height:100}}
                        source={{uri: pr_rutaimg}}
                        /> 
                    
                </View>
                    
                    <View style={styles.productoTexto}>
                        <Text style={styles.productoReferencia}>{pr_referencia}</Text>
                        <Text style={styles.productoCodigo}>{pr_codprod}</Text>
                        <Text style={styles.productoCodigo}>cant: {pr_stock}</Text>
                    </View>
                    
                </View>
                </TouchableOpacity>);
}


function NoFoundProducts(){
    return(<View style={{flex: 1, alignItems: 'center', }}>
    <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode = "cover"
        style={{width: 200, height: 200}}
    />
</View>); 
}


const styles = StyleSheet.create({
    productoCardWrapper:{
        backgroundColor: '#CDCDCD',
        borderRadius:25,
        paddingTop: 10,
        paddingLeft: 10,
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        flexDirection: 'row',
    },  
    productoTexto:{
        flexDirection: 'column',
        width: 150,
        paddingHorizontal:15,
    },
    productoPrecio:{
        flexDirection: 'column',
        width: 70,
        height:100,
        paddingRight:10,
    },
    textoPrecio:{
        textAlign:'left',
        paddingTop:80,
        color:'#9462c1',
        fontSize: 12,
    },
    productoReferencia:{
        color:'#9462c1',
        paddingLeft: 10,
        fontSize: 12,
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
    },
    checkbox: {
        marginTop: 20
      }

});