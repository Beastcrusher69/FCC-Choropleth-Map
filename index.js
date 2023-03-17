let eduUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
let countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

let educationData,countyData;
let width=950;
let height=600;

let req1 = new XMLHttpRequest();
    req1.open("GET",eduUrl,true)
    req1.send();
    req1.onload = () => {

        educationData = JSON.parse(req1.responseText);

        let req2 = new XMLHttpRequest();
        req2.open("GET",countyUrl,true)
        req2.send();
        req2.onload = () => {

        let data = JSON.parse(req2.responseText)    
        countyData = topojson.feature(data,data.objects.counties).features;

        let min = d3.min(educationData,(item) => { return item.bachelorsOrHigher})
        let max = d3.max(educationData,(item) => { return item.bachelorsOrHigher})
        let part = (max - min)/4;    
        let canvas = d3.select('#canvas');

        canvas.attr("width",width)
            .attr("height",height);  
               
        canvas.selectAll('path')
            .data(countyData)  
            .enter()
            .append("path")
            .attr('d', d3.geoPath())
            .attr("class","county")
                      
        canvas.selectAll("path")
            .data(educationData)
            .attr("data-fips",(d) => d.fips)
            .attr("data-education", (d) => d.bachelorsOrHigher)
            .attr("fill",(d) => {
                let per = d.bachelorsOrHigher;

                if(per>=min && per<part){
                    return "#92DAE2";
                }
                else if(per>=part && per<part*2){
                    return "#59C1CE";
                }
                else if(per>=part*2 && per<part*3){
                    return "#1AA3B4";
                }
                else{
                    return "#0096A8";                   
                }
              })    

    }
    }