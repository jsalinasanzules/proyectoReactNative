
import React, {useEffect, useState, Component} from 'react'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { FlatList } from "react-native-gesture-handler";

export default function ObsCharge(props) {
    const {iddoc} = props;
    const [data, setData] = useState([])
    const[loading, setLoading] = useState(false);


    const item =({item}) =>{
        return( 
            
           
            <View style={{flexDirection: 'row', backgroundColor: item.background}}>
                <View style={{width:40, height: 30, borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{item.ob_detdoc}</Text>
                </View>
                <View style={{width:124, height: 30,  borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{item.ob_obs}</Text>
                </View>
                <View style={{width:82, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{item.ob_usuario}</Text>
                </View>
                <View style={{width:82, height: 30,   borderColor: 'black', borderWidth: 1}}>
                    <Text style={styles.tabletext}>{item.ob_fecha}</Text>
                </View>
            </View>
        )
        }

   
        
        

    const CargarDataObs = async () => {
        try {
          const response = await fetch(
            "https://app.cotzul.com/Pedidos/getObsN.php?iddoc="+iddoc
          );
          console.log("https://app.cotzul.com/Pedidos/getObsN.php?iddoc="+iddoc);
          const jsonResponse = await response.json();
          setData(jsonResponse?.observaciones);
          setLoading(true);
          
        } catch (error) {
          setLoading(false);
          console.log("un error cachado observaciones");
          console.log(error);
        }
    };


    useEffect(() => {
        CargarDataObs();
    }, []);

    return (
        <View style={{ marginHorizontal:20, marginTop:10, width: 350}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{width:40, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>#Obs.</Text>
                    </View>
                    <View style={{width:124, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Observacion</Text>
                    </View>
                    <View style={{width:82, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Usuario</Text>
                    </View>
                    <View style={{width:82, backgroundColor:'#9c9c9c', borderColor: 'black', borderWidth: 1}}>
                        <Text style={styles.tabletitle}>Fecha</Text>
                    </View>
                </View>
                {(loading) ? (<FlatList 
                    data={data}
                    renderItem = {item}
                    keyExtractor = {(item, index)=> index.toString()}
                />) : <ActivityIndicator
                      size="large" 
                      loading={loading}/>} 
                
            </View>
    )
}

const styles = StyleSheet.create({

    tabletitle:{
        fontSize: 12,
    },
    tabletext:{
        fontSize: 12,
    },
})
