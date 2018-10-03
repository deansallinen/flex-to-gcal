// reporting on events

const Event = require('../models/Event')

async function weeklySum (ctx) {
    // fetch weekly summary of financials
    const weeksum = await Event.aggregate([
        {
            $group: {
                _id: {$dayOfWeek: '$startDate'}, 
                avgRevenue: {$avg: '$plannedRevenue'}, 
                sumRevenue: {$sum: '$plannedRevenue'},
                count: {$sum: 1} 
            }
        }
    ])
    .sort('_id')
    ctx.body = weeksum;
}

async function monthlySum (ctx) {
    // fetch weekly summary of financials
    const res = await Event.aggregate([
        {
            $group: {
                _id: {
                    year: {$year: '$startDate'},
                    month: {$month: '$startDate'}
                }, 
                avgRevenue: {$avg: '$plannedRevenue'}, 
                sumRevenue: {$sum: '$plannedRevenue'},
                count: {$sum: 1} 
            }
        }
    ])
    .sort('_id')
    ctx.body = res;
}

module.exports = {
    weeklySum,
    monthlySum
}