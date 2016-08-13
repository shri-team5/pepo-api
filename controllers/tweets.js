function get(req, res) {
    const tweets = [
        {
            id: 1,
            text: 'Hello 140!',
            created_at: 1471093167,
            user: {
                login: 'superuser1',
                avatar: 'placehold.it/96x96',
                name: 'Вася Пупкин',
                description: '',
            },
            type: 'text'
        },
        {
            id: 1,
            text: 'Hello 141!',
            created_at: 1471093167,
            user: {
                login: 'superuser1',
                avatar: 'placehold.it/96x96',
                name: 'Вася Пупкин',
                description: '',
            },
            type: 'text'
        },
        {
            id: 1,
            text: 'Hello 142!',
            created_at: 1471093167,
            user: {
                login: 'superuser2',
                avatar: 'placehold.it/96x96',
                name: 'Вася Пупкин',
                description: '',
            },
            type: 'text'
        },
        {
            id: 1,
            text: 'Hello 143!',
            created_at: 1471093168,
            user: {
                login: 'superuser2',
                avatar: 'placehold.it/96x96',
                name: 'Вася Пупкин',
                description: '',
            },
            type: 'text'
        },
    ];

    return res.send(tweets);
}

module.exports = {
    get
};
