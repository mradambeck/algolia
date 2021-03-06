console.log('Sanity check: search.js');

var app = angular.module('algolia-challenge', ['algoliasearch']);

app.controller('SearchCtrl', ['$scope', 'algolia', function($scope, algolia) {

  // View model for search results
  $scope.search = {
    query: '',
    hits: [],
    brands: [],
    products: [],
    categories: []
  };


  // API access tokens
  var appId = 'LSTLHX1M78',
      apiKey = '2d33957a1e2b70a7d312983b2a1058d7';

  // Setup Algolia client and indices
  var client = algolia.Client(appId, apiKey),
      searchIndex = client.initIndex('best_buy-demo_data'),
      brandIndex = client.initIndex('best_buy-brand'),
      nameIndex = client.initIndex('best_buy-name'),
      categoriesIndex = client.initIndex('best_buy-categories');


  // Search functionality
  $scope.$watch('search.query', function() {

    // SEARCH RESULTS
    searchIndex.search($scope.search.query)
      .then(function searchSuccess(content) {
        var hits = content.hits;

        for (var i = 0; i < hits.length; i++) {
          hits[i].stars = setStars(hits[i].popularity);
        }

        // add content of search results to scope for display in view
        $scope.search.hits = hits;

      }, function searchFailure(err) {
        console.error(err);
      }
    );


    // AUTOCOMPLETE
    var createAutoComp = function (keyType, index) {

      // clear previous keywords
      $scope.search.brands = [];
      $scope.search.products = [];
      $scope.search.categories = [];

      index.search($scope.search.query)
        .then(function searchSuccess(content) {

            // Create keywords
            var thisKeyHash = generateKeywords(content.hits, keyType);

            // push keywords to arrays
            while (thisKeyHash.keywords.length > 0) {
              switch(thisKeyHash.keyType) {
                case 'brand':
                  $scope.search.brands.push(thisKeyHash.keywords.pop());
                  $scope.search.brands = dedupe($scope.search.brands).sort().splice(0, 5);
                  break;
                case 'name':
                  $scope.search.products.push(thisKeyHash.keywords.pop());
                  $scope.search.products = dedupe($scope.search.products).sort().splice(0, 5);
                  break;
                case 'categories':
                  $scope.search.categories.push(thisKeyHash.keywords.pop());
                  $scope.search.categories = dedupe($scope.search.categories).sort().splice(0, 5);
                  break;
                default:
                  console.error('Improper thisKeyHash');
              }
            }

        }, function searchFailure(err) {
          console.error(err);
        }
      );
    };

    createAutoComp('brand', brandIndex);
    createAutoComp('name', nameIndex);
    createAutoComp('categories', categoriesIndex);
  });

  // reset query upon clicking autocomplete result
  $scope.setQuery = function(newQuery) {
    $scope.search.query = newQuery;
  };
}]);
