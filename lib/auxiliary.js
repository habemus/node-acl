function arrayHas(array, item) {
  return array.indexOf(item) !== -1;
}

function arrayAddUnique(array, item) {
  if (!arrayHas(array, item)) {
    // use concat in order to create new array before modifications
    return array.concat([item]);
  }

  return array;
};

function arrayRemove(array, item) {

  var index = array.indexOf(item);

  if (index !== -1) {
    // clone the array before making modification
    array = array.slice(0);
    array.splice(index, 1);
  }

  return array;
};

exports.arrayHas        = arrayHas;
exports.arrayAddUnique  = arrayAddUnique;
exports.arrayRemove     = arrayRemove;
