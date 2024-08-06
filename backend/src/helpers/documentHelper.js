const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const expressions = require('angular-expressions');

function angularParser(tag) {
    if (tag === '.') {
        return {
            get: function(s){ return s;}
        };
    }
    const expr = expressions.compile(tag.replace(/('|')/g, "'"));
    return {
        get: function(scope, context) {
            let obj = {};
            const scopeList = context.scopeList;
            const num = context.num;
            for (let i = 0, len = num + 1; i < len; i++) {
                obj = Object.assign(obj, scopeList[i]);
            }
            return expr(scope, obj);
        }
    };
}

const createDocx = (templateName, data) => {
    const content = fs.readFileSync(path.resolve(process.cwd(), 'src', 'templates', `${templateName}.docx`), 'binary');

    const zip = new PizZip(content);
    
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: angularParser
    });

    doc.render(data);

    const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
    });
    // PFG82-189: Use this line to print the doc locally
    // fs.writeFileSync(path.resolve(process.cwd(), `${templateName}_output.docx`), buf);

    return buf;
};

module.exports = { createDocx };
