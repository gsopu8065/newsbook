import React from 'react';
import { ActivityIndicator, View} from 'react-native';
import News from './News.js';

export default class App extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            isLoading: true,
            newsResponse: [],
            newsGifs : []
        }
    }

    componentDidMount(){
        this.getNews(1);
        this.getNewsGifs();
    }

    updateNews = () =>{
        this.getNews((this.state.newsResponse.length/20)+1);
    };

    getNews = async(page)=> {

        let newsSource = [ 'abc-news',
            'associated-press',
            'bloomberg',
            'business-insider',
            'buzzfeed',
            'cbs-news',
            'cnbc',
            'cnn',
            'entertainment-weekly',
            'espn',
            'fox-news',
            'google-news',
            'msnbc',
            'nbc-news',
            'new-york-magazine',
            'reuters',
            'techcrunch',
            'the-hill',
            'the-huffington-post',
            'the-new-york-times',
            'the-wall-street-journal',
            'the-washington-post',
            'the-washington-times',
            'time',
            'usa-today',
            'vice-news',
            'wired' ];

        try{
            let response = await fetch("https://newsapi.org/v2/top-headlines?sources="+newsSource.join(',')+"&apiKey=839f0f8daf4d4272974b591d388a3374&page="+page);
            let news = await response.json();
            let updatedNews =  this.state.newsResponse.concat(news.articles);
            this.setState({
                isLoading: false,
                newsResponse: updatedNews
            });
        } catch (e) {
            console.log(e);
        }
    };

    updateGif = () =>  this.getNewsGifs();

    getNewsGifs = async() => {
      try{
          let response = await fetch("https://7vhdj5npxi.execute-api.us-east-2.amazonaws.com/prod/getallgifs");
          let newsGifs = await response.json();
          this.setState({
              newsGifs : (newsGifs && newsGifs.data) || []
          })
      }
      catch (e) {
      }
    };

    render() {

        let filteredNews = this.state.newsResponse.filter((eachNews) => (eachNews.urlToImage != null));

        if(this.state.isLoading){
            return(
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return (<News filteredNews={filteredNews} gifs={this.state.newsGifs} updateGif={this.updateGif} updateNews={this.updateNews}/>);
    }
}
