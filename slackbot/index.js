const data = require('./testdata.json');
const messages = require('./messages');
const { post, postAttach, summary } = require('./postMessage');

// postAttach(messages.manifestCreatedText)({ ...data });

module.exports = {
    post,
    postAttach,
    messages,
    summary,
}
