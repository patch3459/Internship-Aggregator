import fetch from "node-fetch";
import * as cheerio from 'cheerio';

/* */


export default class GlassdoorQuery {

    constructor(qo) { 
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
        return this.parseHTML(html);

    };

    parseHTML(html) {

        const $ = cheerio.load(html);

        const jobs = $(".LeftPane").find(".SerpJob-jobCard"); // selecting the tbl with cards
        // ^^ this is some sort of iterable, but has to be converted 

        // converting to array 
        const objects = Array.from(jobs).map((e, _) =>{
            const url = "https://www.simplyhired.com" + $(e).find(".SerpJob-link").attr('href')

            const miscData = this.readProfilePage("https://www.simplyhired.com" + $(e).find(".SerpJob-link").attr('href'));

            return { 
                title: $(e).find(".SerpJob-link").text(),
                url: url,
                shortDescription : $(e).find("SerpJob-snippetContainer").find('p').text(),
                }
            });
         
        return objects
    };

    miscData(url) {

        

    }

};


let gd = new GlassdoorQuery({
    query: 'Software Engineer',
    location: "Queens NY"
  })

console.log(await gd.getJobs())