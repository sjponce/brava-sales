/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// Making a static map is really long - this is a handy helper function to make one

// inserting an SVG
exports.icon = (name) => {
  try {
    return fs.readFileSync(`./public/images/icons/${name}.svg`);
  } catch {
    return null;
  }
};

exports.image = (name) => fs.readFileSync(`./public/images/photos/${name}.jpg`);

// Some details about the site
exports.siteName = `Brava server`;
