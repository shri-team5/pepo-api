const createdAtComparatorDesc = (a, b) => b.createdAt - a.createdAt;
const createdAtComparatorAsc = (a, b) => a.createdAt - b.createdAt;

module.exports = {
    createdAtComparatorDesc,
    createdAtComparatorAsc
};
