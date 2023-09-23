/**
 * adds a value to the average
 *
 * @param {number} average
 * @param {number} size
 * @param {number} value
 * @returns {number}
 */
function addToAverage(average, size, value) {
  return (average * size + value) / (size + 1);
}

/**
 * Removes a value from the average
 *
 * @param {number} average
 * @param {number} size
 * @param {number} value
 * @returns {number}
 */
function removeFromAverage(average, size, value) {
  if (size === 1) {
    return 0;
  }
  return (size * average - value) / (size - 1);
}

/**
 * Updates an average based on add or remove
 *
 * @param {string} type
 * @param {number} average
 * @param {number} size
 * @param {number} value
 */
function updateAverage(type, average, size, value) {
  if (type === 'add') {
    return addToAverage(average, size, value);
  } else if (type === 'remove') {
    return removeFromAverage(average, size, value);
  }
}

/**
 * Updates character metrics
 *
 * @param {string} collection
 * @param {object} state
 * @param {UpdateMetrics} updateMetrics
 */
export const updateCollectionMetrics = (collection, state, updateMetrics) => {
  const metrics = { ...state.market.metrics.get(collection) };
  if (updateMetrics.averageLevel) {
    metrics.averageLevel = updateAverage(
      updateMetrics.averageLevel.type,
      metrics.averageLevel,
      metrics.collectionSize,
      updateMetrics.averageLevel.value,
    );
  }
  if (updateMetrics.marketplaceAverageLevel) {
    metrics.marketplaceAverageLevel = updateAverage(
      updateMetrics.marketplaceAverageLevel.type,
      metrics.marketplaceAverageLevel,
      state.market.characterEntries.getSize(),
      updateMetrics.marketplaceAverageLevel.value,
    );
  }
  if (updateMetrics.latestSalePrice)
    metrics.latestSalePrice = updateMetrics.latestSalePrice;
  if (updateMetrics.collectionSize) metrics.collectionSize += 1;
  if (updateMetrics.amountSold) metrics.amountSold += 1;
  if (updateMetrics.putForSaleCount) metrics.putForSaleCount += 1;

  state.market.metrics.set(collection, metrics);
  return metrics;
};
