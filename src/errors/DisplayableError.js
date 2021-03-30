/**
 * Class DisplayableError
 */
class DisplayableError extends Error {
    /**
     * DisplayableError constructor
     *
     * @param {String} message
     * @param {*} data
     */
    constructor(message, data = null) {
        super(message);
        this.data = data;
    }

    /**
     * Converte uma instância
     * em string.
     *
     * @return {string}
     */
    toString() {
        return this.message;
    }
}

export { DisplayableError };
