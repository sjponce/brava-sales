const { createDocx } = require('./documentHelper');
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

jest.mock('fs');
jest.mock('pizzip');
jest.mock('docxtemplater');

describe('createDocx', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('test_createDocx_generates_docx', () => {
        const templateName = 'test_template';
        const data = { name: 'John Doe' };
        const content = 'fake binary content';
        const buffer = Buffer.from('fake buffer content');

        fs.readFileSync.mockReturnValue(content);
        const zip = { generate: jest.fn().mockReturnValue(buffer) };
        PizZip.mockImplementation(() => zip);
        const doc = { render: jest.fn(), getZip: jest.fn().mockReturnValue(zip) };
        Docxtemplater.mockImplementation(() => doc);

        const result = createDocx(templateName, data);

        expect(fs.readFileSync).toHaveBeenCalledWith(path.resolve(process.cwd(), 'src', 'templates', `${templateName}.docx`), 'binary');
        expect(PizZip).toHaveBeenCalledWith(content);
        expect(Docxtemplater).toHaveBeenCalledWith(zip, { paragraphLoop: true, linebreaks: true, parser: expect.any(Function) });
        expect(doc.render).toHaveBeenCalledWith(data);
        expect(zip.generate).toHaveBeenCalledWith({ type: 'nodebuffer', compression: 'DEFLATE' });
        expect(result).toBe(buffer);
    });

    test('test_createDocx_template_not_found', () => {
        const templateName = 'non_existent_template';
        const data = { name: 'John Doe' };

        fs.readFileSync.mockImplementation(() => { throw new Error('File not found'); });

        expect(() => createDocx(templateName, data)).toThrow('File not found');
    });
});
