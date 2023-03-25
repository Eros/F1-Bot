import NodeCache from "node-cache";

const cache = new NodeCache({stdTTL: 6_000, checkperiod: 60})

export default cache;