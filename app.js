const express       = require('express'),
      request       = require('request'),
      path          = require('path'),
      logger        = require('morgan'),
      cookieParser  = require('cookie-parser'),
      bodyParser    = require('body-parser'),
      app           = express(),
      port            = env.process.PORT || 8000;
      TelegramBot   = require('node-telegram-bot-api'),
      cheerio       = require('cheerio'),
      Token         = '181230642:AAF6M486f2TJG-6GLG1466RRhvaWjZKQSr8',
      Bot           = new TelegramBot(Token, { polling: true });
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Bot.sendMessage('@zxcvbnvf', "test", { 'parse_mode': 'HTML', 'disable_web_page_preview': true }).then( function() {
//     console.log( 'Message sent' );
// });
var url = 'http://pop-music.ir/category/single-music/page/1';
app.get('/' , function (req, res) {
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, artist, str, output, link;
            $('.post h2').filter(function(){

                var data = $(this);
                str = data.find('a').first().text();
                link = data.find('a').first().attr('href');
                console.log(link);
                str = str.split('بنام');
                title = str[1];
                artist = str[0].replace( "دانلود آهنگ جدید" , "");
                var alink = "test";
                request(link, function(error2, response, html2){
                    if(!error2){
                        var $$ = cheerio.load(html2);

                        $$('.download').filter(function(){
                            var newdata = $(this);
                            alink = newdata.find('a').last().attr('href');
                        });
                        output = "عنوان : " + title + " خواننده: " + artist + "\n" + alink;
                        // console.log(title);
                        Bot.sendMessage('@zxcvbnvf', output, { 'parse_mode': 'HTML', 'disable_web_page_preview': true }).then( function() {
                            console.log( 'Message sent' );
                        });
                    }
                });



            })
        }
    });
    res.send('Success');
});

app.listen(port);