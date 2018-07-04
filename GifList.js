import React from 'react';
import {View, Image, FlatList} from 'react-native';
export default class GifList extends React.Component {
    constructor(props) {
        super(props);
    }

    static _renderItem({item}) {
        return <Image style={{height: 150, width: '70%', marginBottom: 5, marginLeft: '15%'}}
                      source={{uri: item}} resizeMode='stretch'/>;
    };

    render() {

        if(this.props.gifs.length > 0) {
            return (<View style={{height: '100%', backgroundColor: 'white', marginTop: 5}}>
                <FlatList
                    data={this.props.gifs[0].gifs.reverse()}
                    renderItem={GifList._renderItem}
                    keyExtractor={(item, index) => index + ""}
                />
            </View>);
        }
        else {
            return(<View/>);
        }
    }
}