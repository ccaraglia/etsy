//keystring : ub1hcoexwc9g7jywvexn9g22
//shared secret : 8o6fy1cv39
//url : https://openapi.etsy.com/v2/listings/active.js?api_key=ub1hcoexwc9g7jywvexn9g22
//



var ItemsCollection = Backbone.Collection.extend({
    url: 'https://openapi.etsy.com/v2/listings/active.js',
//    '?includes=Images,Shop&',
    _key: 'ub1hcoexwc9g7jywvexn9g22',
    parse: function(res) {
        //takes as input the raw response. use parse if you need to
        //drill down and find the array that you want to use as your
        //array of models. return that array. it will get stored on the
        // .models property of the collection.
        return res.results
    }
})


var ItemModel = Backbone.Collection.extend({

    // url: function(id) {

    //     return 'https://openapi.etsy.com/v2/listings/' + id + '.js'
    // },
    // // listingId ,ust be received in an initilie ,ethod and passed in when we invoke the constructor

    // _key: 'ub1hcoexwc9g7jywvexn9g22',
    // parse: function(res){

    //     return res
    // }

    generateUrl : function (id) {
        this.url ='https://openapi.etsy.com/v2/listings/'+ id +'.js?includes=Images,Shop&api_key=aavnvygu0h5r52qes74x9zvo&callback=?'}


})

var ItemsView = Backbone.View.extend({
    el : '#container',

    initialize: function(theCollection){
        this.coll = theCollection
    },


    events: {
        "click .itemsContainer": "_handleClick"
    },


    _handleClick: function(e) {
        var itemDiv = e.currentTarget
     //   console.log(e)
        //window.itemDiv = itemDiv
        location.hash = 'details/' + itemDiv.getAttribute('data-pid')
    },


    _render : function(){
//console.log(this.coll.models)
        var stringHTML = ''
        var htmlPic = ''

            for (var i=0; i < this.coll.models.length; i++){
//console.log(this.coll.models[i].attributes.Images.length)
                if (this.coll.models[i].attributes.Images.length > 0){
                    htmlPic = this.coll.models[i].attributes.Images[0].url_170x135

                }else{
                    htmlPic='./placeholder.jpg'

                }

                stringHTML += '<div class="itemsContainer" data-pid="'+this.coll.models[i].attributes.listing_id+'">'
                stringHTML +=     '<p class="title">' + this.coll.models[i].attributes.title + '</p>' +
                                  '<img src="' + htmlPic + '">' +
                                  '<p class="price">' +
                                      this.coll.models[i].attributes.currency_code + ' ' + this.coll.models[i].attributes.price +
                                  '</p>'
                stringHTML+= '</div>'
            }
            this.el.innerHTML = stringHTML
    }



})


var DetailView = Backbone.View.extend({
    el : '#container',

    initialize: function(itemData){
        this.coll = itemData


    },

    _render : function(){

//console.log(this.coll)
        stringHTML = ''
        htmlPic=''

        console.log(this.coll.results[0])

        if (this.coll.results[0].Images.length > 0){
                    htmlPic = this.coll.results[0].Images[0].url_170x135

                }else{
                    htmlPic='./placeholder.jpg'

                }

            stringHTML += '<div class="itemsContainer" data-pid="'+this.coll.results[0].listing_id+'">'
                stringHTML +=     '<p class="title">' + this.coll.results[0].title + '</p>' +
                                  '<img src="' + htmlPic + '">' +
                                  '<p class="price">' +
                                      this.coll.results[0].currency_code + ' ' + this.coll.results[0].price +
                                  '</p>'
                stringHTML+= '</div>'

            this.el.innerHTML = stringHTML


    }



})

var EtsyRouter = Backbone.Router.extend({
    routes: {
        "details/:id": "doDetailView",
        "search/:keyword": "doItemSearchView",
        "home": "doListView",
        "*catchall": "goHome"
    },

    doDetailView: function(id) {


        var item = new ItemModel()
        item.generateUrl(id)
        console.log(item)
        item.fetch({

            dataType: 'jsonp',
            data: {
                api_key: item._key,
                includes: 'Images,Shop',
                processData: true,
                }

        }).then( function(itemData){

        var object = new DetailView(itemData)
        object._render()
    })

    },


    doItemSearchView: function(keyword) {
        console.log(keyword)
        var searchItems = new ItemsCollection(keyword)
        searchItems.fetch({

                dataType: 'jsonp',
                data: {
                    api_key: searchItems._key,
                    includes: 'Images,Shop',
                    keywords: keyword,
                    processData: true,
                }

        }).then( function(d){
                var itemsView = new ItemsView(searchItems)
                itemsView._render()
        }

        )




    },

    doListView: function() {
    //    console.log('home view')
        var listItems = new ItemsCollection()

        listItems.fetch({

            dataType: 'jsonp',
            data: {
                api_key: listItems._key,
                includes: 'Images,Shop',
                processData: true,

            }

        }).then( function(d){
            var itemsView = new ItemsView(listItems)
            itemsView._render()
        }

        )

    },

    goHome: function(){
        location.hash = 'home'},

    initialize: function() {
        Backbone.history.start()
    }
})

new EtsyRouter()


document.querySelector('input').addEventListener('keydown',function(e) {
    if (e.keyCode === 13) {
        location.hash = "search/" + e.target.value
        e.target.value = ''
    }
})