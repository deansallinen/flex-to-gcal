require('dotenv').config()

const {
  format
} = require('date-fns');

const axios = require('axios')

const getFlexCookie = async (user, pass) => {
  const AUTH_URL = 'https://loungeworks.flexrentalsolutions.com/rest/core/authenticate';
  console.log("User: ", !!user, "Pass: ", !!pass)
  try {
    const res = await axios({
      url: AUTH_URL,
      method: "POST",
      params: {
        username: user,
        password: pass,
      },
    })
    const cookie = res.headers['set-cookie'][0]
    console.log("Cookie: ", !!cookie)
    return cookie;
  } catch (err) {
    throw (err);
  }
};

const COOKIE = getFlexCookie(process.env.FLEXUSER, process.env.FLEXPASS);

const getFlexCal = async (start, end) => {
  const startDate = format(start, 'YYYY-MM-DD');
  const endDate = format(end, 'YYYY-MM-DD');
  const templateId = '1c864f10-d3cd-11e7-82d0-0030489e8f64';
  const URL = `https://loungeworks.flexrentalsolutions.com/rest/calendar/calendar`

  try {
    const res = await axios({
      url: URL,
      method: "GET",
      headers: { cookie: await COOKIE },
      params: {
        templateId,
        startDate,
        endDate,
      }
    })
    return res.data
  } catch (err) {
    throw (err);
  }
};

const getFlexDetails = async (eventId) => {
  const URL = `https://loungeworks.flexrentalsolutions.com/rest/elements/get?id=${eventId}`;
  try {
    const res = await axios.get(URL, {
      headers: { cookie: await COOKIE }
    });
    return res.data;
  } catch (err) {
    throw (err);
  }
};

const getFlexFinancials = async (eventId) => {
  const URL = `https://loungeworks.flexrentalsolutions.com/rest/jobCosting/job-cost-aggregation-tree/${eventId}`;
  try {
    const res = await axios.get(URL, {
      headers: { cookie: await COOKIE }
    });
    return res.data;
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
