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
 * @param {object} state
 * @param {UpdateMetrics} updateMetrics
 * @param {import("@agoric/zoe/src/contractSupport").RecorderKit} marketCharacterMetricsKit
 */
export function updateCharacterMetrics(
  state,
  updateMetrics,
  marketCharacterMetricsKit,
) {
  if (updateMetrics.averageLevel) {
    state.characterAverageLevel = updateAverage(
      updateMetrics.averageLevel.type,
      state.characterAverageLevel,
      state.characterCollectionSize,
      updateMetrics.averageLevel.value,
    );
  }
  if (updateMetrics.marketplaceAverageLevel) {
    state.characterMarketplaceAverageLevel = updateAverage(
      updateMetrics.marketplaceAverageLevel.type,
      state.characterMarketplaceAverageLevel,
      state.market.characterEntries.getSize(),
      updateMetrics.marketplaceAverageLevel.value,
    );
  }
  if (updateMetrics.latestSalePrice)
    state.characterLatestSalePrice = updateMetrics.latestSalePrice;
  if (updateMetrics.collectionSize) state.characterCollectionSize += 1;
  if (updateMetrics.amountSold) state.characterAmountSold += 1;

  marketCharacterMetricsKit.recorder.write({
    collectionSize: state.characterCollectionSize,
    averageLevel: state.characterAverageLevel,
    marketplaceAverageLevel: state.characterMarketplaceAverageLevel,
    amountSold: state.characterAmountSold,
  });
}

/**
 * Updates item metrics
 *
 * @param {object} state
 * @param {UpdateMetrics} updateMetrics
 * @param {import("@agoric/zoe/src/contractSupport").RecorderKit} marketItemMetricsKit
 */
export function updateItemMetrics(state, updateMetrics, marketItemMetricsKit) {
  if (updateMetrics.averageLevel) {
    state.itemAverageLevel = updateAverage(
      updateMetrics.averageLevel.type,
      state.itemAverageLevel,
      state.itemCollectionSize,
      updateMetrics.averageLevel.value,
    );
  }
  if (updateMetrics.marketplaceAverageLevel) {
    state.itemMarketplaceAverageLevel = updateAverage(
      updateMetrics.marketplaceAverageLevel.type,
      state.itemMarketplaceAverageLevel,
      state.market.itemEntries.getSize(),
      updateMetrics.marketplaceAverageLevel.value,
    );
  }
  if (updateMetrics.latestSalePrice)
    state.itemLatestSalePrice = updateMetrics.latestSalePrice;
  if (updateMetrics.collectionSize) state.itemCollectionSize += 1;
  if (updateMetrics.amountSold) state.itemAmountSold += 1;

  marketItemMetricsKit.recorder.write({
    collectionSize: state.itemCollectionSize,
    averageLevel: state.itemAverageLevel,
    marketplaceAverageLevel: state.itemMarketplaceAverageLevel,
    amountSold: state.itemAmountSold,
  });
}
