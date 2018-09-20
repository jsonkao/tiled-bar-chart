const TILE_SIZE = 16;
const TILES_PER_ROW = 5;

const BAR_PADDING = 20;
const BAR_WIDTH = (TILES_PER_ROW * TILE_SIZE) + BAR_PADDING

const colors = ["#ffd275", "#e8ae68", "#a57f60", "#e3a587", "#e48775"];
let data = [42, 34, 12, 17, 53];

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
    .attr('transform', `translate(${i * BAR_WIDTH}, 300)`)
    .selectAll('rect')
    .data(tiles);

  u.enter()
    .append('rect')
    .style('stroke', 'white')
    .style('stroke-width', 0.5)
    .style('shape-rendering', 'crispEdges')
    .merge(u)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width', TILE_SIZE)
    .attr('height', TILE_SIZE);

  u.exit().remove();
};

const updateBars = () => {
  const u = d3.select('g.bars')
    .selectAll('g')
    .data(data);

  u.enter()
    .append('g')
    .merge(u)
    .style('fill', (d, i) => colors[i % colors.length])
    .each(updateBar);    

  u.exit().remove();    
};

const initializeData = () =>
  data = data
    .filter(d => +d.year === 2016)
    .map(d => ({
      name: d.country,
      year: +d.year,
      age: +d.all
    }))
    .slice(0, 10);

const initialize = () => {
  initializeData();
};

d3.tsv("data/life-expectancy-WHO-2000-2016-simplified.tsv", (err, tsv) => {
  data = tsv;
  console.log(data[0])
 
  initialize();
  updateBars();
});













