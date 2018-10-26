const { format } = require('date-fns');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const getFlexCookie = async (user, pass) => {
  const AUTH_URL = 'https://loungeworks.flexrentalsolutions.com/rest/core/authenticate';

  const params = new URLSearchParams();
  params.append('username', user);
  params.append('password', pass);

  const headers = {
    method: 'POST',
    body: params,
  };

  try {
    const response = await fetch(AUTH_URL, headers);
    const cookie = await response.headers.get('set-cookie');
    return cookie;
  } catch (err) {
    throw (err);
  }
};

const COOKIE = getFlexCookie(process.env.FLEXUSER, process.env.FLEXPASS);

const getFlexCal = async (start, end) => {
  const startDate = format(start, 'YYYY-MM-DD');
  const endDate = format(end, 'YYYY-MM-DD');
  // console.log(startDate, endDate)
  const templateId = '1c864f10-d3cd-11e7-82d0-0030489e8f64';

  const URL = `${'https://loungeworks.flexrentalsolutions.com/rest/calendar/calendar?'
        + 'templateId='}${templateId
  }&startDate=${startDate
  }&endDate=${endDate}`;

  const headers = {
    headers: {
      cookie: await COOKIE,
    },
  };

  try {
    const response = await fetch(URL, headers);
    const data = await response.json();
    console.log("Calendar Length: ", data.length)
    return data;
  } catch (err) {
    throw (err);
  }
};

const getFlexDetails = async (eventId) => {
  const URL = `https://loungeworks.flexrentalsolutions.com/rest/elements/get?id=${eventId}`;
  const headers = {
    headers: {
      cookie: await COOKIE,
    },
  };
  try {
    const response = await fetch(URL, headers);
    const data = await response.json();
    return data;
  } catch (err) {
    throw (err);
  }
};

const getFlexFinancials = async (eventId) => {
  const URL = `https://loungeworks.flexrentalsolutions.com/rest/jobCosting/job-cost-aggregation-tree/${eventId}`;
  const headers = {
    headers: {
      cookie: await COOKIE,
    },
  };
  try {
    const response = await fetch(URL, headers);
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (err) {
    throw (err);
  }
};


module.exports = {
  getFlexCal,
  getFlexDetails,
  getFlexFinancials,
  getFlexCookie,
  COOKIE,
};
