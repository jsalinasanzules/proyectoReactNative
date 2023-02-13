import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default class FamiliaData extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        data: [],
        isLoading: true
      };
    }
  
    componentDidMount() {
      fetch('https://app.cotzul.com/Catalogo/php/conect/db_getAllData.php')
        .then((response) => response.json())
        .then((json) => {
        //  console.log(json.productos)
          this.setState({ data: json.productos });
        })
        .catch((error) => console.error(error))
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  
      render() {
        const { data, isLoading } = this.state;
  
      return (
        <View style={{ flex: 1, padding: 24 }}>
        <Text>Lista de Productos</Text>
          {isLoading ? <ActivityIndicator/> : (
            <FlatList
              data={this.state.data}
              keyExtractor={( id , index) => index.toString()}
              renderItem={({ item }) => ( <Text>{item.pr_codprod}</Text>)}
              ListFooterComponent={() => <View style={{flex:1,justifyContent: "center",alignItems: "center"}}><Text style={styles.finalproducto}>--- Fin de busqueda ---</Text></View>}
            />
            
          )}
        </View>
      );
    }
  };

  

