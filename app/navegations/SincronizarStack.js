import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Sincronizar from "../screens/Sincronizar";

const Stack = createStackNavigator();
export default function SincronizarStack(){
    
    return(
        <Stack.Navigator>
            <Stack.Screen 
            name="nav_sincronizar"
            component={Sincronizar}
            options={{title:"Sincronizar Información"}} />
        </Stack.Navigator>
        
    );
}