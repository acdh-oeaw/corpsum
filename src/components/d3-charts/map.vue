<template>
  <div id="map-chart"></div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";

export default {
  name: "mapChart",
  props: ["mapData"],
  data() {
    return {
      height: 500,
      width: "100%",
      geoMapData: [],
    };
  },
  mounted() {
    // Initial mounting
    this.drawMapPaths().then((response) => {
      this.geoMapData = response;
      this.appendMapData(this.mapData, this.geoMapData);
    });
  },
  watch: {
    mapData: function(newVal, oldVal) {
      this.appendMapData(this.mapData, this.geoMapData);
    }
  },
  methods: {
    drawMapPaths() {
      const svg = d3
        .select("#map-chart")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
      const path = d3.geoPath().projection(d3.geoMercator());
      const geoMapData = d3.json("/world-110m.json").then(world => {
        var mapGroup = svg
          .append("g")
          .attr("class", "map-group")
          .attr("transform", "translate(0,0)")
          .attr("transform", "scale(1)")
        var paths = mapGroup.selectAll("path")
          .data(topojson.feature(world, world.objects.countries).features)
          .enter()
          .append("g")
          .attr("id", function(d) {
            return 'country-'+d.id;
          })
          .attr("class", function(d) {
            return "country-group"
          })
          .append("path")
          .attr("fill", function(d) {
            return '#ddd';
          })
          .attr("d", path)
          return paths;
      });
      return geoMapData;
    },
    appendMapData(mapData, geoMapData) {

      d3.selectAll(".pie-country").remove();

      const countries = [
        { id: '032', name: "Argentina" },
        { id: '068', name: "Bolivia" },
        { id: 152, name: "Chile" },
        { id: 170, name: "Colombia" },
        { id: 188, name: "Costa_Rica" },
        { id: 192, name: "Cuba" },
        { id: 218, name: "Ecuador" },
        { id: 222, name: "El_Salvador" },
        { id: 724, name: "España" },
        { id: 840, name: "Estados_Unidos" },
        { id: 608, name: "Filipinas" },
        { id: 320, name: "Guatemala" },
        { id: 226, name: "Guinea_Ecuatorial" },
        { id: 340, name: "Honduras" },
        { id: 484, name: "México" },
        { id: 558, name: "Nicaragua" },
        { id: 591, name: "Panamá" },
        { id: 600, name: "Paraguay" },
        { id: 604, name: "Perú" },
        { id: 630, name: "Puerto_Rico" },
        { id: 214, name: "República_Dominicana" },
        { id: 858, name: "Uruguay" },
        { id: 862, name: "Venezuela" }
      ];

      for (let i = 0; i < mapData.length; i += 1) {
        for (let j = 0; j < countries.length; j += 1) {
          if (mapData[i].key == countries[j].name) {
            mapData[i].id = countries[j].id;
            continue;
          }
        }
      }

      const maxValue = d3.max(mapData, function(d) { return d.value });
      const colorScale = d3.scaleLinear().domain([0, maxValue]).range(['beige', 'red']);
      const sizeScale = d3.scaleLinear().domain([0, maxValue]).range([10, 50]);
      const ordinalColorScale = d3.scaleOrdinal(d3.schemeCategory10);
      const ordinalPositionScale = d3.scaleOrdinal().range([0, 20, 40, 60]);

        /*
        .attr("fill", function(d) {
          for (let i = 0; i < mapData.length; i += 1) {
            if (mapData[i].id == d.id) {
              let country = mapData[i];
              return colorScale(country.value);
            }
          }
          return '#ddd';
        })
        */

/*
      const pie = d3.pie()
          .value(d => d.value)
          .sort(null);

      const arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);
*/


      function groupBy(collection, property) {
          var i = 0, val, index,
              values = [], result = [];
          for (; i < collection.length; i++) {
              val = collection[i][property];
              index = values.indexOf(val);
              if (index > -1)
                  result[index].push(collection[i]);
              else {
                  values.push(val);
                  result.push([collection[i]]);
              }
          }
          return result;
      }

      var mapData2 = groupBy(mapData, "key");

      var width = 50,
          height = 50,
          radius = Math.min(width, height) / 2;

      var color = d3.scaleOrdinal()
          .range(["#98abc5", "#8a89a6", "#7b6888"]);

      var arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0);

      var labelArc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 10);

      var pie = d3.pie()
          .sort(null)
          .value(function(d) { return d.value; });


      var countryPies = d3.select(".map-group").selectAll(".country-pie")
        .data(mapData2)
        .enter()
        .append("g")
        .attr("class", function(d) { return "country-pie country-pie-"+d[0].id; })
        // using the map data
        // position a circle for matches in mapData array
        .attr("transform", function(d) {
          var element = document.getElementById("country-"+d[0].id);
          if (element) {
            var boundingBox = element.getBBox();
            var x = Math.round(boundingBox.x) + ordinalPositionScale(d[0].group);
            var y = Math.round(boundingBox.y);
            return "translate("+x+","+y+")";
          }
        })

        var arcs = countryPies
        .selectAll(".country-arc")
        .data(function(d) { return pie(d) })
        .enter()
        .append("g")
        .attr("class", function(d, i) { return "arc arc-" + d.data.group; })

        arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d) {
          return ordinalColorScale(d.data.group);
        })
        .on("mouseover", function(d) {
          d3.select(this.parentNode).selectAll("text")
          .style("display", "block");
        })
        .on("mouseout", function(d) {
          d3.select(this.parentNode).selectAll("text")
          .style("display", "none");
        })

        arcs.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("display", "none")
        .text(function(d) { return d.data.group; });

/*
        .data(pie(function(d) { console.log(d); return d.value; }))


      var pies = d3.select(".map-group").selectAll("circle")
        .data(mapData)
        .enter()
        .append("circle")
        .attr("class", function(d) {
          return "pie-country pie-country-"+d.id + " pie-group-"+d.group;
        })
        .attr("r", function(d) {
          return sizeScale(d.value);
        })
        .attr("fill", function(d) {
          return ordinalColorScale(d.group);
        })
        // using the map data
        // position a circle for matches in mapData array
        .attr("transform", function(d) {
          var element = document.getElementById("country-"+d.id);
          console.log(element)
          if (element) {
            var boundingBox = element.getBBox();
            var x = Math.round(boundingBox.x) + ordinalPositionScale(d.group);
            var y = Math.round(boundingBox.y);
            return "translate("+x+","+y+")";
          }

          
          const paths = geoMapData;
          console.log(paths);
          for (var i = 0; i < paths.data().length; i++){
            var p = path.data()[i];
            if (p.id == d.id){
              var t = path.centroid(p);
              t[0] = t[0] + ordinalPositionScale(d.group);
              return "translate(" + t + ")";
            }
          }
        });
      */
    }
  }
};
</script>
