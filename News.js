import React from 'react';
import {StyleSheet, Text, View, ImageBackground, TouchableHighlight, WebView, Platform, ActivityIndicator} from 'react-native';
import Swiper from 'react-native-swiper';
import GifDisplay from './GifDisplay.js';
import { Icon } from 'react-native-elements';
import GestureRecognizer from 'react-native-swipe-gestures';

export default class News extends React.Component {

    constructor(props) {
        super(props);
        this.gifDisplay = React.createRef();
        this.swiperRef = React.createRef();
        this.state = {
            currentIndex: 0,
            linkClicked: false,
            swipable: true
        }
    }

    onLinkPress = ()=>{
        this.setState({linkClicked: true, swipable: false})
    };

    onSwipedUp = (state)=>{
        if(this.gifDisplay.current != null) {
            this.gifDisplay.current.changeHeight("80%");
            if(this.swiperRef.current != null) {
                this.setState({swipable: false});
            }
        }
    };

    onSwipedDown = (state)=>{
        if(this.gifDisplay.current != null) {
            this.gifDisplay.current.changeHeight("50%");
            if(this.swiperRef.current != null) {
                this.setState({swipable: true});
            }
        }
    };

    setSwipable = (flag) => this.setState({swipable: flag});

    ActivityIndicatorLoadingView = () => {

        return (
            <ActivityIndicator
                color='#009688'
                size='large'
                style={styles.ActivityIndicatorStyle}
            />
        );
    };

    render() {
        const newsTitle = this.props.filteredNews[this.state.currentIndex].title;
        const newsUrl = this.props.filteredNews[this.state.currentIndex].url;
        const  newsGifs = this.props.gifs.filter((eachNews) => (eachNews.title === newsTitle));

        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        return (<View style={{height: '100%'}}>
            <Swiper style={styles.wrapper} loop={false} showsPagination={false}
                    index={this.state.currentIndex}
                    ref={this.swiperRef}
                    scrollEnabled={this.state.swipable}
                    onIndexChanged={(index) => {
                this.setState({currentIndex: index});
                if(index+2 === this.props.filteredNews.length){
                    this.props.updateNews();
                }

            }}>
                {this.props.filteredNews.map((eachNews, index) => {
                    return (<View style={styles.slide} key={eachNews.title}>
                        <GestureRecognizer
                            onSwipeUp={this.onSwipedUp}
                            onSwipeDown={this.onSwipedDown}
                            config={config}
                            style={{flex: 1}}
                        >
                        <ImageBackground
                            source={{uri: eachNews.urlToImage}}
                            style={{flex: 1, width: '100%'}}
                            resizeMode='stretch'
                        >
                            <View style={styles.absolute} >
                            <TouchableHighlight onPress={this.onLinkPress}>
                                <Text style={styles.text}>{eachNews.title.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
                            </TouchableHighlight>
                            </View>

                        </ImageBackground>
                        </GestureRecognizer>
                    </View>)
                })}
            </Swiper>
            <GifDisplay setSwipable={this.setSwipable} updateGif={this.props.updateGif} ref={this.gifDisplay} newsGifs={newsGifs} news={this.props.filteredNews[this.state.currentIndex]} display={!this.state.linkClicked}/>
            <View style={{display: (this.state.linkClicked)? 'flex' :'none',height:'80%'}}>
                <TouchableHighlight onPress={() => {this.setState({linkClicked: false, swipable: true})}}>
                    <View style={styles.navBar}>
                        <View style={styles.leftContainer}>
                            <Text style={[styles.text, {textAlign: 'left'}]}>{'< Back'}</Text>
                        </View>
                        <View style={styles.rightContainer}>
                            <Icon name="close" type="font-awesome" color='black' />
                        </View>
                    </View>
                </TouchableHighlight>
                <WebView
                    source={{uri: newsUrl}}
                    style={styles.WebViewStyle}
                    javaScriptEnabled={true}
                    renderLoading={this.ActivityIndicatorLoadingView}
                    startInLoadingState={true}
                />
            </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    },
    wrapper: {
        height: '0%'
    },
    slide: {
        flex: 1,
        flexDirection: 'column'
    },
    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: "900",
        margin: 5
    },
    absolute: {
        position: "absolute",
        left: 0, bottom: 0, right: 0,
        height: 'auto',
        backgroundColor: 'white',
        opacity: 0.8
    },
    image: {
        width: 100,
        height: 100
    },

    navBar: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#c4f2f1'
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
    WebViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        marginTop: (Platform.OS) === 'ios' ? 20 : 0
    },
    ActivityIndicatorStyle:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
