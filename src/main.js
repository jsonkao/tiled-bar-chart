const TILE_SIZE = 15;
const TILES_PER_ROW = 5;
const BAR_PADDING = 20;
const MAX_VALUE = 100;
const NUM_VISIBLE_COUNTRIES = 6;

const barWidth = (TILES_PER_ROW * TILE_SIZE) + BAR_PADDING;

const colors = ["#ffd275", "#e8ae68", "#a57f60", "#e3a587", "#e48775"];
let data, filteredData;
let selectedYear = 2016;
let selectedMode = 'top10';
  
const getTiles = num => {
  const tiles = [];

  for (let i = 0; i < num; i++) {
    tiles.push({
      x: (i % TILES_PER_ROW) * TILE_SIZE,
      y: -(Math.floor(i / TILES_PER_ROW) + 1) * TILE_SIZE,
    });
  }

  return tiles;
};

function updateBar(d, i) {
  const tiles = getTiles(d.age);

  const u = d3.select(this)
    .attr('transform', `translate(${i * barWidth}, 300)`)
    .selectAll('rect')
    .data(tiles);

  u.enter()
    .append('rect')
    .style('opacity', 0)
    .style('stroke', 'white')
    .style('stroke-width', 0.4)
    .style('shape-rendering', 'crispEdges')
    .merge(u)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', TILE_SIZE)
    .attr('height', TILE_SIZE)
    .transition()
    .delay((d, i) => i * 20)
    .style('opacity', 1);

  u.exit()
    .transition()
    .delay((d, i) => (100 - i) * 20)
    .style('opacity', 0)
    .on('end', function() {
      d3.select(this).remove();
    });
};

function updateLabel(d) {
  let el = d3.select(this)
    .select('text');

  if (el.empty()) {
    el = d3.select(this)
      .append('text')
      .attr('y', 16)
      .style('font-size', '12px')
      .style('fill', '#666');
  }

  el.text(d.name);
}

const updateBars = () => {
  const u = d3.select('g.bars')
    .selectAll('g')
    .data(filteredData);

  u.enter()
    .append('g')
    .merge(u)
    .style('fill', (d, i) => colors[i % colors.length])
    .each(updateBar)
    .each(updateLabel);

  u.exit().remove();
};

const updateAxis = () => {
  const chartWidth = NUM_VISIBLE_COUNTRIES * barWidth;
  const chartHeight = (MAX_VALUE / TILES_PER_ROW) * TILE_SIZE;

  const yScale = d3.scaleLinear().domain([0, MAX_VALUE]).range([chartHeight, 0]);
  const yAxis = d3.axisRight().scale(yScale).tickSize(chartWidth);

  d3.select('.y.axis')
    .call(yAxis);
};

const update = () => {
  updateFilteredData();
  updateBars();
  updateAxis();
};

const initializeData = () =>
  data = data.map(d => ({
    name: d.country,
    year: +d.year,
    age: +d.all,
  }));

const updateFilteredData = () =>
  filteredData = data
    .filter(d => d.year === selectedYear)
    .sort((a, b) => selectedMode === 'top10' ? b.age - a.age : a.age - b.age)
    .slice(0, NUM_VISIBLE_COUNTRIES);

const initialize = () => {
  initializeData();

  d3.select('select.mode')
    .on('change', function() {
      selectedMode = this.value;
      update();
    });
  d3.select('select.year')
    .on('change', function() {
      selectedYear = +this.value;
      update();
    });
};

d3.tsv("data/life-expectancy-WHO-2000-2016-simplified.tsv", (err, tsv) => {
  data = tsv;
 
  initialize();
  update();
});













