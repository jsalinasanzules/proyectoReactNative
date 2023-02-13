import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Clientes from "../screens/Clientes";
import SCatalogo from "../productos/SCatalogo";
import SCliente from "../productos/SCliente";

const Stack = createStackNavigator();
export default function ClienteStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="clientes"
            component={Clientes}
            options={{title:"Listado de clientes"}} />
            <Stack.Screen 
            name="scliente"
            component={SCliente}
            options={{title:"Cliente seleccionado"}} />
            <Stack.Screen 
            name="scatalogo"
            component={SCatalogo}
            options={{title:"Catálogo seleccionado"}} />
        </Stack.Navigator>
    );
}