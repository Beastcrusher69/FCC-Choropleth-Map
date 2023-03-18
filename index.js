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
    
        let canvas = d3.select('#canvas');
        let colors=[
            "#92DAE2",
            "#59C1CE",
            "#1AA3B4",
            "#0096A8"
        ]
        let tooltip = d3.select("#tooltip");

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

                if( per<15){
                    return colors[0];
                }
                else if(per<30){
                    return colors[1];
                }
                else if(per<45){
                    return colors[2];
                }
                else{
                    return colors[3];                   
                }
              })
              .on("mouseover",(d) => {
                 tooltip.transition().style('visibility','visible');  
                 tooltip.attr("data-education",d.bachelorsOrHigher);

                 document.getElementById("tooltip").innerHTML = "<p>" + d.area_name + "</p><p>" + d.bachelorsOrHigher + "</p>";
              })
              .on("mouseout",() => {
                tooltip.transition().style('visibility','hidden');   
              })

              
        //legend

        d3.select("#legend")
        .attr("width",150)
        .attr("height",100)

        d3.select("#legend")  
        .selectAll("rect")
        .attr("width",20)
        .attr("height",20)
        .attr("x",0)
        .attr("transform",(d,i) => { return "translate(0," + (22*i) + ")"})
        .data(colors)
        .attr("fill",(d) => d) 
        
        d3.select("#legend")
          .selectAll("text")
          .data(colors)
          .attr("x", 24)
          .attr("transform",(d,i) => { return "translate(0," + (22*i+15) + ")"})       
    }
    }