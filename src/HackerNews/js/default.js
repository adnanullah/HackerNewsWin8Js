(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var articlesList = WinJS.Binding.List;
    var activation = Windows.ApplicationModel.Activation;
    //Thumbnail generation provided via: http://pagepeeker.com/

    function retrieveFeedData() {
        WinJS.xhr({ url: "http://www.hnsearch.com/rss" }).then(function (rss) {
            var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
            xmlDoc.loadXml(rss.responseText);

            var items = xmlDoc.getElementsByTagName("item");
            generateThumbnails(items)
            parseFeedData(items);

        });
    }

    function generateThumbnails(items) {
        var pagepeekerCode = "xxxxx";
        var baseUrl = "http://pagepeeker.com/thumbs.php?size=l&code=".concat(pagepeekerCode);
        for (var n = 0, Length = items.length; n < iLength; n++) {
                var node = items[n];
                var link = node.getElementsByTagName("link")[0].innerText;

                // Make request to generate a thumbnail
                var thumbnailurl = baseUrl.concat("&url=").concat(link);
                WinJS.xhr({ url: thumbnailurl }).then(function (response) {
                    var contentType = response.getResponseHeader("content-type");
                    if (contentType == "image/gif") setTimeout(function () { }, 500);
                });

         }
    }

    function parseFeedData(items) {
        var pagepeekerCode = "xxxxx";
        var baseUrl = "http://pagepeeker.com/thumbs.php?size=l&code=".concat(pagepeekerCode);

        for (var n = 0, iLength = items.length; n < iLength; n++) {
            var article = {};
            var node = items[n];
            article.link = node.getElementsByTagName("link")[0].innerText;
            var pagepeekerCode = "xxxxx";
            var thumbnailurl = baseUrl.concat(pagepeekerCode).concat("&url=").concat(article.link);
            article.thumbnail = thumbnailurl;
            article.title = node.getElementsByTagName("title")[0].innerText;
            article.thread = node.getElementsByTagName("comments")[0].innerText;
            article.comments = (node.getElementsByTagName("num_comments")[0]) ? node.getElementsByTagName("num_comments")[0].innerText : "0";
            article.points = (node.getElementsByTagName("points")[0]) ? node.getElementsByTagName("points")[0].innerText : "0";
            article.overlay = "Comments: ".concat(article.comments).concat(" | Points: ").concat(article.points);
            articlesList.push(article);
        }
    }

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: Handle application state initialisation
            } else {
                // TODO: Handle application state resume
            }
            articlesList = new WinJS.Binding.List();
            var publicMembers = { ItemList: articlesList };
            WinJS.Namespace.define("HNData", publicMembers);
            args.setPromise(WinJS.UI.processAll().then(retrieveFeedData));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: Persist application state to WinJS.Application.sessionState
    };

    app.start();
})();