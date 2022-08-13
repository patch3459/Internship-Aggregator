
import IndeedQuery from "./IndeedRequests.js";

const queryOptions = {
  host: 'www.indeed.com',
  query: 'Software',
  city: 'Seattle, WA',
  radius: '25',
  level: 'entry_level',
  jobType: 'fulltime',
  maxAge: '7',
  sort: 'date',
  limit: 100
};

let q = new IndeedQuery(queryOptions)

q.getJobs().then(res => {
    console.log(res); // An array of Job objects
});
