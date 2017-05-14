
boatFilter={
	phrfmin: -150,
	phrfmax: 360,
	loamin: 15,
	loamax: 80
}

function hideOrNot(d){
	bf = boatFilter
	if (+d.phrf < +bf.phrfmin || +d.phrf > +bf.phrfmax || +d.loa < +bf.loamin || +d.loa > +bf.loamax){
		return 'none';
	} else{
		return '';
	}
}

let slideUpdate = {
	phrfmin: d3.select("#phrfmindisp"),
	phrfmax: d3.select("#phrfmaxdisp"),
	loamin: d3.select("#loamindisp"),
	loamax: d3.select("#loamaxdisp")
};

let padding = {
	top: 10,
	bottom: 10,
	left: 10,
	right: 10
}

width = 900;
width = window.innerWidth - 60;
height = 600;

d3.select("#boatlist")
	.append("ul")
		.attr('columns', _ => Math.floor((window.innerWidth - 60)/350) || 1)
		.attr('id','phrflist')


d3.select("svg")
	.attr('height',height)
	.attr('width', width)
	.style('background-color', '#99d3bf')
	.style('stroke', '1px');

var tooltip = d3.select("body")
                .append("div")
                .classed("tooltip", true)
                .style("opacity", 0)
                .style("position", "absolute")
                .attr("pointer-events","none");



d3.csv("yralis.csv", function(error, data) {
  console.log("loading the csv?");
  if (error) throw error;
  // console.log(data); // [{"Hello": "world"}, …]

  console.log("phrf",d3.extent(data, d => parseInt(d.phrf)))
  console.log("loa",d3.extent(data, d => parseInt(d.loa)))
  console.log("displacement",d3.extent(data, d => parseInt(d.displacement)))

	d3.select("#phrflist")
    .selectAll('li')
    .data(data)
    // .data(boatData)
    .enter()
    .append('li')
       .text( d => `${d.loa} ${d.boat} ${d.phrf}`)

    xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => parseInt(d.loa)))
            .range([padding.left,width - padding.right]);

    yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => parseInt(d.phrf)))
            .range([padding.top,height - padding.bottom]);

    rScale = d3.scaleLinear()
    		.domain(d3.extent(data, d => parseInt(d.displacement)))
    		.range([5,20]);

    // colorScale = d3.interpolateCool()
    // 		.domain(d3.extent(data, d=> parseInt(d.phrf)));

    colorScale = d3.scaleLog()
		    .domain(d3.extent(data, d => parseInt(d.displacement)))
		    .range(["brown", "steelblue"])
		    .interpolate(d3.interpolateHcl);

	d3.select('svg')
		.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
			.attr('cx', d => xScale(d.loa))
			.attr('cy', d => yScale(d.phrf))
			.attr('r', d => rScale(d.displacement))
			.attr('fill', d => colorScale(d.displacement))
			// .attr('fill', 'white')
			.attr('stroke','#88bbd6')
			.attr('stroke-width', '1px')
			.on("mouseenter", function(d) {

	    		tooltip.text(`${d.boat}\n phrf: ${d.phrf}`)
		           .style("opacity", 1)
		           // .style("left", d3.event.pageX + "px")
		           .style("left", d3.event.pageX > window.innerWidth -200? d3.event.pageX -200 + "px" : d3.event.pageX + "px")
		           .style("top", d3.event.pageY + "px")
		           .style("border", "solid darkblue")
		           .style("border-radius", "10px")
		           .style("padding", "10px")
		           .style("background-color", "#cdcdcd");
	        })
	        .on("mouseout", () => tooltip.style("opacity", 0));

	phrfAxis = d3.axisRight(yScale)
	d3.select('svg')
		.append("g")
		.classed("yAxis",true)
		.attr('padding','10')
		.call(phrfAxis)

	loaAxis = d3.axisBottom(xScale)
	d3.select('svg')
		.append("g")
		.classed("xAxis", true)
		.attr('padding','10')
		.call(loaAxis)

	d3.select('#controller')
		.on('input', function(){
			boatFilter[d3.event.target.id] = d3.event.target.value;
			slideUpdate[d3.event.target.id].text(d3.event.target.value);

			d3.select("#phrflist")
				.selectAll('li')
				.data(data)
				.style('display', d => hideOrNot(d))

			d3.select("svg")
				.selectAll('circle')
				.data(data)
				.style('display', d => hideOrNot(d))

			xScale = d3.scaleLinear()
	            .domain([boatFilter.loamin,boatFilter.loamax])
	            .range([padding.left,width - padding.right]);

   			yScale = d3.scaleLinear()
	            .domain([boatFilter.phrfmin, boatFilter.phrfmax])
	            .range([padding.top,height - padding.bottom]);

	        d3.select('svg')
				.selectAll('circle')
				.attr('cx', d => xScale(d.loa))
				.attr('cy', d => yScale(d.phrf))

			phrfAxis = d3.axisRight(yScale)
			loaAxis = d3.axisBottom(xScale)

			d3.select('svg')
				.select('.xAxis')
				.call(phrfAxis)
			d3.select('svg')
				.select('.yAxis')
				.call(loaAxis)



		});

});




// d3.select("svg")
//     .attr('width', width)
//     .attr('height', height)
//   .selectAll('rect')
//   .data(movieData)
//   .enter()
//   .append('rect')
//     .attr('x', (d,i) => (barWidth + barPadding) * i)
//     .attr('y', d => yScale(d.annualGrosses[0]))
//     .attr('width', 100)
//     .attr('height', d => height - yScale(d.annualGrosses[0]))
//     .attr('fill', d => colors[d.rating])

// d3.select("svg")
//   .append("g")
//     // .attr('transform', 'translate(50,0)')
//   .call(d3.axisRight(yScale))

// d3.select('input')
//   .on('input', function(){
//   	var idx = d3.event.target.value - d3.event.target.min

//     d3.selectAll('rect')
//       .attr('y', d => yScale(d.annualGrosses[idx]))
//       .attr('height', d=> height - yScale(d.annualGrosses[idx]))

//     d3.select('#year').text(idx+2002)
//   })