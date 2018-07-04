import React from 'react';
import {View, Image, FlatList, TouchableHighlight} from 'react-native';
import {SearchBar} from 'react-native-elements';
import qs from "qs";

export default class GifBrowser extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            gifs: [],
            query: ""
        }
    }

    componentDidMount() {
        this.getGifs();
    }

    getGifs = async () => {

        let limit = 20;
        let q = this.state.query;
        let offset = this.state.offset;

        let api_key = "ABQXmgPgCE1ewAARgZZcb5HqtURWySHS";
        let url = (q.length === 0) ?
            'https://api.giphy.com/v1/gifs/trending?'+ qs.stringify({api_key, limit, offset}) :
            'https://api.giphy.com/v1/gifs/search?'+ qs.stringify({q, api_key, limit, offset});
        let response = await fetch(url);
        let gifs = await response.json();
        let gifsUrls = gifs.data.map((gif) => {
            return gif.images.preview_gif.url;
        });
        let newGifsUrls = (this.state.offset > 0 && this.state.gifs.concat(gifsUrls)) || gifsUrls;
        this.setState({gifs: newGifsUrls});
    };

    searchKey = () => {
        this.state.offset = 0;
        this.getGifs();
        this.flatList.scrollToIndex({index:0});
    };

    onSwipedUp= (state)=>{
        this.props.changeHeight("80%");
    };

    updateGif = () =>{
        this.state.offset = this.state.offset + 20;
        this.getGifs();
    };

    onPressItem = (item) =>{
        this.props.addGifComment(item);
    };

    renderItem({ item, index }) {
        return <View style={{
                                       flex: 1,
                                       margin: 2,
                                       width: '50%',
                                       height: 100,
                                       backgroundColor: '#CCC'
                                   }}>
            <TouchableHighlight onPress={this.onPressItem.bind(this,item)}>
                <Image style={{height: '100%', width: '100%'}}
                          source={{uri: item}} resizeMode='stretch' />
            </TouchableHighlight>
        </View>
    }

    handleQueryChange = query => {
        this.setState(state => ({ query: query || "" }));
        if(query === ""){
            this.state.query = "";
            this.state.offset = 0;
            this.getGifs();
            this.props.changeHeight("50%");
            this.searchBar.blur();
        }
    };
    handleSearchCancel = () => this.handleQueryChange("");
    handleSearchClear = () => this.handleQueryChange("");

    render() {

        return (<View style={{height: '100%', backgroundColor: 'white'}}>
            <SearchBar
                round
                lightTheme
                clearIcon
                placeholder='Type Here...'
                returnKeyType='search'
                ref={search => this.searchBar = search}
                onChangeText={this.handleQueryChange}
                onCancel={this.handleSearchCancel}
                onClear={this.handleSearchClear}
                onBlur = {this.searchKey}
                onFocus = {this.onSwipedUp}
                value={this.state.query}
            />
            <FlatList
                ref={flatList => this.flatList = flatList}
                contentContainerStyle={{margin:2}}
                horizontal={false}
                data={this.state.gifs}
                numColumns = {2}
                onEndReached = {this.updateGif}
                renderItem={this.renderItem.bind(this)}
                onRefresh={this.onRefresh}
                refreshing={false}
                keyExtractor={(item, index) => index + ""}
            />
        </View>);
    }
}