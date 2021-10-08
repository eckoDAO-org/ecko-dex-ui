/* ************************************************************************** */
/* FOR MORE DOCUMENTATION CHECK */

// ../chain-data/chainweb.js
// README on https://github.com/kadena-io/chainweb.js

/* ************************************************************************** */

/* ************************************************************************** */
/* IMPORT CHAINWEB DATA LIBRARY AND HELPER */

/* ************************************************************************** */
const chainweb = require("../chain-data/chainweb");
const HeaderBuffer = require("../chain-data/HeaderBuffer");

/* ************************************************************************** */
/* Cuts */

// chainweb.cut.peers().then(x => console.log("Cut Peers:", x));
// chainweb.cut.current().then(x => console.log("Current Cut:", x));

/* ************************************************************************** */
/* Recents */

/* These functions return items from recent blocks in the block history starting
 * at a given depth.
 *
 * The depth parameter is useful to avoid receiving items from orphaned blocks.
 *
 * Currently, there is no support for paging. There is thus a limit on the
 * size of the range that can be handled in a single call. The function simply
 * return whatever fits into a server page.
 */

// chainweb.headers.recent(0, 3, 10).then(x => console.log("Headers:", x));
// chainweb.blocks.recent(0, 3, 10).then(x => console.log("Blocks:", x));
// chainweb.transactions.recent(0, 3, 50).then(x => console.log("Transactions:", x));
export const eventsRecentList = chainweb.events
  .recent(2, 3, 1000)
  .then((x) => x);

/* ************************************************************************** */
/* Ranges */

/* These functions query items from a range of block heights and return the
 * result as an array.
 *
 * Currently, there is no support for paging. There is thus a limit on the
 * size of the range that can be handled in a single call. The function simply
 * return whatever fits into a server page.
 *
 * Streams are online and only return items from blocks that got mined after the
 * stream was started. They are thus useful for prompt notification of new
 * items. In order of exhaustively querying all, including old, items, one
 * should also use `range` or `recent` queries for the respective type of item.
 */

// chainweb.headers.range(0, 1500000, 1500010).then(x => console.log("Headers:", x));
// chainweb.blocks.range(0, 1500000, 1500010).then(x => console.log("Blocks:", x));
// chainweb.transactions
//   .range(1, 1613200, 1613308)
//   .then((x) => console.log("Transactions:", JSON.stringify(x)));
export const eventsRangeList = chainweb.events
  .range(2, 1500000, 1500010)
  .then((x) => x);

/* ************************************************************************** */
/* Streams */

/* Streams are backed by EventSource clients that retrieve header update
 * events from the Chainweb API.
 *
 * The depth parameter is useful to avoid receiving items from orphaned blocks.
 *
 * The functions buffer, filter, and transform the original events and
 * generate a stream of derived items to which a callback is applied.
 *
 * The functions also return the underlying EventSource object, for more
 * advanced low-level control.
 */

const chains = [0, 1, 9];
// const hs = chainweb.headers.stream(2, chains, console.log);
// const bs = chainweb.blocks.stream(2, chains, console.log);
// const ts = chainweb.transactions.stream(2, chains, x => { console.log(x); });
// const es = chainweb.events.stream(2, chains, x => console.log(x));

/* ************************************************************************** */
/* HeaderBuffer */

export const testHeaderBuffer = () => {
  let output = [];
  const hb = new HeaderBuffer(2, (x) => output.push(x));

  const hdr = (i) => ({
    header: {
      hash: `${i}`,
      parent: `${i - 1}`,
      height: i,
    },
  });

  for (let i = 10; i < 15; ++i) {
    console.log("i:", i);
    console.log("buffer:", hb);
    hb.add(hdr(i));
  }

  // reorg
  for (let i = 13; i < 17; ++i) {
    console.log("i:", i);
    console.log("buffer:", hb);
    hb.add(hdr(i));
  }

  let a = 10;
  return output.every((x) => x.header.hash === a++);
};

// console.log(testHeaderBuffer());
