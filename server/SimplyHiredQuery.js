import fetch from "node-fetch";
import * as cheerio from 'cheerio';

/* */


export default class SimplyHiredQuery {
    /* 
    Class for acquiring job data from SimplyHired.com
    */
    constructor(qo) { 
        //constructor


        this.url = qo.host || "https://www.simplyhired.com/search"
        this.query = qo.jobType + qo.query + qo.level  || "";
        this.location = this.city || "";
        this.radius = qo.radius || 10;
    };


     async getJobs() {
        
        const payload = {
            q : "software+engineer", l : "queens+ny", mi : 5
        };

        this.url = this.url + "?" + `q=${payload["q"]}` + `&l=${payload["l"]}` + `&mi=${payload["mi"]}`;

        const resp = await fetch(this.url, {method: "GET", redirect: 'follow'});
        // serious bro moment, why is this a get methoid?
        // took me too many hours...
        // this is why we can't have nice things in america smh
        const html = await resp.text();
        
        return this._parseHTML(html);

    };

    _parseHTML(html) {

        /* 
        
        Perhaps a poorly named method atm

        Takes data from search page on simplyhired and acquires 

        job title, job url, and a short description. Uses miscData(url) method for more data

        */

        const $ = cheerio.load(html);

        const jobs = $(".LeftPane").find(".SerpJob-jobCard"); // selecting the tbl with cards
        // ^^ this is some sort of iterable, but has to be converted 

        // converting to array 
        const objects =  Array.from(jobs).map( (e, _) =>{
            const url = "https://www.simplyhired.com" + $(e).find(".SerpJob-link").attr('href')

            //const miscData = this.readProfilePage("https://www.simplyhired.com" + $(e).find(".SerpJob-link").attr('href'));

           //const miscData =  await this._readProfilePage(url)

            return { 
                title: $(e).find(".SerpJob-link").text(),
                url: url,
                shortDescription : $(e).find('.jobposting-snippet').text(),
                }
                
            });
         
        return objects
    };

    async readProfilePage(url) {
        // reads more data from the full profile page for the job

        const resp = await fetch(url, {method: "GET", redirect: 'follow'});
        const html = await resp.text();

        //html parser
        const $ = cheerio.load(html);

        
        const jobDetails = $(".viewjob-labelWithIcon")
        const jobDetailsText = Array.from(jobDetails).map((e, _) => {
            return $(e).text() 
            // it would look like something like this ideally
            /*
                ['Indeed - 4.3',
                'New York, NY',
                'Full-time',
                '$134,000 - $194,000 a year',
                '19 hours ago'],
            */
        });

        
        const benefits = Array.from($(".viewjob-benefit")).map( (e, _) => $(e).text())

        const qualifications = Array.from($(".viewjob-qualification")).map( (e, _) => $(e).text())


        return ({
            //t : jobDetailsText,
            rating : jobDetailsText[0],
            location : jobDetailsText[1],
            payRange : jobDetailsText[2],
            postTime : jobDetailsText[3],
            benefits : benefits,
            qualifications : qualifications,
            fullJobDesription : $(".p").text(),
        });
    }

};

/*

let gd = new SimplyHiredQuery({
    query: 'Software Engineer',
    location: "Queens NY"
  })

console.log(await gd.getJobs())

console.log(await gd.readProfilePage("https://www.simplyhired.com/job/JCXuObOaORZqI0LVDlelltaELQJQ6RUd8HkctvWUNADea_-kZglFYA?isp=0&q=software"))

*/