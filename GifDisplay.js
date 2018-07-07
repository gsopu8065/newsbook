import React from 'react';
import { View, TouchableHighlight, Alert, StyleSheet, Text} from 'react-native';
import GifBrowser from './GifBrowser.js';
import GifList from './GifList.js';
import { Icon } from 'react-native-elements'

export default class GifDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            plusClicked: false,
            gifHeight: '50%'
        }
    }
    addGifComment = async (gifLink) =>{

        let response = await fetch('https://7vhdj5npxi.execute-api.us-east-2.amazonaws.com/prod/postnewsGif', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "key" : this.props.news.title,
                "value": gifLink
            }),
        });
        this.props.updateGif();
        this.setState({plusClicked: false,gifHeight: "50%"});
    };

    changeHeight = (height) =>{
        this.setState({gifHeight: height});
        if(height === "80%"){
            //set swipable false
            this.props.setSwipable(false);
        }
        else {
            //set swipable true
            this.props.setSwipable(true);
        }
    };

    render(){
        const newsGifs = this.props.newsGifs || [];
        return <View style={{height: this.state.gifHeight, display: this.props.display? 'flex' :'none'}} >
            <View style={{height: '8%', display: (newsGifs.length > 0 )? 'flex' :'none'}}>
                <TouchableHighlight style={{display: this.state.plusClicked? 'none' :'flex'}}>
                    <View style={styles.navBar}>
                        <View style={styles.rightContainer}>
                            <Icon onPress={()=>{
                                this.setState({plusClicked: true});
                            }} name="plus-circle"
                                type="font-awesome"
                                color='black' />
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{display: this.state.plusClicked? 'flex' :'none'}}>
                    <View style={styles.navBar}>
                        <View style={styles.leftContainer}>
                            <Text  onPress={() => {
                                this.setState({plusClicked: false});
                            }} style={[styles.text, {textAlign: 'left'}]}>{'< Back'}</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <Icon
                                onPress={() => {
                                    this.setState({plusClicked: false});
                                }}
                                name="close"
                                type="font-awesome"
                                color='black' />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={{height: '100%', display: (newsGifs.length === 0 || this.state.plusClicked )? 'flex' :'none'}}>
                <GifBrowser addGifComment={this.addGifComment} changeHeight={this.changeHeight}/>
            </View>
            <View style={{height: '100%', display: (newsGifs.length > 0 && !this.state.plusClicked )? 'flex' :'none'}}>
                <GifList gifs={newsGifs}/>
            </View>
        </View>
    }

}


const styles = StyleSheet.create({
    navBar: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#eff0f2'
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        right: 10,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    text:{
        color: 'black',
        fontSize: 15,
        fontWeight: "900"
    }
});
