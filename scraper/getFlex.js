// getFlex.js

const { format } = require('date-fns');
const axios = require('axios')

const getFlexCookie = async (user, pass) => {
  try {
    console.log("User: ", !!user)
    console.log("Pass: ", !!pass)
    const AUTH_URL = 'https://loungeworks.flexrentalsolutions.com/rest/core/authenticate';
    const res = await axios({
      url: AUTH_URL,
      method: "POST",
      params: {
        username: user,
        password: pass,
      },
    })
    const cookie = res.headers['set-cookie'][0]
    return cookie;
  } catch (err) {
    throw (err);
  }
};

const getFlexCal = async (start, end) => {
  try {
    const startDate = format(start, 'YYYY-MM-DD');
    const endDate = format(end, 'YYYY-MM-DD');
    const templateId = '1c864f10-d3cd-11e7-82d0-0030489e8f64';
    const URL = `https://loungeworks.flexrentalsolutions.com/rest/calendar/calendar`
    const COOKIE = await getFlexCookie(process.env.FLEXUSER, process.env.FLEXPASS);
    
    console.log("Cookie: ", !!COOKIE)
    console.log('Flex Cal Start:', startDate)
    console.log('Flex Cal End:', endDate)
  
    const res = await axios({
      url: URL,
      method: "GET",
      headers: { cookie: COOKIE },
      params: {
        templateId,
        startDate,
        endDate,
      }
    })
    return [res.data, COOKIE]
  } catch (err) {
    throw (err);
  }
};

const getFlexDetails = async (eventId, cookie) => {
  try {
    const URL = `https://loungeworks.flexrentalsolutions.com/rest/elements/get?id=${eventId}`;
    const res = await axios.get(URL, {
      headers: { cookie }
    });
    return res.data;
  } catch (err) {
    throw (err);
  }
};

const getFlexFinancials = async (eventId, cookie) => {
  try {
    const URL = `https://loungeworks.flexrentalsolutions.com/rest/jobCosting/job-cost-aggregation-tree/${eventId}`;
    const res = await axios.get(URL, {
      headers: { cookie }
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
};
