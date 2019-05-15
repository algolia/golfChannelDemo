const searchClient = algoliasearch('0M6I92SH9L', '95c5542bd91e15ab39092e87e3785987');

// const search = instantsearch({
//   indexName: 'articles_raw',
//   searchClient,
// });

// search.addWidget(
//   instantsearch.widgets.searchBox({
//     container: '#searchbox',
//   })
// );

// search.addWidget(
//   instantsearch.widgets.hits({
//     container: '#hits',
//   })
// );

// search.start();

const articlesearch = instantsearch({
    searchClient,
    indexName: 'ARTICLES',
    routing: false,
    searchParameters: {
        hitsPerPage: 3,
        attributesToSnippet: ['content:100'],
        snippetEllipsisText: " [...]"
    },
    searchFunction: function (helper) {
        var query = articlesearch.helper.state.query;
        setTimeout(() => {
            videosearch.helper.setQuery(query)
            videosearch.helper.search();
            helper.search();
        }, 500)
    }
});

articlesearch.addWidget(
    instantsearch.widgets.searchBox({
        placeholder: 'Search for articles or videos',
        container: '#searchbox',
        autoFocus: false,
        showSubmit: false,
        showReset: true
    })
);

articlesearch.addWidget(
    instantsearch.widgets.stats({
        container: '#article-stats',
        templates: {
            text: `
            Articles (
              {{#hasNoResults}}No results{{/hasNoResults}}
              {{#hasOneResult}}1 result{{/hasOneResult}}
              {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}}{{/hasManyResults}})
            `,
          },
      })
);

const videosearch = instantsearch({
    searchClient,
    indexName: 'VIDEOS',
    routing: false,
    searchParameters: {
        hitsPerPage: 4,
        attributesToSnippet: ['content:10'],
    }
});


articlesearch.addWidget(
    instantsearch.widgets.hits({
        container: '#articles',
        templates: {
            item: articleTemplate,

        }
    })
);

videosearch.addWidget(
    instantsearch.widgets.hits({
        container: '#videos',
        templates: {
            item: videoTemplate,

        }
    })
);

videosearch.addWidget(
    instantsearch.widgets.stats({
        container: '#video-stats',
        templates: {
            text: `
            Videos  (
              {{#hasNoResults}}No results{{/hasNoResults}}
              {{#hasOneResult}}1 result{{/hasOneResult}}
              {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}}{{/hasManyResults}})
            `,
          },
      })
);

articlesearch.start();
videosearch.start();

function articleTemplate(hit) {
    return `
    <div class="result">
        <div class="result__category"></div>
        <div class="result__image">
            <a
                href=${hit.path}><img
                    src=${hit.thumbnail.image.uri}
                    alt=${hit.title}></a>
        </div>
        <div class="result__text">
            <div class="result__text__title"><a
                    href=${hit.path}>${hit._highlightResult.title.value}</a></div>
            <span class="result__text__teaser">${hit._highlightResult.summary.value}</span>
            <span class="result__text__tag">${hit.tag}</span>
        </div>
        </div>
    `
}

function videoTemplate(hit){
    return `
    <div class="result">
        <div class="result__image">
            <a
                href=${hit.path}><img
                    src=${hit.thumbnail.image.uri}
                    alt=${hit.title}></a>
        </div>
        <div class="result__text">
            <div class="result__text__title"><a
                    href={hit.full_url}>${hit._highlightResult.title.value}</a></div>
            <span class="result__text__teaser">${hit._highlightResult.body.value}</span>
            <span class="result__text__tag">${hit.tag}</span>
        </div>
    </div>
    `
}

