function aitalk_response(result) {
    this.returnValue = true;
    this.result = result;
};

function api_ask_parameters(prompt) {
    this.prompt = {
        prompt : prompt
    };
}

function error(errorText) {
    this.returnValue = false;
    this.errorText = errorText;
}

module.exports = {
    aitalk_response : aitalk_response,
    api_ask_parameters : api_ask_parameters,
    error : error
}