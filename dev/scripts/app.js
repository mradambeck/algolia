console.log('sanity check: app.js');

var setStars = function(popularity) {
  if (popularity < 2000) {
    return 5;
  } else if (popularity < 4000) {
    return 4;
  } else if (popularity < 6000) {
    return 3;
  } else if (popularity < 8000) {
    return 2;
  } else {
    return 1;
  }
};

var dedupe = function (array) {
  return Array.from(new Set(array));
};

var generateKeywords = function (hits, typeToFilter) {

  var newArray = [];

  for (var i=0; i < hits.length; i++) {

    switch(typeToFilter) {
      case 'brand':
        newArray.push(hits[i].brand);
        break;
      case 'name':
        newArray.push(hits[i].name);
        break;
      case 'categories':
        for(var j=0; j < hits[i].categories.length; j++) {

          newArray.push(hits[i].categories[j]);
        }
        break;
      default:
        console.error('no typeToFilter provided in generateKeywords()');
    }
  }
  var keywordArray = dedupe(newArray).sort();
  var keyAndType = {
    keywords: keywordArray,
    keyType: typeToFilter
  };

  return keyAndType;
};
