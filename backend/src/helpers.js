/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

const fs = require('fs');

// inserting an SVG
exports.icon = (name) => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch (error) {
    return null;
  }
};
