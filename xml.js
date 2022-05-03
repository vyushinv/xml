import libxml from 'libxmljs';
import xmldom from '@xmldom/xmldom';
import c14n from 'xml-c14n';

function parse(string) {
    try {
        return libxml.parseXml(string);
    } catch (error) {
        throw new SyntaxError(`error when parse [${string}], error: [${error.message}]`);
    }
}

function validate(xml, xsd) {
    const docXml = parse(xml);
    const docXsd = parse(xsd);
    if (docXml.validate(docXsd)) {
        return docXml;
    } else {
        throw new SyntaxError(`error when validate. validationErrorsCount: [${docXml.validationErrors.length}], validationErrors: [${docXml.validationErrors}]`);
    };
}

function canonicalize(xml) {
    return new Promise((resolve, reject) => {
        parse(xml);
        const document = (new xmldom.DOMParser()).parseFromString(xml);
        var canonicaliser = c14n().createCanonicaliser("http://www.w3.org/2001/10/xml-exc-c14n#WithComments");

        canonicaliser.canonicalise(document, function (error, res) {
            if (error) {
                return reject(new SyntaxError(`error when canonicalize [${xml}], error: [${error.message}]`));
            }
            resolve(res)
        });
    })
}

export { parse, validate, canonicalize };