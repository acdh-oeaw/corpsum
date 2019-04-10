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
      console.log(mapData);

      d3.selectAll(".pie-country").remove();

      const countries = [
        { id: 32, name: "Argentina" },
        { id: 68, name: "Bolivia" },
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
      const sizeScale = d3.scaleLinear().domain([0, maxValue]).range([1, 10]);
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

          /*
          const paths = geoMapData;
          console.log(paths);
          for (var i = 0; i < paths.data().length; i++){
            var p = path.data()[i];
            if (p.id == d.id){
              var t = path.centroid(p);
              t[0] = t[0] + ordinalPositionScale(d.group);
              return "translate(" + t + ")";
            }
          }*/
        });
    }
  }
};
</script>
