import React, {useState, useRef}  from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import {Image} from "react-native-elements";
import Carousel from "react-native-snap-carousel";
import {PinchGestureHandler} from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";


export default function CarouselImages(props) {
    const {arrayImages, height, width} = props;
    const [dialog, setDialog] = React.useState(null);
    const [internet, setInternet] = useState(true);

   NetInfo.fetch().then(state => {
        console.log("Connection type carousel", state.type);
        console.log("Is connected?", state.isConnected);
        setInternet(state.isConnected)
    });

    const renderItem = ({item, index}) =>{
        return (<>
                {(internet) ? <TouchableOpacity onPress={() => setDialog(index)}>
                <Image style={{width,height}} source={{uri:item}} />
                </TouchableOpacity> :
                <TouchableOpacity>
                <Image style={{width,height}} source={require("../../assets/img/noexiste.png")} />
                </TouchableOpacity>   }
            
            </> 
         )

    }

    


    return (
        <Carousel 
            layout={"default"}
            data={arrayImages}
            sliderWidth={width}
            itemWidth={width}
            renderItem={renderItem}
        />
    )
}

const styles = StyleSheet.create({})


