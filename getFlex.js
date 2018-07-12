const {
    USERNAME,
    PASSWORD
} = require("./secrets");
const {
    format
} = require('date-fns');
const fetch = require('node-fetch');
const {
    URLSearchParams
} = require('url');

const getFlexCookie = async (user, pass) => {
    const AUTH_URL = 'https://loungeworks.flexrentalsolutions.com/rest/core/authenticate';

    const params = new URLSearchParams();
    params.append('username', user);
    params.append('password', pass);

    const headers = {
        method: 'POST',
        body: params
    };

    try {
        const response = await fetch(AUTH_URL, headers);
        const cookie = await response.headers.get('set-cookie');
        console.log(cookie)
        return cookie;
    } catch (err) {
        console.error(err);
    }

}

const getFlexCal = async (start, end) => {
    const startDate = format(start, 'YYYY-MM-DD');
    const endDate = format(end, 'YYYY-MM-DD');
    const templateId = '1c864f10-d3cd-11e7-82d0-0030489e8f64';
    const COOKIE = await getFlexCookie(USERNAME, PASSWORD);

    const URL = 'https://loungeworks.flexrentalsolutions.com/rest/calendar/calendar?' +
        'templateId=' + templateId +
        '&startDate=' + startDate +
        '&endDate=' + endDate;

    const headers = {
        'headers': {
            'cookie': COOKIE
        }
    }

    try {
        const response = await fetch(URL, headers);
        const data = await response.json();
        console.log(data)
        return data;
    } catch (err) {
        console.error(err);
    }

}

module.exports = {
    getFlexCal
};